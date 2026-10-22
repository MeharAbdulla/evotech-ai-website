"""Enrich existing published blogs for SEO (preserve slugs)."""
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
os.environ.setdefault("BLOG_PROVIDER", "zai")
os.environ["BLOG_DAILY_LIMIT"] = "12"

from motor.motor_asyncio import AsyncIOMotorClient  # noqa: E402

from app.config import settings  # noqa: E402
from app.services.blog_generator import _call_zai, _extract_json  # noqa: E402


ENRICH_PROMPT = """Rewrite and improve this existing Aeromek AI blog post for SEO and lead generation.
Preserve the same core topic. Keep the slug EXACTLY: {slug}

Current title: {title}
Current excerpt: {excerpt}
Current category: {category}
Current keywords: {keywords}

Current content (markdown):
---
{content}
---

Return ONLY valid JSON with keys:
title, slug, excerpt, meta_title, meta_description, keywords, category, content

Improve: title CTR, intro, H2/H3 structure (no H1 in content), FAQ section, 2-4 internal markdown links to
/services/computer-vision, /services/yolo, /services/opencv, /services/iot, /services/pcb-design, /projects, /contact,
practical examples, and a strong business CTA to /contact. Do not keyword stuff. Keep technical accuracy.
slug in JSON must equal: {slug}
"""


async def main() -> None:
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    cursor = db["blogs"].find({"status": "Published"}).sort("created_at", 1)
    docs = await cursor.to_list(length=50)
    print(f"enriching {len(docs)} posts...")

    for doc in docs:
        slug = doc.get("slug")
        print(f"-> {slug}")
        user_prompt = ENRICH_PROMPT.format(
            slug=slug,
            title=doc.get("title") or "",
            excerpt=doc.get("excerpt") or "",
            category=doc.get("category") or "Computer Vision",
            keywords=", ".join(doc.get("keywords") or []),
            content=(doc.get("content") or "")[:6000],
        )
        try:
            raw, provider = await _call_zai(user_prompt)
            data = _extract_json(raw)
        except Exception as exc:
            print(f"  failed: {exc!r}")
            continue

        keywords = data.get("keywords") or doc.get("keywords") or []
        if isinstance(keywords, str):
            keywords = [k.strip() for k in keywords.split(",") if k.strip()]

        update = {
            "title": str(data.get("title") or doc.get("title"))[:160],
            "excerpt": str(data.get("excerpt") or doc.get("excerpt") or "")[:300],
            "content": str(data.get("content") or doc.get("content") or ""),
            "meta_title": str(data.get("meta_title") or data.get("title") or "")[:70],
            "meta_description": str(
                data.get("meta_description") or data.get("excerpt") or ""
            )[:170],
            "keywords": keywords[:12],
            "category": str(
                data.get("category") or doc.get("category") or "Computer Vision"
            )[:60],
            "slug": slug,
            "provider": provider or doc.get("provider"),
            "updated_at": datetime.now(timezone.utc),
        }
        if len(update["content"]) < 200:
            print("  skip: content too short")
            continue
        await db["blogs"].update_one({"_id": doc["_id"]}, {"$set": update})
        print(f"  updated via {provider}: {update['title']}")

    client.close()
    print("DONE")


if __name__ == "__main__":
    asyncio.run(main())
