"""Fetch unique, relevant cover images for blog posts.

Order: Unsplash → Pixabay → Openverse/Wikimedia → local / seeded unique.
Always prefers URLs not already used by other posts (exclude_urls).
"""
from __future__ import annotations

import hashlib
import logging
import re
from typing import Iterable, Optional
from urllib.parse import urlparse

import httpx

from app.config import settings

logger = logging.getLogger("uvicorn.error")

SITE_ORIGIN = "https://aeromek.com"

LOCAL_POSTERS = [
    "/cv-projects/yolo-detection/poster.jpg",
    "/cv-projects/industrial-yolo/poster.jpg",
    "/cv-projects/fire-surveillance/poster.jpg",
    "/cv-projects/workplace-cameras/poster.jpg",
    "/cv-projects/vision-overview/poster.jpg",
    "/cv-projects/wildlife-conservation/poster.jpg",
    "/cv-projects/plant-disease/poster.jpg",
    "/cv-projects/poultry-segmentation/poster.jpg",
    "/cv-projects/sheep/poster.jpg",
    "/cv-projects/smart-farming/poster.jpg",
    "/cv-projects/potato-counter/poster.jpg",
    "/ai-projects/rag-bot/poster.jpg",
    "/ai-projects/video-studio/poster.jpg",
    "/ai-projects/call-agent/poster.jpg",
    "/ai-projects/whatsapp-rag/poster.jpg",
    "/hero-poster.jpg",
    "/pcb/esp32-xiao-fc/preview.png",
    "/pcb/stm32h750-fc/preview.png",
    "/pcb/robocup/preview.png",
    "/pcb/simon-esp32/preview.png",
    "/pcb/pool-monitor/preview.png",
    "/pcb/tortubot/preview.jpeg",
    "/pcb/4g-iot/preview.jpeg",
    "/drones/drone-1.jpg",
    "/drones/drone-2.jpg",
    "/drones/drone-3.jpg",
    "/drones/drone-4.jpg",
    "/gigs/ai-ml.jpg",
    "/gigs/vision.jpg",
    "/gigs/robotics.jpg",
    "/gigs/iot.jpg",
    "/gigs/pcb.jpg",
    "/gigs/drone.jpg",
    "/gigs/cad-3d.jpg",
    "/gigs/prototype.jpg",
]

CATEGORY_QUERY_HINTS = {
    "Computer Vision": "factory computer vision camera",
    "Workplace Safety": "factory PPE safety workers",
    "Industrial AI": "industrial automation factory floor",
    "CCTV AI": "security CCTV camera surveillance",
    "Edge AI": "edge computing industrial device",
    "Robotics": "industrial robot arm factory",
    "AI Agents": "software dashboard operations",
    "IoT": "IoT sensors industrial electronics PCB",
}


def _search_query(title: str, keywords: list[str], category: str) -> str:
    parts = [k for k in (keywords or []) if k][:3]
    if not parts:
        parts = re.findall(r"[A-Za-z]{4,}", title or "")[:4]
    hint = CATEGORY_QUERY_HINTS.get(category or "", "industrial camera")
    base = " ".join(parts) or hint
    return f"{base} {hint}".strip()[:90]


def _norm_url(url: str) -> str:
    """Canonical cover key so relative / host variants collide correctly."""
    raw = (url or "").strip()
    if not raw:
        return ""
    raw = raw.split("#")[0].split("?")[0].rstrip("/")
    if raw.startswith("//"):
        raw = "https:" + raw
    if raw.startswith("/"):
        raw = f"{SITE_ORIGIN}{raw}"
    try:
        parsed = urlparse(raw)
    except Exception:
        return raw.lower()
    host = (parsed.netloc or "").lower()
    if host.startswith("www."):
        host = host[4:]
    if host in ("aeromek.com", ""):
        path = parsed.path or ""
        if not path.startswith("/"):
            path = f"/{path}"
        return f"{SITE_ORIGIN}{path.rstrip('/')}"
    path = (parsed.path or "").rstrip("/")
    return f"{parsed.scheme or 'https'}://{host}{path}".lower()


async def _gemini_refine_query(title: str, keywords: list[str], category: str) -> str:
    if not settings.GEMINI_API_KEY:
        return _search_query(title, keywords, category)
    prompt = (
        "Return ONLY a short 4-7 word English photo search query for a UNIQUE, "
        "professional industrial/tech photograph matching this blog. "
        "Prefer factory cameras, robots, warehouses, PCB, drones, farms, or labs. No quotes.\n"
        f"Title: {title}\nCategory: {category}\nKeywords: {', '.join(keywords or [])}"
    )
    models = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-001",
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-flash-latest",
    ]
    async with httpx.AsyncClient(timeout=30.0) as client:
        for model in models:
            url = (
                "https://generativelanguage.googleapis.com/v1beta/models/"
                f"{model}:generateContent?key={settings.GEMINI_API_KEY}"
            )
            try:
                resp = await client.post(
                    url,
                    headers={"Content-Type": "application/json"},
                    json={
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {"temperature": 0.6, "maxOutputTokens": 40},
                    },
                )
                if resp.status_code == 404:
                    continue
                resp.raise_for_status()
                parts = (
                    ((resp.json().get("candidates") or [{}])[0].get("content") or {}).get(
                        "parts"
                    )
                    or []
                )
                if not parts:
                    continue
                text = parts[0].get("text") or ""
                cleaned = re.sub(r"[^A-Za-z0-9\s\-]", " ", text).strip()
                if cleaned:
                    return cleaned[:90]
            except Exception as exc:
                logger.warning("Gemini refine failed (%s): %s", model, exc)
    return _search_query(title, keywords, category)


async def _unsplash_image(query: str, *, exclude: set[str]) -> Optional[dict[str, str]]:
    key = (settings.UNSPLASH_ACCESS_KEY or "").strip()
    if not key:
        return None
    headers = {
        "Authorization": f"Client-ID {key}",
        "Accept-Version": "v1",
        "User-Agent": "AeromekBlogBot/1.0 (https://aeromek.com)",
    }
    params = {
        "query": query[:100] or "industrial computer vision",
        "per_page": 20,
        "orientation": "landscape",
        "content_filter": "high",
    }
    async with httpx.AsyncClient(timeout=25.0, headers=headers) as client:
        resp = await client.get("https://api.unsplash.com/search/photos", params=params)
        if resp.status_code == 401:
            logger.warning("Unsplash 401 — check UNSPLASH_ACCESS_KEY")
            return None
        if resp.status_code == 403:
            logger.warning("Unsplash 403 — rate limit or app not approved")
            return None
        if resp.status_code >= 400:
            logger.warning("Unsplash search failed: %s", resp.status_code)
            return None
        results = resp.json().get("results") or []
        for item in results:
            urls = item.get("urls") or {}
            u = urls.get("regular") or urls.get("full") or urls.get("raw")
            if not u or not str(u).startswith("http"):
                continue
            if _norm_url(str(u)) in exclude:
                continue
            alt = (
                item.get("alt_description")
                or item.get("description")
                or query
            )
            # Unsplash guideline: trigger download endpoint when using a photo
            photo_id = item.get("id")
            if photo_id:
                try:
                    await client.get(
                        f"https://api.unsplash.com/photos/{photo_id}/download"
                    )
                except Exception:
                    pass
            return {
                "cover_image": str(u),
                "cover_image_alt": str(alt)[:120],
                "cover_image_source": "unsplash",
            }
    return None


async def _pixabay_image(query: str, *, exclude: set[str]) -> Optional[dict[str, str]]:
    key = (settings.PIXABAY_API_KEY or "").strip()
    if not key:
        return None
    params = {
        "key": key,
        "q": query[:100] or "industrial factory",
        "image_type": "photo",
        "orientation": "horizontal",
        "safesearch": "true",
        "per_page": 20,
    }
    headers = {"User-Agent": "AeromekBlogBot/1.0 (https://aeromek.com)"}
    async with httpx.AsyncClient(timeout=25.0, headers=headers) as client:
        resp = await client.get("https://pixabay.com/api/", params=params)
        if resp.status_code == 400:
            logger.warning("Pixabay 400 — check PIXABAY_API_KEY / query")
            return None
        if resp.status_code >= 400:
            logger.warning("Pixabay search failed: %s", resp.status_code)
            return None
        hits = resp.json().get("hits") or []
        for item in hits:
            u = item.get("largeImageURL") or item.get("webformatURL") or item.get("imageURL")
            if not u or not str(u).startswith("http"):
                continue
            if _norm_url(str(u)) in exclude:
                continue
            tags = str(item.get("tags") or query)
            return {
                "cover_image": str(u),
                "cover_image_alt": tags[:120],
                "cover_image_source": "pixabay",
            }
    return None


async def _openverse_image(
    query: str,
    *,
    exclude: set[str],
    page: int = 1,
) -> Optional[dict[str, str]]:
    url = "https://api.openverse.org/v1/images/"
    params = {
        "q": query,
        "page_size": 20,
        "page": max(1, page),
        "license": "pdm,cc0,by,by-sa",
        "category": "photograph",
    }
    headers = {"User-Agent": "AeromekBlogBot/1.0 (https://aeromek.com)"}
    async with httpx.AsyncClient(timeout=30.0, headers=headers) as client:
        resp = await client.get(url, params=params)
        if resp.status_code >= 400:
            return None
        results = resp.json().get("results") or []
        for item in results:
            u = item.get("url") or item.get("thumbnail")
            if not u or not str(u).startswith("http"):
                continue
            if _norm_url(str(u)) in exclude:
                continue
            return {
                "cover_image": str(u),
                "cover_image_alt": str(item.get("title") or query)[:120],
                "cover_image_source": "openverse",
            }
    return None


async def _openverse_unique(
    query: str,
    *,
    exclude: set[str],
    max_pages: int = 3,
) -> Optional[dict[str, str]]:
    for page in range(1, max_pages + 1):
        img = await _openverse_image(query, exclude=exclude, page=page)
        if img:
            return img
    return None


async def _wikimedia_image(query: str, *, exclude: set[str]) -> Optional[dict[str, str]]:
    api = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": f"filetype:bitmap {query}",
        "gsrlimit": 16,
        "gsrnamespace": 6,
        "prop": "imageinfo",
        "iiprop": "url|mime|size",
        "iiurlwidth": 1600,
    }
    headers = {"User-Agent": "AeromekBlogBot/1.0 (https://aeromek.com; aeromekai@gmail.com)"}
    async with httpx.AsyncClient(timeout=30.0, headers=headers) as client:
        resp = await client.get(api, params=params)
        resp.raise_for_status()
        pages = ((resp.json().get("query") or {}).get("pages") or {}).values()
        ranked: list[tuple[int, dict[str, str]]] = []
        for page in pages:
            info = (page.get("imageinfo") or [None])[0]
            if not info:
                continue
            mime = str(info.get("mime") or "")
            if not mime.startswith("image/"):
                continue
            u = info.get("thumburl") or info.get("url")
            if not u or _norm_url(str(u)) in exclude:
                continue
            w = int(info.get("thumbwidth") or info.get("width") or 0)
            title = str(page.get("title") or query).replace("File:", "")
            ranked.append(
                (
                    w,
                    {
                        "cover_image": str(u),
                        "cover_image_alt": title[:120],
                        "cover_image_source": "wikimedia",
                    },
                )
            )
        if not ranked:
            return None
        ranked.sort(key=lambda x: x[0], reverse=True)
        return ranked[0][1]


async def _ticketmaster_image(query: str, *, exclude: set[str]) -> Optional[dict[str, str]]:
    """Last-resort remote source — event art is often irrelevant for industrial SEO."""
    key = (settings.TICKETMASTER_API_KEY or "").strip()
    if not key:
        return None
    short = " ".join(query.split()[:3]) or "technology"
    async with httpx.AsyncClient(timeout=25.0) as client:
        for endpoint, embed_key in (
            ("https://app.ticketmaster.com/discovery/v2/events.json", "events"),
            ("https://app.ticketmaster.com/discovery/v2/attractions.json", "attractions"),
        ):
            resp = await client.get(
                endpoint,
                params={"apikey": key, "keyword": short, "size": 12},
            )
            if resp.status_code == 401:
                logger.warning("Ticketmaster 401 — Discovery API may not be enabled")
                return None
            if resp.status_code >= 400:
                continue
            items = ((resp.json().get("_embedded") or {}).get(embed_key)) or []
            candidates: list[tuple[int, dict[str, str]]] = []
            for item in items:
                alt = str(item.get("name") or short)
                for img in item.get("images") or []:
                    u = img.get("url") or ""
                    if not u.startswith("http") or _norm_url(u) in exclude:
                        continue
                    w = int(img.get("width") or 0)
                    ratio = str(img.get("ratio") or "")
                    score = w + (200 if ratio in ("16_9", "3_2", "4_3") else 0)
                    candidates.append(
                        (
                            score,
                            {
                                "cover_image": u,
                                "cover_image_alt": alt[:120],
                                "cover_image_source": "ticketmaster",
                            },
                        )
                    )
            if candidates:
                candidates.sort(key=lambda x: x[0], reverse=True)
                return candidates[0][1]
    return None


def _seeded_unique_cover(
    *,
    title: str,
    category: str,
    seed: str,
    exclude: set[str],
) -> dict[str, str]:
    """Always-unique fallback: deterministic stock photo per slug (never reuses)."""
    key = re.sub(r"[^a-zA-Z0-9\-]", "-", (seed or title or "aeromek").strip())[:80] or "aeromek"
    # Vary width slightly so exclude keys stay unique even if seed collides
    digest = int(hashlib.md5(key.encode()).hexdigest(), 16)
    w = 1600 + (digest % 17)
    h = 900 + (digest % 11)
    for attempt in range(8):
        suffix = "" if attempt == 0 else f"-{attempt}"
        url = f"https://picsum.photos/seed/aeromek-{key}{suffix}/{w}/{h}"
        if _norm_url(url) in exclude:
            continue
        return {
            "cover_image": url,
            "cover_image_alt": f"{title or category} — Aeromek AI",
            "cover_image_source": "seeded",
        }
    url = f"https://picsum.photos/seed/aeromek-{key}-{digest % 99991}/{w}/{h}"
    return {
        "cover_image": url,
        "cover_image_alt": f"{title or category} — Aeromek AI",
        "cover_image_source": "seeded",
    }


def _local_poster(
    *,
    title: str,
    category: str,
    exclude: set[str],
    seed: str = "",
) -> dict[str, str]:
    digest = int(hashlib.md5((seed or title or category).encode()).hexdigest(), 16)
    ordered = LOCAL_POSTERS[digest % len(LOCAL_POSTERS) :] + LOCAL_POSTERS
    for path in ordered:
        abs_url = f"{SITE_ORIGIN}{path}"
        if _norm_url(abs_url) in exclude:
            continue
        return {
            "cover_image": abs_url,
            "cover_image_alt": f"{title or category} — Aeromek computer vision",
            "cover_image_source": "local",
        }
    # Never reuse a local poster — unique seeded image for this post forever
    return _seeded_unique_cover(
        title=title,
        category=category,
        seed=seed or title or str(digest),
        exclude=exclude,
    )


async def resolve_cover_image(
    *,
    title: str,
    keywords: Optional[list[str]] = None,
    category: str = "Computer Vision",
    exclude_urls: Optional[Iterable[str]] = None,
    seed: str = "",
) -> dict[str, str]:
    """Return unique cover_image fields when possible."""
    kw = list(keywords or [])
    exclude = {_norm_url(u) for u in (exclude_urls or []) if u}
    query = _search_query(title, kw, category)

    refined = query
    try:
        refined = await _gemini_refine_query(title, kw, category)
    except Exception as exc:
        logger.warning("Gemini refine skipped: %s", exc)

    queries = [refined, query, CATEGORY_QUERY_HINTS.get(category, "industrial camera")]
    if seed:
        queries.append(f"{query} {seed.split('-')[-1][:12]}")

    # 1) Unsplash
    for q in queries:
        try:
            img = await _unsplash_image(q, exclude=exclude)
            if img:
                if q == refined and refined != query:
                    img["cover_image_source"] = "gemini+unsplash"
                return img
        except Exception as exc:
            logger.warning("unsplash failed for %r: %s", q, exc)

    # 2) Pixabay
    for q in queries:
        try:
            img = await _pixabay_image(q, exclude=exclude)
            if img:
                if q == refined and refined != query:
                    img["cover_image_source"] = "gemini+pixabay"
                return img
        except Exception as exc:
            logger.warning("pixabay failed for %r: %s", q, exc)

    # 3) Openverse / Wikimedia
    for q in queries:
        try:
            img = await _openverse_unique(q, exclude=exclude, max_pages=3)
            if img:
                if q == refined and refined != query:
                    img["cover_image_source"] = "gemini+openverse"
                return img
        except Exception as exc:
            logger.warning("openverse failed for %r: %s", q, exc)
        try:
            img = await _wikimedia_image(q, exclude=exclude)
            if img:
                return img
        except Exception as exc:
            logger.warning("wikimedia failed for %r: %s", q, exc)

    # 3) Local posters, then always-unique seeded cover
    return _local_poster(title=title, category=category, exclude=exclude, seed=seed or title)
