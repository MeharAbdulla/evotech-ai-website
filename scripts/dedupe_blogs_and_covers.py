"""Draft near-duplicate blogs and reassign unique cover images.

Usage:
  python scripts/dedupe_blogs_and_covers.py           # dry-run
  python scripts/dedupe_blogs_and_covers.py --apply   # write changes
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
load_dotenv(ROOT / ".blog-secrets.local", override=True)

from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings
from app.services.blog_generator import title_similarity
from app.services.blog_images import LOCAL_POSTERS, _local_poster, _norm_url, resolve_cover_image


def _cluster_duplicates(docs: list[dict], threshold: float = 0.55) -> list[list[dict]]:
    """Greedy clusters of near-duplicate titles among Published posts."""
    published = [d for d in docs if (d.get("status") or "Published") == "Published"]
    published.sort(key=lambda d: d.get("created_at") or datetime.min, reverse=True)
    clusters: list[list[dict]] = []
    assigned: set = set()

    for doc in published:
        oid = doc["_id"]
        if oid in assigned:
            continue
        cluster = [doc]
        assigned.add(oid)
        title = doc.get("title") or ""
        for other in published:
            oid2 = other["_id"]
            if oid2 in assigned:
                continue
            if any(
                title_similarity(other.get("title") or "", m.get("title") or "") >= threshold
                for m in cluster
            ):
                cluster.append(other)
                assigned.add(oid2)
        if len(cluster) > 1:
            clusters.append(cluster)
    return clusters


async def main() -> None:
    apply = "--apply" in sys.argv
    remote = "--remote" in sys.argv
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    docs = await db["blogs"].find().sort("created_at", -1).to_list(length=500)

    print(f"Loaded {len(docs)} blogs (apply={apply}, remote={remote})")
    clusters = _cluster_duplicates(docs)
    draft_ids = []

    for cluster in clusters:
        keep, *dupes = cluster
        print(f"\nKEEP: {keep.get('title')}")
        for d in dupes:
            print(f"  DRAFT: {d.get('title')} ({d.get('slug')})")
            draft_ids.append(d["_id"])

    if apply and draft_ids:
        now = datetime.now(timezone.utc)
        result = await db["blogs"].update_many(
            {"_id": {"$in": draft_ids}},
            {"$set": {"status": "Draft", "updated_at": now}},
        )
        print(f"\nDrafted {result.modified_count} near-duplicate posts")
    elif draft_ids:
        print(f"\nDry-run: would draft {len(draft_ids)} posts. Re-run with --apply.")
    else:
        print("\nNo near-duplicate title clusters found.")

    published = (
        await db["blogs"]
        .find({"status": "Published"})
        .sort("created_at", -1)
        .to_list(length=200)
    )
    used: set[str] = set()
    cover_updates = 0

    # Pass 1: keep already-unique covers when possible
    for doc in published:
        url = doc.get("cover_image")
        norm = _norm_url(str(url)) if url else ""
        if url and norm not in used:
            used.add(norm)

    # Pass 2: rewrite duplicates / missing
    used.clear()
    for doc in published:
        url = doc.get("cover_image")
        norm = _norm_url(str(url)) if url else ""
        if url and norm not in used:
            used.add(norm)
            continue

        print(f"\nCover refresh: {doc.get('slug')}")
        if not apply:
            continue
        try:
            if remote:
                cover = await resolve_cover_image(
                    title=doc.get("title") or "",
                    keywords=doc.get("keywords") or [],
                    category=doc.get("category") or "Computer Vision",
                    exclude_urls=used,
                    seed=str(doc.get("slug") or doc["_id"]),
                )
            else:
                cover = _local_poster(
                    title=doc.get("title") or "",
                    category=doc.get("category") or "Computer Vision",
                    exclude=used,
                    seed=str(doc.get("slug") or doc["_id"]),
                )
            await db["blogs"].update_one(
                {"_id": doc["_id"]},
                {"$set": {**cover, "updated_at": datetime.now(timezone.utc)}},
            )
            if cover.get("cover_image"):
                used.add(_norm_url(cover["cover_image"]))
            cover_updates += 1
            print("  ->", cover.get("cover_image_source"), (cover.get("cover_image") or "")[:80])
        except Exception as exc:
            print("  failed", repr(exc))

    print(f"\nPublished posts: {len(published)}")
    print(f"Local poster pool size: {len(LOCAL_POSTERS)}")
    if apply:
        print(f"Cover updates written: {cover_updates}")
    else:
        print("Dry-run only. Re-run with --apply (add --remote for Openverse/Wikimedia).")

    client.close()


if __name__ == "__main__":
    asyncio.run(main())
