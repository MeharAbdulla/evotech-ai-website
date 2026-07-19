from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field, HttpUrl, BeforeValidator
from typing_extensions import Annotated

def empty_str_to_none(v: Any) -> Any:
    """Converts empty strings or whitespace-only strings to None."""
    if isinstance(v, str) and not v.strip():
        return None
    return v

# Reusable type modifier to cleanly pre-process incoming string fields
OptionalUrl = Annotated[Optional[HttpUrl], BeforeValidator(empty_str_to_none)]

# Regex pattern reflecting expanded enterprise state machine requirements
STATUS_PATTERN = "^(Planning|Development|In Progress|Active|Completed|Cancelled)$"

class ProjectCreate(BaseModel):
    """Schema for validating data when creating a new project."""
    title: str = Field(..., min_length=3, max_length=100)
    short_description: str = Field(..., max_length=250)
    full_description: str
    technologies: List[str] = Field(..., min_items=1)
    category: str
    status: str = Field(..., pattern=STATUS_PATTERN)
    github_url: OptionalUrl = None
    live_demo_url: OptionalUrl = None
    featured: bool = False
    thumbnail_image: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    zip_file: Optional[str] = None
    pdf_document: Optional[str] = None

class ProjectUpdate(BaseModel):
    """Schema for validating data when updating an existing project (All fields optional)."""
    title: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    technologies: Optional[List[str]] = None
    category: Optional[str] = None
    status: Optional[str] = Field(None, pattern=STATUS_PATTERN)
    github_url: OptionalUrl = None
    live_demo_url: OptionalUrl = None
    featured: Optional[bool] = None
    thumbnail_image: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    zip_file: Optional[str] = None
    pdf_document: Optional[str] = None

class ProjectResponse(BaseModel):
    """Schema for structured API outbound responses."""
    id: str = Field(..., alias="id")
    title: str
    short_description: str
    full_description: str
    technologies: List[str]
    category: str
    status: str
    github_url: Optional[HttpUrl] = None
    live_demo_url: Optional[HttpUrl] = None
    featured: bool
    thumbnail_image: Optional[str] = None
    gallery_images: List[str]
    zip_file: Optional[str] = None
    pdf_document: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "populate_by_name": True,
        "from_attributes": True
    }