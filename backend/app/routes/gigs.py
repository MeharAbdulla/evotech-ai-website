from datetime import datetime, UTC
from typing import List, Optional

from fastapi import APIRouter, HTTPException, status, Depends, File, UploadFile, Form, Query
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import ValidationError

from app.database import get_database
from app.schemas.gig_schema import GigCreate, GigUpdate, GigResponse
from app.services.upload_service import UploadService

router = APIRouter(prefix="/gigs", tags=["Gigs"])
upload_service = UploadService()


def map_gig_document(doc: dict) -> GigResponse:
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
    doc.setdefault("skills", [])
    doc.setdefault("featured", False)
    return GigResponse(**doc)


@router.get("/", response_model=List[GigResponse])
async def get_gigs(
    status_filter: Optional[str] = Query(None, alias="status"),
    category: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    query = {}
    if status_filter:
        query["status"] = status_filter
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured

    cursor = db["gigs"].find(query).sort("created_at", -1)
    gigs = await cursor.to_list(length=100)
    return [map_gig_document(g) for g in gigs]


@router.get("/{id}", response_model=GigResponse)
async def get_gig(id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid gig ID format")
    gig = await db["gigs"].find_one({"_id": ObjectId(id)})
    if not gig:
        raise HTTPException(status_code=404, detail="Gig not found")
    return map_gig_document(gig)


@router.post("/", response_model=GigResponse, status_code=status.HTTP_201_CREATED)
async def create_gig(
    title: str = Form(...),
    short_description: str = Form(...),
    full_description: Optional[str] = Form(None),
    category: str = Form(...),
    budget: Optional[str] = Form(None),
    duration: Optional[str] = Form(None),
    skills: List[str] = Form([]),
    gig_status: str = Form("Open", alias="status"),
    featured: bool = Form(False),
    image: Optional[UploadFile] = File(None),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    try:
        validation = GigCreate(
            title=title,
            short_description=short_description,
            full_description=full_description,
            category=category,
            budget=budget,
            duration=duration,
            skills=skills or [],
            status=gig_status,
            featured=featured,
        )
    except ValidationError as error:
        raise HTTPException(status_code=422, detail=str(error))

    gig_id = ObjectId()
    saved_image = None
    if image and image.filename:
        try:
            saved_image = await upload_service.save_file(
                file=image, category="gigs", entity_id=str(gig_id)
            )
        except RuntimeError as error:
            raise HTTPException(status_code=500, detail=str(error))

    now = datetime.now(UTC)
    document = {
        "_id": gig_id,
        "title": validation.title,
        "short_description": validation.short_description,
        "full_description": validation.full_description,
        "category": validation.category,
        "budget": validation.budget,
        "duration": validation.duration,
        "skills": validation.skills,
        "status": validation.status,
        "featured": validation.featured,
        "image": saved_image,
        "created_at": now,
        "updated_at": now,
    }
    await db["gigs"].insert_one(document)
    created = await db["gigs"].find_one({"_id": gig_id})
    return map_gig_document(created)


@router.put("/{id}", response_model=GigResponse)
async def update_gig(
    id: str,
    title: Optional[str] = Form(None),
    short_description: Optional[str] = Form(None),
    full_description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    budget: Optional[str] = Form(None),
    duration: Optional[str] = Form(None),
    skills: Optional[List[str]] = Form(None),
    gig_status: Optional[str] = Form(None, alias="status"),
    featured: Optional[bool] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid gig ID format")

    existing = await db["gigs"].find_one({"_id": ObjectId(id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Gig not found")

    try:
        validation = GigUpdate(
            title=title,
            short_description=short_description,
            full_description=full_description,
            category=category,
            budget=budget,
            duration=duration,
            skills=skills,
            status=gig_status,
            featured=featured,
        )
    except ValidationError as error:
        raise HTTPException(status_code=422, detail=str(error))

    updates = validation.model_dump(exclude_unset=True)
    if image and image.filename:
        try:
            updates["image"] = await upload_service.save_file(
                file=image, category="gigs", entity_id=id
            )
        except RuntimeError as error:
            raise HTTPException(status_code=500, detail=str(error))

    updates["updated_at"] = datetime.now(UTC)
    await db["gigs"].update_one({"_id": ObjectId(id)}, {"$set": updates})
    updated = await db["gigs"].find_one({"_id": ObjectId(id)})
    return map_gig_document(updated)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_gig(id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid gig ID format")
    result = await db["gigs"].delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gig not found")
