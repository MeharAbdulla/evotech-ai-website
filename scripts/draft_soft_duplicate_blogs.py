"""Second-pass draft for soft-duplicate themes (fire, ROI, OpenCV, YOLO, etc.)."""
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
from app.services.blog_generator import title_similarity

THEMES = [
    ("fire", ["fire", "smoke", "cctv"]),
    ("roi", ["roi", "payback", "warehouse"]),
    ("opencv", ["opencv", "preprocessing"]),
    ("yolo_edge", ["edge", "yolo"]),
    ("workplace_yolo", ["workplace", "object detection"]),
    ("lighting", ["lighting", "camera"]),
]


def theme_hits(title: str, keys: list[str]) -> int:
    t = title.lower()
    return sum(1 for k in keys if k in t)


async def main() -> None:
    apply = "--apply" in sys.argv
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    pubs = await db["blogs"].find({"status": "Published"}).sort("created_at", -1).to_list(200)
    draft_ids: list = []

    for name, keys in THEMES:
        matched = [d for d in pubs if theme_hits(d.get("title") or "", keys) >= 2]
        if len(matched) < 2:
            continue
        keep, *dupes = matched
        print(f"THEME {name}: KEEP {keep.get('title')}")
        for d in dupes:
            print(f"  DRAFT {d.get('title')}")
            draft_ids.append(d["_id"])

    assigned = set(draft_ids)
    for i, a in enumerate(pubs):
        if a["_id"] in assigned:
            continue
        for b in pubs[i + 1 :]:
            if b["_id"] in assigned:
                continue
            sim = title_similarity(a.get("title") or "", b.get("title") or "")
            if sim >= 0.42:
                print(f"SIM KEEP {a.get('title')}")
                print(f"  DRAFT {b.get('title')} sim={sim:.2f}")
                draft_ids.append(b["_id"])
                assigned.add(b["_id"])

    draft_ids = list(dict.fromkeys(draft_ids))
    print(f"candidates={len(draft_ids)} apply={apply}")
    if apply and draft_ids:
        result = await db["blogs"].update_many(
            {"_id": {"$in": draft_ids}},
            {"$set": {"status": "Draft", "updated_at": datetime.now(timezone.utc)}},
        )
        print(f"drafted={result.modified_count}")
    left = await db["blogs"].count_documents({"status": "Published"})
    print(f"published={left}")
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
