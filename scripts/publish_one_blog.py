"""Generate and publish one blog post (production Mongo via backend/.env)."""
from __future__ import annotations

import asyncio
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))

from dotenv import load_dotenv

load_dotenv(ROOT / "backend" / ".env")
load_dotenv(ROOT / ".env")

# Prefer keys from env / unsplash file already set by caller
from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings
from app.services.blog_generator import generate_blog_payload, is_near_duplicate_title
from app.services.blog_images import _norm_url, resolve_cover_image


async def ensure_unique_slug(db, slug: str) -> str:
    base = slug
    i = 0
    while await db["blogs"].find_one({"slug": slug}):
        i += 1
        slug = f"{base}-{i}"
    return slug


async def main() -> None:
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]

    recent = (
        await db["blogs"]
        .find({}, {"title": 1, "cover_image": 1})
        .sort("created_at", -1)
        .limit(120)
        .to_list(120)
    )
    titles = [str(d.get("title") or "") for d in recent if d.get("title")]
    all_covers = await db["blogs"].find(
        {"cover_image": {"$exists": True, "$nin": [None, ""]}},
        {"cover_image": 1},
    ).to_list(5000)
    covers = {
        _norm_url(str(d.get("cover_image")))
        for d in all_covers
        if d.get("cover_image")
    }

    payload = await generate_blog_payload(slot_index=0, existing_titles=titles)
    if is_near_duplicate_title(payload["title"], titles, threshold=0.62):
        raise RuntimeError(f"near duplicate: {payload['title']}")

    payload["slug"] = await ensure_unique_slug(db, payload["slug"])
    cover = await resolve_cover_image(
        title=payload.get("title") or "",
        keywords=payload.get("keywords") or [],
        category=payload.get("category") or "Computer Vision",
        exclude_urls=covers,
        seed=payload.get("slug") or "",
    )
    payload.update(cover)
    now = datetime.now(timezone.utc)
    payload["created_at"] = now
    payload["updated_at"] = now
    payload.setdefault("status", "Published")

    result = await db["blogs"].insert_one(payload)
    print("id=", result.inserted_id)
    print("title=", payload.get("title"))
    print("slug=", payload.get("slug"))
    print("cover_source=", payload.get("cover_image_source"))
    print("cover=", (payload.get("cover_image") or "")[:140])
    print("url=https://aeromek.com/blog/" + str(payload.get("slug")))
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
