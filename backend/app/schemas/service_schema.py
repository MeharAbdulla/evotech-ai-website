from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field, BeforeValidator
from typing_extensions import Annotated


def empty_str_to_none(v: Any) -> Any:
    if isinstance(v, str) and not v.strip():
        return None
    return v


OptionalStr = Annotated[Optional[str], BeforeValidator(empty_str_to_none)]

STATUS_PATTERN = "^(Active|Inactive)$"


class ServiceCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=120)
    short_description: str = Field(..., max_length=300)
    full_description: OptionalStr = None
    icon: str = Field(default="FiLayers", max_length=50)
    features: List[str] = Field(default_factory=list)
    status: str = Field(default="Active", pattern=STATUS_PATTERN)
    featured: bool = False
    sort_order: int = 0
    image: OptionalStr = None


class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    short_description: Optional[str] = None
    full_description: OptionalStr = None
    icon: Optional[str] = None
    features: Optional[List[str]] = None
    status: Optional[str] = Field(None, pattern=STATUS_PATTERN)
    featured: Optional[bool] = None
    sort_order: Optional[int] = None
    image: OptionalStr = None


class ServiceResponse(BaseModel):
    id: str
    title: str
    short_description: str
    full_description: Optional[str] = None
    icon: str = "FiLayers"
    features: List[str] = []
    status: str
    featured: bool = False
    sort_order: int = 0
    image: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"populate_by_name": True, "from_attributes": True}
