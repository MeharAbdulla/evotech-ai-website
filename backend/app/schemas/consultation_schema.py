from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, Field, BeforeValidator
from typing_extensions import Annotated


def empty_str_to_none(v: Any) -> Any:
    if isinstance(v, str) and not v.strip():
        return None
    return v


OptionalStr = Annotated[Optional[str], BeforeValidator(empty_str_to_none)]


class ConsultationCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    company_name: str = Field(..., min_length=1, max_length=160)
    email: str = Field(..., min_length=5, max_length=160)
    phone_number: str = Field(..., min_length=5, max_length=40)
    country: str = Field(..., min_length=2, max_length=80)
    service: str = Field(..., min_length=2, max_length=160)
    budget: OptionalStr = None
    description: str = Field(..., min_length=1, max_length=4000)


class ConsultationResponse(BaseModel):
    id: str
    full_name: str
    company_name: str
    email: str
    phone_number: str
    country: str
    service: str
    budget: Optional[str] = None
    description: str
    status: str = "New"
    created_at: datetime
    updated_at: datetime
