"""Patch published blogs missing /services/ internal links."""
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

FOOTER = """

## Related Aeromek services

- [Computer Vision Development](/services/computer-vision)
- [YOLO Object Detection](/services/yolo)
- [OpenCV Development](/services/opencv)
- [CCTV AI](/services/cctv-ai)
- [View projects](/projects)
- [Contact Aeromek](/contact)

## FAQ

### Can Aeromek deploy vision on our existing cameras?
Yes. Most pilots start from your current IP/CCTV streams, then we add detection, alerts, and operator dashboards.

### How do we start?
Share camera types, site constraints, and the events you need. We propose a practical pilot path — [contact Aeromek](/contact).
"""


async def main() -> None:
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    n = 0
    async for doc in db["blogs"].find({"status": "Published"}):
        content = str(doc.get("content") or "")
        if "/services/" in content:
            continue
        new_content = content.rstrip() + FOOTER
        await db["blogs"].update_one(
            {"_id": doc["_id"]},
            {
                "$set": {
                    "content": new_content,
                    "updated_at": datetime.now(timezone.utc),
                }
            },
        )
        n += 1
        print("patched", doc.get("slug"))
    print("patched_count", n)
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
