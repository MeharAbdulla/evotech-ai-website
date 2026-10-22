"""Backfill or refresh cover images for published blogs (unique URLs)."""
from __future__ import annotations

import asyncio
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))

from dotenv import load_dotenv

load_dotenv(ROOT / "backend" / ".env")
load_dotenv(ROOT / ".env")
load_dotenv(ROOT / ".blog-secrets.local", override=True)

from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings
from app.services.blog_images import _norm_url, resolve_cover_image


async def main() -> None:
    force = "--force" in sys.argv
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    n = 0
    used: set[str] = set()
    docs = await db["blogs"].find({"status": "Published"}).sort("created_at", -1).to_list(200)

    for doc in docs:
        src = (doc.get("cover_image_source") or "").strip()
        has = bool(doc.get("cover_image"))
        norm = _norm_url(str(doc.get("cover_image"))) if has else ""
        duplicate = bool(norm and norm in used)
        if has and src not in ("", "local") and not force and not duplicate:
            used.add(norm)
            continue

        print("->", doc.get("slug"), "prev=", src or "none", "dup=", duplicate)
        try:
            cover = await resolve_cover_image(
                title=doc.get("title") or "",
                keywords=doc.get("keywords") or [],
                category=doc.get("category") or "Computer Vision",
                exclude_urls=used,
                seed=str(doc.get("slug") or doc["_id"]),
            )
            await db["blogs"].update_one(
                {"_id": doc["_id"]},
                {
                    "$set": {
                        **cover,
                        "updated_at": datetime.now(timezone.utc),
                    }
                },
            )
            if cover.get("cover_image"):
                used.add(_norm_url(cover["cover_image"]))
            n += 1
            print("  ", cover.get("cover_image_source"), (cover.get("cover_image") or "")[:90])
        except Exception as exc:
            print("  failed", repr(exc))
    print("backfilled", n)
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
