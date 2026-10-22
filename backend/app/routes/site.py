from datetime import datetime, UTC
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, Field
from typing import Optional

from app.database import get_database
from app.auth.deps import require_admin

router = APIRouter(prefix="/site", tags=["Site Settings"])

COMPANY_KEY = "company_info"
SETTINGS_KEY = "system_settings"


class CompanyInfo(BaseModel):
    company_name: str = "Aeromek AI"
    tagline: str = "Automate. Innovate. Elevate."
    email: str = "evotechnologyus@gmail.com"
    phone: str = "0321 7691508"
    address: str = "Engineering & remote delivery worldwide"
    about: str = "Aeromek AI builds practical AI agents, robotics, embedded systems, and IoT solutions."
    website: str = "https://aeromek.com"


class SystemSettings(BaseModel):
    whatsapp_number: str = "923217691508"
    support_email: str = "evotechnologyus@gmail.com"
    maintenance_mode: bool = False
    notify_new_leads: bool = True
    default_timezone: str = "Asia/Karachi"


DEFAULT_COMPANY = CompanyInfo().model_dump()
DEFAULT_SETTINGS = SystemSettings().model_dump()


@router.get("/company", response_model=CompanyInfo)
async def get_company(db: AsyncIOMotorDatabase = Depends(get_database)):
    doc = await db["site_config"].find_one({"_id": COMPANY_KEY})
    if not doc:
        return CompanyInfo()
    data = {k: v for k, v in doc.items() if k != "_id"}
    return CompanyInfo(**{**DEFAULT_COMPANY, **data})


@router.put("/company", response_model=CompanyInfo)
async def update_company(
    payload: CompanyInfo,
    db: AsyncIOMotorDatabase = Depends(get_database),
    _admin: dict = Depends(require_admin),
):
    data = payload.model_dump()
    data["updated_at"] = datetime.now(UTC)
    await db["site_config"].update_one(
        {"_id": COMPANY_KEY},
        {"$set": data},
        upsert=True,
    )
    return payload


@router.get("/settings", response_model=SystemSettings)
async def get_settings(
    db: AsyncIOMotorDatabase = Depends(get_database),
    _admin: dict = Depends(require_admin),
):
    doc = await db["site_config"].find_one({"_id": SETTINGS_KEY})
    if not doc:
        return SystemSettings()
    data = {k: v for k, v in doc.items() if k not in ("_id", "updated_at")}
    return SystemSettings(**{**DEFAULT_SETTINGS, **data})


@router.put("/settings", response_model=SystemSettings)
async def update_settings(
    payload: SystemSettings,
    db: AsyncIOMotorDatabase = Depends(get_database),
    _admin: dict = Depends(require_admin),
):
    data = payload.model_dump()
    data["updated_at"] = datetime.now(UTC)
    await db["site_config"].update_one(
        {"_id": SETTINGS_KEY},
        {"$set": data},
        upsert=True,
    )
    return payload
