from datetime import datetime
from typing import List, Optional, Any

from pydantic import BaseModel, Field, HttpUrl, BeforeValidator
from typing_extensions import Annotated


def empty_str_to_none(v: Any) -> Any:
    """
    Converts empty strings into None values.
    """
    if isinstance(v, str) and not v.strip():
        return None

    return v


OptionalUrl = Annotated[
    Optional[HttpUrl],
    BeforeValidator(empty_str_to_none)
]


STATUS_PATTERN = "^(Active|Inactive|Available|Busy)$"



class DeveloperCreate(BaseModel):
    """
    Schema used when creating a developer.
    """

    name: str = Field(..., min_length=3, max_length=100)

    role: str = Field(..., min_length=2, max_length=100)

    bio: str

    skills: List[str] = Field(..., min_items=1)

    experience: Optional[str] = None

    github_url: OptionalUrl = None

    linkedin_url: OptionalUrl = None

    status: str = Field(
        default="Active",
        pattern=STATUS_PATTERN
    )

    profile_image: Optional[str] = None



class DeveloperUpdate(BaseModel):
    """
    Schema used for partial developer updates.
    """

    name: Optional[str] = None

    role: Optional[str] = None

    bio: Optional[str] = None

    skills: Optional[List[str]] = None

    experience: Optional[str] = None

    github_url: OptionalUrl = None

    linkedin_url: OptionalUrl = None

    status: Optional[str] = Field(
        None,
        pattern=STATUS_PATTERN
    )

    profile_image: Optional[str] = None



class DeveloperResponse(BaseModel):
    """
    API response schema.
    """

    id: str = Field(..., alias="id")

    name: str

    role: str

    bio: str

    skills: List[str]

    experience: Optional[str] = None

    profile_image: Optional[str] = None

    github_url: Optional[HttpUrl] = None

    linkedin_url: Optional[HttpUrl] = None

    status: str

    created_at: datetime

    updated_at: datetime


    model_config = {
        "populate_by_name": True,
        "from_attributes": True
    }