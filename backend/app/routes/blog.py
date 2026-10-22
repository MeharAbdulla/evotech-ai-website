from datetime import datetime, timezone
from typing import List, Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ReturnDocument

from app.auth.deps import require_admin
from app.config import settings
from app.database import get_database
from app.schemas.blog_schema import (
    BlogGenerateResult,
    BlogListItem,
    BlogResponse,
    BlogUpdate,
)
from app.services.blog_generator import generate_blog_payload, is_near_duplicate_title
from app.services.blog_images import resolve_cover_image, _norm_url

router = APIRouter(prefix="/blog", tags=["Blog"])


def map_blog(doc: dict) -> BlogResponse:
    if doc and "_id" in doc:
        doc = {**doc, "id": str(doc["_id"])}
    doc.setdefault("keywords", [])
    doc.setdefault("category", "AI")
    doc.setdefault("status", "Published")
    doc.setdefault("cover_image", None)
    doc.setdefault("cover_image_alt", None)
    doc.setdefault("cover_image_source", None)
    return BlogResponse(**doc)


def _secrets() -> list[str]:
    return [s for s in (settings.BLOG_CRON_SECRET, settings.CRON_SECRET) if s]


def _authorized_cron(
    request: Request,
    authorization: Optional[str],
    x_cron_secret: Optional[str],
) -> bool:
    secrets = _secrets()
    # Allow open cron only in local/dev when no secret configured
    if not secrets:
        return settings.ENV != "production"

    candidates: list[str] = []
    if x_cron_secret:
        candidates.append(x_cron_secret.strip())
    if authorization and authorization.lower().startswith("bearer "):
        candidates.append(authorization.split(" ", 1)[1].strip())
    # Vercel may also pass cron secret via query in some setups — ignore for security
    return any(c and c in secrets for c in candidates)


async def _ensure_unique_slug(db: AsyncIOMotorDatabase, slug: str, exclude_id: Optional[ObjectId] = None) -> str:
    base = slug
    n = 0
    while True:
        candidate = base if n == 0 else f"{base}-{n}"
        query: dict = {"slug": candidate}
        if exclude_id:
            query["_id"] = {"$ne": exclude_id}
        existing = await db["blogs"].find_one(query)
        if not existing:
            return candidate
        n += 1


async def _create_generated_post(
    db: AsyncIOMotorDatabase,
    *,
    force: bool = False,
    fill_daily: bool = False,
) -> BlogGenerateResult:
    now = datetime.now(timezone.utc)
    day_start = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
    daily_limit = max(1, int(getattr(settings, "BLOG_DAILY_LIMIT", 4) or 4))

    today_count = await db["blogs"].count_documents({"created_at": {"$gte": day_start}})
    if not force and today_count >= daily_limit:
        latest = await db["blogs"].find_one(
            {"created_at": {"$gte": day_start}},
            sort=[("created_at", -1)],
        )
        return BlogGenerateResult(
            created=False,
            skipped=True,
            reason=f"Daily limit reached ({daily_limit} SEO posts for today UTC).",
            post=map_blog(latest) if latest else None,
            posts=[],
            created_count=0,
            daily_limit=daily_limit,
        )

    to_create = 1
    if fill_daily and not force:
        to_create = daily_limit - today_count
    elif force and fill_daily:
        to_create = daily_limit

    recent_docs = (
        await db["blogs"]
        .find({}, {"title": 1, "cover_image": 1})
        .sort("created_at", -1)
        .limit(120)
        .to_list(length=120)
    )
    existing_titles = [str(d.get("title") or "") for d in recent_docs if d.get("title")]
    # Exclude covers from the full corpus (not just last 120) so older posts stay unique
    all_cover_docs = await db["blogs"].find(
        {"cover_image": {"$exists": True, "$nin": [None, ""]}},
        {"cover_image": 1},
    ).to_list(length=5000)
    used_covers = {
        _norm_url(str(d.get("cover_image")))
        for d in all_cover_docs
        if d.get("cover_image")
    }

    created_posts: list = []
    last_error: Optional[Exception] = None

    for i in range(to_create):
        slot_index = today_count + i
        try:
            payload = await generate_blog_payload(
                slot_index=slot_index,
                existing_titles=existing_titles,
            )
            if is_near_duplicate_title(payload["title"], existing_titles, threshold=0.62):
                raise RuntimeError(f"Skipped near-duplicate title: {payload['title']}")
            payload["slug"] = await _ensure_unique_slug(db, payload["slug"])
            try:
                cover = await resolve_cover_image(
                    title=payload.get("title") or "",
                    keywords=payload.get("keywords") or [],
                    category=payload.get("category") or "Computer Vision",
                    exclude_urls=used_covers,
                    seed=payload.get("slug") or "",
                )
                payload.update(cover)
                if cover.get("cover_image"):
                    used_covers.add(_norm_url(cover["cover_image"]))
            except Exception as cover_exc:
                import logging

                logging.getLogger("uvicorn.error").warning(
                    "Cover image resolve failed: %s", cover_exc
                )
            stamp = datetime.now(timezone.utc)
            payload["created_at"] = stamp
            payload["updated_at"] = stamp
            result = await db["blogs"].insert_one(payload)
            created = await db["blogs"].find_one({"_id": result.inserted_id})
            created_posts.append(map_blog(created))
            existing_titles.insert(0, payload["title"])
        except Exception as exc:
            last_error = exc
            break

    if not created_posts:
        if last_error:
            raise last_error
        return BlogGenerateResult(
            created=False,
            skipped=True,
            reason="No posts created.",
            daily_limit=daily_limit,
        )

    return BlogGenerateResult(
        created=True,
        skipped=False,
        post=created_posts[-1],
        posts=created_posts,
        created_count=len(created_posts),
        daily_limit=daily_limit,
        reason=f"Published {len(created_posts)} SEO post(s) (limit {daily_limit}/day).",
    )

@router.get("/", response_model=List[BlogListItem])
async def list_published_blogs(
    limit: int = 500,
    skip: int = 0,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Public blog index — excludes full `content` for payload size."""
    safe_limit = max(1, min(int(limit or 500), 2000))
    safe_skip = max(0, int(skip or 0))
    projection = {"content": 0}
    cursor = (
        db["blogs"]
        .find({"status": "Published"}, projection)
        .sort("created_at", -1)
        .skip(safe_skip)
        .limit(safe_limit)
    )
    docs = await cursor.to_list(length=safe_limit)
    items: List[BlogListItem] = []
    for doc in docs:
        mapped = map_blog({**doc, "content": ""})
        items.append(
            BlogListItem(
                id=mapped.id,
                title=mapped.title,
                slug=mapped.slug,
                excerpt=mapped.excerpt,
                meta_title=mapped.meta_title,
                meta_description=mapped.meta_description,
                keywords=mapped.keywords,
                category=mapped.category,
                status=mapped.status,
                cover_image=mapped.cover_image,
                cover_image_alt=mapped.cover_image_alt,
                cover_image_source=mapped.cover_image_source,
                created_at=mapped.created_at,
                updated_at=mapped.updated_at,
            )
        )
    return items


@router.get("/admin/all", response_model=List[BlogResponse])
async def list_all_blogs(
    db: AsyncIOMotorDatabase = Depends(get_database),
    _admin: dict = Depends(require_admin),
):
    cursor = db["blogs"].find().sort("created_at", -1).limit(200)
    docs = await cursor.to_list(length=200)
    return [map_blog(d) for d in docs]


@router.post("/admin/generate", response_model=BlogGenerateResult)
async def admin_generate_blog(
    force: bool = True,
    fill_daily: bool = False,
    db: AsyncIOMotorDatabase = Depends(get_database),
    _admin: dict = Depends(require_admin),
):
    try:
        return await _create_generated_post(db, force=force, fill_daily=fill_daily)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.patch("/admin/{id}", response_model=BlogResponse)
async def update_blog(
    id: str,
    payload: BlogUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    _admin: dict = Depends(require_admin),
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid blog ID")

    update_data = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    update_data["updated_at"] = datetime.now(timezone.utc)
    result = await db["blogs"].find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Blog not found")
    return map_blog(result)


@router.delete("/admin/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    _admin: dict = Depends(require_admin),
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid blog ID")
    result = await db["blogs"].delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return None


@router.api_route("/cron/backfill-covers", methods=["GET", "POST"])
async def cron_backfill_covers(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database),
    authorization: Optional[str] = Header(None),
    x_cron_secret: Optional[str] = Header(None, alias="X-Cron-Secret"),
    force: bool = False,
):
    """Attach/refresh missing, local, or duplicate covers (unique remotes kept unless force)."""
    if not _authorized_cron(request, authorization, x_cron_secret):
        raise HTTPException(status_code=401, detail="Invalid cron secret")

    updated = 0
    cursor = db["blogs"].find({"status": "Published"}).sort("created_at", -1).limit(500)
    docs = await cursor.to_list(length=500)
    used: set[str] = set()

    for doc in docs:
        current = doc.get("cover_image")
        src = (doc.get("cover_image_source") or "").strip()
        norm = _norm_url(str(current)) if current else ""
        duplicate = bool(norm and norm in used)
        # Keep unique non-local remotes; only refresh missing / local / duplicates (or force)
        if (
            current
            and src not in ("", "local")
            and not force
            and not duplicate
        ):
            used.add(norm)
            continue
        try:
            cover = await resolve_cover_image(
                title=doc.get("title") or "",
                keywords=doc.get("keywords") or [],
                category=doc.get("category") or "Computer Vision",
                exclude_urls=used,
                seed=str(doc.get("slug") or doc.get("_id")),
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
            updated += 1
        except Exception:
            continue
    return {"updated": updated, "total": len(docs)}


@router.api_route("/cron/generate", methods=["GET", "POST"], response_model=BlogGenerateResult)
async def cron_generate_blog(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database),
    authorization: Optional[str] = Header(None),
    x_cron_secret: Optional[str] = Header(None, alias="X-Cron-Secret"),
):
    """
    Auto SEO blog job.
    - ?mode=once → publish 1 post (use with every-2h cron; up to BLOG_DAILY_LIMIT/day)
    - default / ?mode=fill → publish until today's BLOG_DAILY_LIMIT is met
    """
    if not _authorized_cron(request, authorization, x_cron_secret):
        raise HTTPException(status_code=401, detail="Invalid cron secret")
    mode = (request.query_params.get("mode") or "fill").lower().strip()
    fill_daily = mode != "once"
    try:
        return await _create_generated_post(db, force=False, fill_daily=fill_daily)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.get("/{slug}", response_model=BlogResponse)
async def get_blog_by_slug(slug: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    doc = await db["blogs"].find_one({"slug": slug, "status": "Published"})
    if not doc:
        raise HTTPException(status_code=404, detail="Blog not found")
    return map_blog(doc)
