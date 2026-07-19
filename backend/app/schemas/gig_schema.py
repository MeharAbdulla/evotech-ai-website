from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field, BeforeValidator
from typing_extensions import Annotated


def empty_str_to_none(v: Any) -> Any:
    if isinstance(v, str) and not v.strip():
        return None
    return v


OptionalStr = Annotated[Optional[str], BeforeValidator(empty_str_to_none)]

STATUS_PATTERN = "^(Open|In Progress|Closed|Featured)$"


class GigCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=120)
    short_description: str = Field(..., max_length=300)
    full_description: OptionalStr = None
    category: str = Field(..., min_length=2, max_length=80)
    budget: OptionalStr = None
    duration: OptionalStr = None
    skills: List[str] = Field(default_factory=list)
    status: str = Field(default="Open", pattern=STATUS_PATTERN)
    featured: bool = False
    image: OptionalStr = None


class GigUpdate(BaseModel):
    title: Optional[str] = None
    short_description: Optional[str] = None
    full_description: OptionalStr = None
    category: Optional[str] = None
    budget: OptionalStr = None
    duration: OptionalStr = None
    skills: Optional[List[str]] = None
    status: Optional[str] = Field(None, pattern=STATUS_PATTERN)
    featured: Optional[bool] = None
    image: OptionalStr = None


class GigResponse(BaseModel):
    id: str
    title: str
    short_description: str
    full_description: Optional[str] = None
    category: str
    budget: Optional[str] = None
    duration: Optional[str] = None
    skills: List[str] = []
    status: str
    featured: bool = False
    image: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"populate_by_name": True, "from_attributes": True}
