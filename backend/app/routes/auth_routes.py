from fastapi import APIRouter, HTTPException
from app.database import get_database
from app.auth.hash import verify_password
from app.auth.jwt import create_access_token
from app.schemas.auth_schema import LoginRequest


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
async def login(data: LoginRequest):
    db = await get_database()

    user = await db.users.find_one({"username": data.username})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"username": user["username"], "role": user["role"]})

    return {
        "success": True,
        "token": token
    }