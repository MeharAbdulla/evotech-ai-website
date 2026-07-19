from datetime import datetime, UTC
from typing import List, Optional

from fastapi import (
    APIRouter,
    HTTPException,
    status,
    Depends,
    File,
    UploadFile,
    Form
)

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import ValidationError

from app.database import get_database
from app.schemas.developer_schema import (
    DeveloperCreate,
    DeveloperUpdate,
    DeveloperResponse
)
from app.services.upload_service import UploadService


router = APIRouter(
    prefix="/developers",
    tags=["Developers"]
)


upload_service = UploadService()


def map_developer_document(doc: dict) -> DeveloperResponse:
    """
    Convert MongoDB document into API response format. Sanitizes legacy empty/invalid URL fields to None
    to prevent response serialization failures.
    """

    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])

    # Ensure we sanitize fields that might have stored un-serializable values (e.g. "string", "")
    for field in ["github_url", "linkedin_url"]:
        if field in doc:
            val = doc[field]
            if not val or (isinstance(val, str) and not val.strip()) or val == "string":
                doc[field] = None

    return DeveloperResponse(**doc)



# =====================================================
# GET ALL DEVELOPERS
# =====================================================

@router.get("/", response_model=List[DeveloperResponse])
async def get_developers(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieve all developers.
    """

    cursor = db["developers"].find().sort(
        "created_at",
        -1
    )

    developers = await cursor.to_list(length=100)

    return [
        map_developer_document(dev)
        for dev in developers
    ]



# =====================================================
# GET SINGLE DEVELOPER
# =====================================================

@router.get("/{id}", response_model=DeveloperResponse)
async def get_developer(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieve developer by ID.
    """

    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=400,
            detail="Invalid developer ID format"
        )


    developer = await db["developers"].find_one(
        {
            "_id": ObjectId(id)
        }
    )


    if not developer:
        raise HTTPException(
            status_code=404,
            detail="Developer not found"
        )


    return map_developer_document(developer)




# =====================================================
# CREATE DEVELOPER WITH PROFILE IMAGE
# =====================================================

@router.post(
    "/",
    response_model=DeveloperResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_developer(

    name: str = Form(...),

    role: str = Form(...),

    bio: str = Form(...),

    skills: List[str] = Form(...),

    experience: Optional[str] = Form(None),

    github_url: Optional[str] = Form(None),

    linkedin_url: Optional[str] = Form(None),

    developer_status: str = Form(
        "Active",
        alias="status"
    ),

    profile_image: Optional[UploadFile] = File(None),


    db: AsyncIOMotorDatabase = Depends(get_database)

):


    try:

        validation = DeveloperCreate(

            name=name,

            role=role,

            bio=bio,

            skills=skills,

            experience=experience,

            github_url=github_url,

            linkedin_url=linkedin_url,

            status=developer_status

        )


    except ValidationError as error:

        raise HTTPException(
            status_code=422,
            detail=str(error)
        )



    developer_id = ObjectId()

    developer_string_id = str(developer_id)



    saved_image = None


    try:

        if profile_image and profile_image.filename:

            saved_image = await upload_service.save_file(

                file=profile_image,

                category="developers",

                entity_id=developer_string_id

            )


    except RuntimeError as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )



    now = datetime.now(UTC)



    developer_document = {
    "_id": developer_id,
    "name": name,
    "role": role,
    "bio": bio,
    "skills": skills,
    "experience": experience,

    "profile_image": saved_image,

    "github_url": str(validation.github_url)
        if validation.github_url else None,

    "linkedin_url": str(validation.linkedin_url)
        if validation.linkedin_url else None,

    "status": developer_status,

    "created_at": now,
    "updated_at": now
}


    await db["developers"].insert_one(
        developer_document
    )


    created = await db["developers"].find_one(
        {
            "_id": developer_id
        }
    )


    return map_developer_document(created)





# =====================================================
# UPDATE DEVELOPER WITH OPTIONAL IMAGE CHANGE
# =====================================================


@router.put(
    "/{id}",
    response_model=DeveloperResponse
)
async def update_developer(

    id: str,


    name: Optional[str] = Form(None),

    role: Optional[str] = Form(None),

    bio: Optional[str] = Form(None),

    skills: Optional[List[str]] = Form(None),

    experience: Optional[str] = Form(None),

    github_url: Optional[str] = Form(None),

    linkedin_url: Optional[str] = Form(None),

    developer_status: Optional[str] = Form(
        None,
        alias="status"
    ),


    profile_image: Optional[UploadFile] = File(None),


    db: AsyncIOMotorDatabase = Depends(get_database)

):


    if not ObjectId.is_valid(id):

        raise HTTPException(
            status_code=400,
            detail="Invalid developer ID format"
        )



    existing = await db["developers"].find_one(
        {
            "_id": ObjectId(id)
        }
    )


    if not existing:

        raise HTTPException(
            status_code=404,
            detail="Developer not found"
        )



    update_data = {}

    fields = {
        "name": name,
        "role": role,
        "bio": bio,
        "skills": skills,
        "experience": experience,
        "github_url": github_url,
        "linkedin_url": linkedin_url,
        "status": developer_status
    }

    # Filter incoming values to ignore unset, None, blank strings, empty lists, and Swagger defaults ("string")
    for key, value in fields.items():

        if value is None:
            continue

        if isinstance(value, str):
            value = value.strip()
            if value == "" or value.lower() == "string":
                continue

        if isinstance(value, list):
            # Strip string-type elements within the skills list and filter out blank elements
            value = [item.strip() for item in value if isinstance(item, str) and item.strip() and item.lower() != "string"]
            if len(value) == 0:
                continue

        update_data[key] = value



    # Validate processed update fields using DeveloperUpdate Pydantic model
    if update_data:
        try:
            # We initialize DeveloperUpdate selectively containing only incoming changed values
            validation = DeveloperUpdate(**update_data)
            
            # Serialize model dumping matching keys, converting Pydantic Url structures to clean strings
            for key in list(update_data.keys()):
                validated_value = getattr(validation, key, None)
                if validated_value is not None:
                    # Convert HttpUrl representations safely to standard strings
                    if hasattr(validated_value, "unicode_string"):
                        update_data[key] = str(validated_value)
                    else:
                        update_data[key] = validated_value
                else:
                    # If the Pydantic validator output is None (e.g. sanitized URL validation formats), delete from payload
                    update_data.pop(key, None)
        except ValidationError as error:
            raise HTTPException(
                status_code=422,
                detail=str(error)
            )



    try:

        if profile_image and profile_image.filename:

            update_data["profile_image"] = await upload_service.save_file(

                file=profile_image,

                category="developers",

                entity_id=id

            )


    except RuntimeError as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )



    if not update_data:

        raise HTTPException(
            status_code=400,
            detail="No modifications provided"
        )



    update_data["updated_at"] = datetime.now(UTC)



    await db["developers"].update_one(

        {
            "_id": ObjectId(id)
        },

        {
            "$set": update_data
        }

    )



    updated = await db["developers"].find_one(

        {
            "_id": ObjectId(id)
        }

    )


    return map_developer_document(updated)





# =====================================================
# DELETE DEVELOPER
# =====================================================


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_developer(

    id: str,

    db: AsyncIOMotorDatabase = Depends(get_database)

):


    if not ObjectId.is_valid(id):

        raise HTTPException(
            status_code=400,
            detail="Invalid developer ID format"
        )



    result = await db["developers"].delete_one(

        {
            "_id": ObjectId(id)
        }

    )



    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Developer not found"
        )


    return None