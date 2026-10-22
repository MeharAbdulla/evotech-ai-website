"""Enrich a single blog by slug."""
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
load_dotenv(ROOT / ".blog-secrets.local", override=True)

from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app.services.blog_generator import _call_zai, _extract_json

SLUG = "aeromek-builds-production-computer-vision-pipelines"


async def main() -> None:
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    doc = await db["blogs"].find_one({"slug": SLUG})
    if not doc:
        print("missing")
        return
    prompt = f"""Rewrite this Aeromek blog for SEO. Keep slug EXACTLY: {SLUG}
Title: {doc.get('title')}
Excerpt: {doc.get('excerpt')}
Content:
---
{(doc.get('content') or '')[:4500]}
---
Return ONLY JSON: title,slug,excerpt,meta_title,meta_description,keywords,category,content
Must include ## FAQ, intro, H2/H3 (no H1), and markdown links to /services/computer-vision, /services/yolo, /contact.
No keyword stuffing."""
    raw, provider = await _call_zai(prompt)
    data = _extract_json(raw)
    content = str(data.get("content") or "")
    print("len", len(content), "has_services", "/services/" in content)
    if len(content) < 200:
        return
    kw = data.get("keywords") or []
    if isinstance(kw, str):
        kw = [x.strip() for x in kw.split(",") if x.strip()]
    await db["blogs"].update_one(
        {"_id": doc["_id"]},
        {
            "$set": {
                "title": str(data.get("title") or doc["title"])[:160],
                "excerpt": str(data.get("excerpt") or "")[:300],
                "content": content,
                "meta_title": str(data.get("meta_title") or "")[:70],
                "meta_description": str(data.get("meta_description") or "")[:170],
                "keywords": kw[:12],
                "category": str(data.get("category") or "Computer Vision")[:60],
                "slug": SLUG,
                "provider": provider,
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )
    print("updated", data.get("title"))
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
