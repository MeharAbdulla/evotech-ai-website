from datetime import datetime, UTC
from typing import List, Optional
from typing_extensions import Annotated
from fastapi import APIRouter, HTTPException, status, Query, Depends, File, UploadFile, Form
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.schemas.project_schema import ProjectCreate, ProjectUpdate, ProjectResponse
from app.services.upload_service import UploadService

from pydantic import ValidationError

router = APIRouter(prefix="/projects", tags=["Projects"])

# Single reusable instance of the upload management service
upload_service = UploadService()

def map_project_document(doc: dict) -> ProjectResponse:
    """Helper mapping function to safely turn BSON dict formats into Pydantic responses."""
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
    return ProjectResponse(**doc)

@router.get("/", response_model=List[ProjectResponse])
async def get_projects(
    featured: Optional[bool] = Query(None),
    category: Optional[str] = Query(None),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Retrieve all projects with optional filtering by featured status or category."""
    query = {}
    if featured is not None:
        query["featured"] = featured
    if category is not None:
        query["category"] = category

    cursor = db["projects"].find(query).sort("created_at", -1)
    projects = await cursor.to_list(length=100)
    return [map_project_document(p) for p in projects]

@router.get("/{id}", response_model=ProjectResponse)
async def get_project(id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Retrieve a single project by its unique hex ID."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project ID format")
    
    project = await db["projects"].find_one({"_id": ObjectId(id)})
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        
    return map_project_document(project)

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    title: str = Form(...),
    short_description: str = Form(...),
    full_description: str = Form(...),
    technologies: List[str] = Form(...),
    category: str = Form(...),
    status_field: str = Form(..., alias="status"),
    github_url: Optional[str] = Form(None),
    live_demo_url: Optional[str] = Form(None),
    featured: bool = Form(False),
    thumbnail: Optional[UploadFile] = File(None),
    gallery_images: Annotated[
        List[UploadFile], 
        File(description="Multiple gallery images")
    ] = [],
    zip_file: Optional[UploadFile] = File(None),
    pdf_document: Optional[UploadFile] = File(None),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Insert a new engineering project record with inline file assets directly into MongoDB."""
    
    # 1. Pipeline validation execution through Pydantic to maintain validation sync
    try:
        # Normalize incoming clean strings or transform blanks to clean None references
        clean_github = github_url if github_url and github_url.strip() else None
        clean_live = live_demo_url if live_demo_url and live_demo_url.strip() else None

        # Instantiate schema validator logic cleanly
        ProjectCreate(
            title=title,
            short_description=short_description,
            full_description=full_description,
            technologies=technologies,
            category=category,
            status=status_field,
            github_url=clean_github,
            live_demo_url=clean_live,
            featured=featured
        )
    except ValidationError as val_err:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(val_err))

    # 2. Pre-generate targeted document ObjectId to use as file structure key bounds
    project_id = ObjectId()
    str_entity_id = str(project_id)

    # 3. Secure file system ingestion maps
    saved_thumbnail_path = None
    saved_gallery_paths = []
    saved_zip_path = None
    saved_pdf_path = None

    try:
        # Process individual thumbnail file
        if thumbnail and thumbnail.filename:
            saved_thumbnail_path = await upload_service.save_file(
                file=thumbnail, category="projects", entity_id=str_entity_id
            )

        # Process multiple gallery images list structures
        if gallery_images:
            for g_file in gallery_images:
                if g_file.filename:
                    g_path = await upload_service.save_file(
                        file=g_file, category="projects", entity_id=str_entity_id
                    )
                    saved_gallery_paths.append(g_path)

        # Process associated execution ZIP files
        if zip_file and zip_file.filename:
            saved_zip_path = await upload_service.save_file(
                file=zip_file, category="projects", entity_id=str_entity_id
            )

        # Process associated blueprint specifications or report documents
        if pdf_document and pdf_document.filename:
            saved_pdf_path = await upload_service.save_file(
                file=pdf_document, category="projects", entity_id=str_entity_id
            )

    except RuntimeError as upload_err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File persistence runtime layer failure: {str(upload_err)}"
        )

    # 4. Construct production DB entity map targeting pre-generated _id boundaries
    now = datetime.now(UTC)
    project_dict = {
        "_id": project_id,
        "title": title,
        "short_description": short_description,
        "full_description": full_description,
        "technologies": technologies,
        "category": category,
        "status": status_field,
        "github_url": clean_github,
        "live_demo_url": clean_live,
        "featured": featured,
        "thumbnail_image": saved_thumbnail_path,
        "gallery_images": saved_gallery_paths,
        "zip_file": saved_zip_path,
        "pdf_document": saved_pdf_path,
        "created_at": now,
        "updated_at": now
    }

    # 5. Commit record and return mapped projection
    await db["projects"].insert_one(project_dict)
    inserted_project = await db["projects"].find_one({"_id": project_id})
    
    return map_project_document(inserted_project)

@router.put("/{id}", response_model=ProjectResponse)
async def update_project(
    id: str,
    title: Optional[str] = Form(None),
    short_description: Optional[str] = Form(None),
    full_description: Optional[str] = Form(None),
    technologies: Optional[List[str]] = Form(None),
    category: Optional[str] = Form(None),
    status_field: Optional[str] = Form(None, alias="status"),
    github_url: Optional[str] = Form(None),
    live_demo_url: Optional[str] = Form(None),
    featured: Optional[bool] = Form(None),
    thumbnail: Optional[UploadFile] = File(None),
    gallery_images: Annotated[
        List[UploadFile], 
        File(description="Multiple gallery images to append or replace")
    ] = [],
    zip_file: Optional[UploadFile] = File(None),
    pdf_document: Optional[UploadFile] = File(None),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Modify an existing project record selectively using multipart Form and File inputs."""
    # 1. Validate ObjectId format
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project ID format")
    
    # 2. Verify target document exists
    project_oid = ObjectId(id)
    existing_project = await db["projects"].find_one({"_id": project_oid})
    if not existing_project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # 3. Handle schema/data validation using Pydantic validation pipeline
    try:
        clean_github = github_url if github_url and github_url.strip() else None
        clean_live = live_demo_url if live_demo_url and live_demo_url.strip() else None

        # Run validation through ProjectUpdate to respect validation constraints (e.g. status patterns)
        validation_payload = ProjectUpdate(
            title=title,
            short_description=short_description,
            full_description=full_description,
            technologies=technologies,
            category=category,
            status=status_field,
            github_url=clean_github,
            live_demo_url=clean_live,
            featured=featured
        )
    except ValidationError as val_err:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(val_err))

    # 4. Map form payload values to the update dictionary (excluding unset/None parameters)
    update_data = {
        k: v for k, v in validation_payload.model_dump(
    exclude_none=True,
    mode="json"
    ).items() 
        if v is not None
    }

    # 5. Process new file uploads using UploadService (preserving existing paths on omissions)
    try:
        if thumbnail and thumbnail.filename:
            update_data["thumbnail_image"] = await upload_service.save_file(
                file=thumbnail, category="projects", entity_id=id
            )

        if gallery_images:
            # Filter empty filenames sent by empty multipart submissions
            valid_images = [img for img in gallery_images if img.filename]
            if valid_images:
                saved_gallery_paths = []
                for g_file in valid_images:
                    g_path = await upload_service.save_file(
                        file=g_file, category="projects", entity_id=id
                    )
                    saved_gallery_paths.append(g_path)
                # Overwrite/replace gallery image entries
                update_data["gallery_images"] = saved_gallery_paths

        if zip_file and zip_file.filename:
            update_data["zip_file"] = await upload_service.save_file(
                file=zip_file, category="projects", entity_id=id
            )

        if pdf_document and pdf_document.filename:
            update_data["pdf_document"] = await upload_service.save_file(
                file=pdf_document, category="projects", entity_id=id
            )

    except RuntimeError as upload_err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File update persistence failure: {str(upload_err)}"
        )

    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No field modifications provided")

    # 6. Apply enterprise baseline update management timestamp
    update_data["updated_at"] = datetime.now(UTC)

    # 7. Persist changes in MongoDB and retrieve updated projection
    await db["projects"].update_one(
        {"_id": project_oid},
        {"$set": update_data}
    )

    updated_project = await db["projects"].find_one({"_id": project_oid})
    return map_project_document(updated_project)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Remove a project from the system ecosystem completely."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project ID format")
        
    result = await db["projects"].delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        
    return None

@router.post(
    "/{id}/upload", 
    status_code=status.HTTP_200_OK,
    response_model=dict
)
async def upload_project_file(
    id: str, 
    file: UploadFile = File(...), 
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Upload and allocate system document assets (ZIP, diagrams, images) to a validated project context.
    """
    # 1. Validate ObjectId format
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project ID format")
    
    # 2. Verify targeted project entity exists in the cluster database layer
    project = await db["projects"].find_one({"_id": ObjectId(id)})
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    try:
        # 3. Offload tracking stream parsing logic to the isolated domain architecture service layer
        saved_path = await upload_service.save_file(
            file=file,
            category="projects",
            entity_id=id
        )
        return {"file_path": saved_path}
        
    except RuntimeError as exc:
        # 4. Gracefully catch generic Python exceptions and wrap them to preserve underlying core details
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(exc)
        )