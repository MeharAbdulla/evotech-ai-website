from datetime import datetime, UTC
from typing import List, Optional
from fastapi import APIRouter, status, Depends, HTTPException, Query
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, Field
from pymongo import ReturnDocument

from app.database import get_database
from app.schemas.consultation_schema import ConsultationCreate, ConsultationResponse
from app.auth.deps import require_admin
from app.services.email_service import send_consultation_email

router = APIRouter(prefix="/consultations", tags=["Consultations"])


class ConsultationStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(New|Read|Replied|Closed)$")


def map_consultation(doc: dict) -> ConsultationResponse:
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
    return ConsultationResponse(**doc)


@router.post("/", response_model=ConsultationResponse, status_code=status.HTTP_201_CREATED)
async def create_consultation(
    payload: ConsultationCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Public endpoint: save a free-consultation request from the website form."""
    now = datetime.now(UTC)
    document = {
        "_id": ObjectId(),
        "full_name": payload.full_name.strip(),
        "company_name": payload.company_name.strip(),
        "email": payload.email.strip().lower(),
        "phone_number": payload.phone_number.strip(),
        "country": payload.country.strip(),
        "service": payload.service.strip(),
        "budget": payload.budget.strip() if payload.budget else None,
        "description": payload.description.strip(),
        "status": "New",
        "created_at": now,
        "updated_at": now,
    }
    await db["consultations"].insert_one(document)
    created = await db["consultations"].find_one({"_id": document["_id"]})

    # Notify inbox by email (does not fail the request if SMTP is down)
    await send_consultation_email(
        {
            "full_name": document["full_name"],
            "company_name": document["company_name"],
            "email": document["email"],
            "phone_number": document["phone_number"],
            "country": document["country"],
            "service": document["service"],
            "budget": document.get("budget") or "",
            "description": document["description"],
        }
    )

    return map_consultation(created)


@router.get("/", response_model=List[ConsultationResponse])
async def list_consultations(
    status_filter: Optional[str] = Query(None, alias="status"),
    db: AsyncIOMotorDatabase = Depends(get_database),
    _admin: dict = Depends(require_admin),
):
    """Admin: list consultation / lead messages."""
    query = {}
    if status_filter:
        query["status"] = status_filter
    cursor = db["consultations"].find(query).sort("created_at", -1)
    docs = await cursor.to_list(length=200)
    return [map_consultation(d) for d in docs]


@router.patch("/{id}", response_model=ConsultationResponse)
async def update_consultation_status(
    id: str,
    payload: ConsultationStatusUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    _admin: dict = Depends(require_admin),
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid consultation ID")
    result = await db["consultations"].find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": {"status": payload.status, "updated_at": datetime.now(UTC)}},
        return_document=ReturnDocument.AFTER,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Consultation not found")
    return map_consultation(result)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_consultation(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    _admin: dict = Depends(require_admin),
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid consultation ID")
    result = await db["consultations"].delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Consultation not found")
