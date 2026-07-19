from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from bson import ObjectId


class PyObjectId(str):
    """
    Custom type to safely handle MongoDB ObjectId serialization.
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


class DeveloperDB(BaseModel):
    """
    Internal MongoDB Developer document representation.
    """

    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    name: str

    role: str

    bio: str

    skills: List[str] = Field(default_factory=list)

    experience: Optional[str] = None

    profile_image: Optional[str] = None

    github_url: Optional[str] = None

    linkedin_url: Optional[str] = None

    status: str = "Active"

    created_at: datetime = Field(default_factory=datetime.utcnow)

    updated_at: datetime = Field(default_factory=datetime.utcnow)


    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }