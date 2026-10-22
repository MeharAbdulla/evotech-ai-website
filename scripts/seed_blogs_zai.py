"""One-shot: generate up to 3 SEO blogs via Z.ai into MongoDB."""
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
from app.routes.blog import _ensure_unique_slug, map_blog  # noqa: E402
from app.services.blog_generator import generate_blog_payload  # noqa: E402


async def main() -> None:
    print(
        "provider=",
        settings.BLOG_PROVIDER,
        "zai=",
        bool(settings.ZAI_API_KEY),
        "db=",
        settings.MONGODB_DB_NAME,
    )
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    now = datetime.now(timezone.utc)
    day_start = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
    today = await db["blogs"].count_documents({"created_at": {"$gte": day_start}})
    print("today_count=", today)
    target = max(0, 3 - today)
    created = []
    for i in range(target):
        slot = today + i
        print(f"generating slot {slot}...")
        last_exc: Exception | None = None
        for attempt in range(3):
            try:
                payload = await generate_blog_payload(slot_index=slot)
                break
            except Exception as exc:  # noqa: BLE001
                last_exc = exc
                print(f"attempt {attempt + 1} failed: {exc!r}")
                await asyncio.sleep(2)
        else:
            raise RuntimeError(f"Failed slot {slot}: {last_exc!r}") from last_exc
        payload["slug"] = await _ensure_unique_slug(db, payload["slug"])
        stamp = datetime.now(timezone.utc)
        payload["created_at"] = stamp
        payload["updated_at"] = stamp
        res = await db["blogs"].insert_one(payload)
        doc = await db["blogs"].find_one({"_id": res.inserted_id})
        mapped = map_blog(doc)
        created.append(
            {
                "title": mapped.title,
                "slug": mapped.slug,
                "provider": payload.get("provider"),
            }
        )
        print("created:", mapped.slug)
    print("DONE", created)
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
