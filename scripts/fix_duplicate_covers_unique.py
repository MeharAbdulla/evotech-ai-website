"""Republish soft-drafted post + assign unique seeded covers to remaining duplicates.

Does NOT draft or delete blogs — only fixes duplicate cover URLs.
"""
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

from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings
from app.services.blog_images import _norm_url, _seeded_unique_cover


async def main() -> None:
    apply = "--apply" in sys.argv
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]

    # Restore the one soft-dupe draft from earlier dedupe (user wants no removals)
    slug = "zero-downtime-yolo-model-updates-for-us-factories"
    if apply:
        r = await db["blogs"].update_one(
            {"slug": slug, "status": "Draft"},
            {"$set": {"status": "Published", "updated_at": datetime.now(timezone.utc)}},
        )
        print(f"republish {slug}: matched={r.matched_count} modified={r.modified_count}")
    else:
        doc = await db["blogs"].find_one({"slug": slug}, {"status": 1})
        print(f"dry-run republish candidate status={doc and doc.get('status')}")

    published = (
        await db["blogs"]
        .find({"status": "Published"})
        .sort("created_at", -1)
        .to_list(length=500)
    )
    used: set[str] = set()
    updates = 0

    for doc in published:
        url = doc.get("cover_image")
        norm = _norm_url(str(url)) if url else ""
        if url and norm and norm not in used:
            used.add(norm)
            continue

        seed = str(doc.get("slug") or doc["_id"])
        cover = _seeded_unique_cover(
            title=doc.get("title") or "",
            category=doc.get("category") or "Computer Vision",
            seed=seed,
            exclude=used,
        )
        print(f"unique cover -> {doc.get('slug')}: {cover['cover_image'][:90]}")
        if apply:
            await db["blogs"].update_one(
                {"_id": doc["_id"]},
                {"$set": {**cover, "updated_at": datetime.now(timezone.utc)}},
            )
            used.add(_norm_url(cover["cover_image"]))
            updates += 1
        else:
            used.add(_norm_url(cover["cover_image"]))

    pub = await db["blogs"].count_documents({"status": "Published"})
    print(f"published={pub} cover_updates={updates} apply={apply}")
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
