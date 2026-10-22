from datetime import datetime, UTC
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, Field

from app.database import get_database
from app.auth.deps import require_admin
from app.auth.hash import hash_password

router = APIRouter(prefix="/users", tags=["Users"])


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=64)
    password: str = Field(..., min_length=6, max_length=128)
    role: str = Field(default="admin", pattern="^(admin)$")


class UserResponse(BaseModel):
    id: str
    username: str
    role: str
    created_at: Optional[datetime] = None


@router.get("/", response_model=List[UserResponse])
async def list_users(
    db: AsyncIOMotorDatabase = Depends(get_database),
    _admin: dict = Depends(require_admin),
):
    cursor = db["users"].find({}, {"password": 0}).sort("username", 1)
    docs = await cursor.to_list(length=100)
    return [
        UserResponse(
            id=str(d["_id"]),
            username=d.get("username", ""),
            role=d.get("role", "admin"),
            created_at=d.get("created_at"),
        )
        for d in docs
    ]


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    payload: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    _admin: dict = Depends(require_admin),
):
    existing = await db["users"].find_one({"username": payload.username.strip()})
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    now = datetime.now(UTC)
    doc = {
        "username": payload.username.strip(),
        "password": hash_password(payload.password),
        "role": payload.role,
        "created_at": now,
    }
    result = await db["users"].insert_one(doc)
    return UserResponse(
        id=str(result.inserted_id),
        username=doc["username"],
        role=doc["role"],
        created_at=now,
    )


@router.delete("/{username}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    username: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    admin: dict = Depends(require_admin),
):
    if username == admin.get("username"):
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    result = await db["users"].delete_one({"username": username})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
