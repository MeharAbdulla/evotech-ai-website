from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class PyObjectId(str):
    """
    Custom type to handle MongoDB ObjectId serialization safely in Pydantic.
    """
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core import core_schema
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.chain_schema([
                core_schema.str_schema(),
                core_schema.no_info_plain_validator_function(cls.validate),
            ]),
        )

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId format")
        return str(v)

class ProjectDB(BaseModel):
    """
    Internal MongoDB Document representation for a Project.
    """
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    title: str
    short_description: str
    full_description: str
    technologies: List[str] = Field(default_factory=list)
    category: str
    status: str  # e.g., "Planning", "Development", "In Progress", "Active", "Completed", "Cancelled"
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    featured: bool = False
    thumbnail_image: Optional[str] = None
    gallery_images: List[str] = Field(default_factory=list)
    zip_file: Optional[str] = None
    pdf_document: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }