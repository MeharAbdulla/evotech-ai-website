from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


STATUS_PATTERN = "^(Published|Draft)$"


class BlogResponse(BaseModel):
    id: str
    title: str
    slug: str
    excerpt: str
    content: str = ""
    meta_title: str
    meta_description: str
    keywords: List[str] = []
    category: str = "AI"
    status: str = "Published"
    provider: Optional[str] = None
    cover_image: Optional[str] = None
    cover_image_alt: Optional[str] = None
    cover_image_source: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class BlogListItem(BaseModel):
    """Lightweight list payload — omits full markdown body."""

    id: str
    title: str
    slug: str
    excerpt: str
    meta_title: str
    meta_description: str
    keywords: List[str] = []
    category: str = "AI"
    status: str = "Published"
    cover_image: Optional[str] = None
    cover_image_alt: Optional[str] = None
    cover_image_source: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class BlogUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: Optional[List[str]] = None
    category: Optional[str] = None
    status: Optional[str] = Field(None, pattern=STATUS_PATTERN)
    cover_image: Optional[str] = None
    cover_image_alt: Optional[str] = None
    cover_image_source: Optional[str] = None


class BlogGenerateResult(BaseModel):
    created: bool
    skipped: bool = False
    reason: Optional[str] = None
    post: Optional[BlogResponse] = None
    posts: List[BlogResponse] = []
    created_count: int = 0
    daily_limit: int = 12
