"""SEO routes: sitemap.xml and crawler-friendly HTML for blogs + services."""
from __future__ import annotations

import html
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional
from xml.sax.saxutils import escape as xml_escape

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse, Response
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database

router = APIRouter(prefix="/seo", tags=["SEO"])

SITE_URL = "https://aeromek.com"

# Keep in sync with frontend serviceLandings slugs
SERVICE_SLUGS = [
    "ai-development",
    "computer-vision",
    "yolo",
    "opencv",
    "embedded-systems",
    "iot",
    "raspberry-pi",
    "esp32",
    "stm32",
    "pcb-design",
    "workplace-object-detection",
    "cctv-ai",
    "industrial-inspection",
    "edge-camera-deployment",
    "robotics",
    "drone-systems",
    "cad-3d-design",
    "full-product-builds",
]

MONEY_SERVICE_SLUGS = {
    "computer-vision",
    "workplace-object-detection",
    "industrial-inspection",
    "drone-systems",
    "yolo",
    "cctv-ai",
}

# Project detail pages that prove CV / hardware capability
PROJECT_PATHS = [
    "/projects/cv-industrial-yolo",
    "/projects/cv-fire-surveillance",
    "/projects/cv-workplace-cameras",
    "/projects/cv-yolo-detection",
    "/projects/cv-vision-overview",
    "/projects/cv-smart-farming",
    "/projects/cv-poultry-segmentation",
    "/projects/cv-wildlife-conservation",
    "/projects/pcb-stm32h750-fc",
    "/projects/pcb-esp32-xiao-fc",
    "/projects/pcb-4g-iot-remote",
    "/projects/ai-call-agent",
    "/projects/ai-rag-bot",
]

STATIC_PATHS = [
    "/",
    "/services",
    "/projects",
    "/blog",
    "/about",
    "/team",
    "/gigs",
    "/rc-planes",
    "/contact",
    "/privacy",
    "/terms",
]


def _data_path(name: str) -> Path:
    return Path(__file__).resolve().parents[1] / "data" / name


def _rc_plane_slugs() -> list[str]:
    try:
        data = json.loads(_data_path("rc_plane_slugs.json").read_text(encoding="utf-8"))
        return [str(s) for s in data if s]
    except Exception:
        return []


def _service_landings() -> dict[str, dict[str, Any]]:
    try:
        rows = json.loads(_data_path("service_landings.json").read_text(encoding="utf-8"))
        return {str(r["slug"]): r for r in rows if r.get("slug")}
    except Exception:
        return {}


def _iso(dt: Any) -> str:
    if isinstance(dt, datetime):
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.date().isoformat()
    return datetime.now(timezone.utc).date().isoformat()


def _md_to_simple_html(md: str) -> str:
    """Minimal markdown → HTML for crawler pages (not a full renderer)."""
    lines = (md or "").splitlines()
    out: list[str] = []
    in_ul = False

    def close_ul() -> None:
        nonlocal in_ul
        if in_ul:
            out.append("</ul>")
            in_ul = False

    def inline_md(line: str) -> str:
        parts: list[str] = []
        last = 0
        for m in re.finditer(r"\[([^\]]+)\]\(([^)]+)\)", line):
            parts.append(html.escape(line[last : m.start()]))
            parts.append(
                f'<a href="{html.escape(m.group(2))}">{html.escape(m.group(1))}</a>'
            )
            last = m.end()
        parts.append(html.escape(line[last:]))
        return "".join(parts)

    for raw in lines:
        line = raw.rstrip()
        if not line.strip():
            close_ul()
            continue
        if line.startswith("### "):
            close_ul()
            out.append(f"<h3>{html.escape(line[4:].strip())}</h3>")
            continue
        if line.startswith("## "):
            close_ul()
            out.append(f"<h2>{html.escape(line[3:].strip())}</h2>")
            continue
        if line.startswith("# "):
            close_ul()
            out.append(f"<h2>{html.escape(line[2:].strip())}</h2>")
            continue
        if re.match(r"^[-*]\s+", line):
            if not in_ul:
                out.append("<ul>")
                in_ul = True
            item = re.sub(r"^[-*]\s+", "", line)
            out.append(f"<li>{inline_md(item)}</li>")
            continue
        close_ul()
        out.append(f"<p>{inline_md(line)}</p>")

    close_ul()
    return "\n".join(out)


def _sitemap_entry(loc: str, lastmod: str, freq: str, priority: str) -> str:
    return (
        "<url>"
        f"<loc>{xml_escape(loc)}</loc>"
        f"<lastmod>{xml_escape(lastmod)}</lastmod>"
        f"<changefreq>{freq}</changefreq>"
        f"<priority>{priority}</priority>"
        "</url>"
    )


@router.get("/sitemap.xml")
@router.get("/sitemap")
async def sitemap_xml(db: AsyncIOMotorDatabase = Depends(get_database)):
    today = datetime.now(timezone.utc).date().isoformat()
    body = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]

    static_priority = {
        "/": ("daily", "1.0"),
        "/services": ("weekly", "0.9"),
        "/projects": ("weekly", "0.8"),
        "/blog": ("daily", "0.7"),
        "/rc-planes": ("weekly", "0.5"),
        "/contact": ("monthly", "0.7"),
        "/about": ("monthly", "0.5"),
        "/team": ("monthly", "0.4"),
        "/gigs": ("weekly", "0.5"),
    }
    for path in STATIC_PATHS:
        freq, pri = static_priority.get(path, ("weekly", "0.5"))
        body.append(_sitemap_entry(f"{SITE_URL}{path}", today, freq, pri))

    for slug in SERVICE_SLUGS:
        pri = "0.9" if slug in MONEY_SERVICE_SLUGS else "0.7"
        body.append(
            _sitemap_entry(f"{SITE_URL}/services/{slug}", today, "weekly", pri)
        )

    for path in PROJECT_PATHS:
        body.append(_sitemap_entry(f"{SITE_URL}{path}", today, "monthly", "0.7"))

    for slug in _rc_plane_slugs():
        body.append(
            _sitemap_entry(f"{SITE_URL}/rc-planes/{slug}", today, "monthly", "0.3")
        )

    cursor = db["blogs"].find({"status": "Published"}).sort("updated_at", -1).limit(2000)
    docs = await cursor.to_list(length=2000)
    for doc in docs:
        slug = doc.get("slug")
        if not slug:
            continue
        lastmod = _iso(doc.get("updated_at") or doc.get("created_at"))
        body.append(
            _sitemap_entry(f"{SITE_URL}/blog/{slug}", lastmod, "weekly", "0.6")
        )

    body.append("</urlset>")
    return Response(content="\n".join(body), media_type="application/xml")


@router.get("/service/{slug}", response_class=HTMLResponse)
async def service_html_for_crawlers(slug: str):
    if slug not in SERVICE_SLUGS:
        raise HTTPException(status_code=404, detail="Service not found")

    landings = _service_landings()
    data = landings.get(slug) or {
        "slug": slug,
        "h1": slug.replace("-", " ").title(),
        "metaTitle": slug.replace("-", " ").title(),
        "metaDescription": f"Aeromek AI {slug.replace('-', ' ')} services.",
        "summary": "Aeromek AI engineering services for industrial teams.",
        "problems": [],
        "industries": [],
        "technologies": [],
        "benefits": [],
        "faq": [],
        "cta": "Contact Aeromek AI",
    }

    title = str(data.get("metaTitle") or data.get("h1") or slug)
    description = str(data.get("metaDescription") or data.get("summary") or title)[:170]
    h1 = str(data.get("h1") or title)
    summary = str(data.get("summary") or "")
    canonical = f"{SITE_URL}/services/{slug}"
    cta = str(data.get("cta") or "Contact Aeromek AI")

    def list_html(items: list[Any], heading: str) -> str:
        clean = [str(i) for i in (items or []) if i]
        if not clean:
            return ""
        lis = "".join(f"<li>{html.escape(i)}</li>" for i in clean)
        return f"<h2>{html.escape(heading)}</h2><ul>{lis}</ul>"

    faq_html = ""
    faq_ld_entities = []
    for item in data.get("faq") or []:
        q = str(item.get("q") or "").strip()
        a = str(item.get("a") or "").strip()
        if not q or not a:
            continue
        faq_html += (
            f"<h3>{html.escape(q)}</h3><p>{html.escape(a)}</p>"
        )
        faq_ld_entities.append(
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a},
            }
        )

    service_ld = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": h1,
        "description": description,
        "provider": {
            "@type": "Organization",
            "name": "Aeromek AI",
            "url": SITE_URL,
        },
        "url": canonical,
        "areaServed": "United States",
    }
    breadcrumb_ld = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL},
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": f"{SITE_URL}/services",
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": h1,
                "item": canonical,
            },
        ],
    }
    schemas = [service_ld, breadcrumb_ld]
    if faq_ld_entities:
        schemas.append(
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faq_ld_entities,
            }
        )

    related_links = ""
    for money in (
        "workplace-object-detection",
        "industrial-inspection",
        "drone-systems",
        "computer-vision",
    ):
        if money == slug:
            continue
        related_links += (
            f'<li><a href="{SITE_URL}/services/{money}">{money.replace("-", " ").title()}</a></li>'
        )

    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>{html.escape(title)} | Aeromek AI</title>
  <meta name="description" content="{html.escape(description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="{html.escape(canonical)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="{html.escape(title)}" />
  <meta property="og:description" content="{html.escape(description)}" />
  <meta property="og:url" content="{html.escape(canonical)}" />
  <meta property="og:image" content="{SITE_URL}/hero-poster.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  {"".join(f'<script type="application/ld+json">{json.dumps(s)}</script>' for s in schemas)}
  <style>
    body {{ font-family: system-ui, sans-serif; max-width: 760px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #111; }}
    a {{ color: #0369a1; }}
    nav {{ margin-bottom: 1.5rem; font-size: 0.9rem; }}
    .cta {{ display: inline-block; margin-top: 1rem; padding: 0.75rem 1.1rem; background: #0284c7; color: #fff; text-decoration: none; border-radius: 8px; }}
  </style>
</head>
<body>
  <nav>
    <a href="{SITE_URL}/">Home</a> /
    <a href="{SITE_URL}/services">Services</a> /
    <a href="{SITE_URL}/projects">Projects</a> /
    <a href="{SITE_URL}/contact">Contact</a>
  </nav>
  <article>
    <h1>{html.escape(h1)}</h1>
    <p>{html.escape(summary)}</p>
    {list_html(data.get("problems") or [], "Problems we solve")}
    {list_html(data.get("industries") or [], "Industries")}
    {list_html(data.get("technologies") or [], "Technologies")}
    {list_html(data.get("benefits") or [], "Benefits")}
    {"<h2>FAQ</h2>" + faq_html if faq_html else ""}
    <p><a class="cta" href="{SITE_URL}/contact">{html.escape(cta)}</a></p>
  </article>
  <hr />
  <h2>Related services</h2>
  <ul>{related_links}</ul>
  <p>
    <a href="{SITE_URL}/services/workplace-object-detection">Warehouse collision avoidance</a> ·
    <a href="{SITE_URL}/services/industrial-inspection">Textile machine vision</a> ·
    <a href="{SITE_URL}/services/drone-systems">Drone building inspection</a>
  </p>
</body>
</html>"""
    return HTMLResponse(content=page)


@router.get("/blog/{slug}", response_class=HTMLResponse)
async def blog_html_for_crawlers(
    slug: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    doc = await db["blogs"].find_one({"slug": slug, "status": "Published"})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")

    title = str(doc.get("meta_title") or doc.get("title") or "Aeromek AI Blog")
    description = str(
        doc.get("meta_description") or doc.get("excerpt") or title
    )[:170]
    h1 = str(doc.get("title") or title)
    content_html = _md_to_simple_html(str(doc.get("content") or ""))
    canonical = f"{SITE_URL}/blog/{slug}"
    created = doc.get("created_at")
    updated = doc.get("updated_at") or created
    date_published = (
        created.isoformat() if isinstance(created, datetime) else _iso(created)
    )
    date_modified = (
        updated.isoformat() if isinstance(updated, datetime) else _iso(updated)
    )
    keywords = doc.get("keywords") or []
    if isinstance(keywords, list):
        kw = ", ".join(str(k) for k in keywords[:12])
    else:
        kw = str(keywords)

    cover = str(doc.get("cover_image") or f"{SITE_URL}/hero-poster.jpg")
    if cover.startswith("/"):
        cover = f"{SITE_URL}{cover}"

    article_ld = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": h1,
        "description": description,
        "datePublished": date_published,
        "dateModified": date_modified,
        "image": [cover],
        "author": {"@type": "Organization", "name": "Aeromek AI"},
        "publisher": {
            "@type": "Organization",
            "name": "Aeromek AI",
            "logo": {
                "@type": "ImageObject",
                "url": f"{SITE_URL}/logo-transparent.png",
            },
        },
        "mainEntityOfPage": canonical,
        "keywords": kw,
    }
    breadcrumb_ld = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL},
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": f"{SITE_URL}/blog",
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": h1,
                "item": canonical,
            },
        ],
    }

    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>{html.escape(title)} | Aeromek AI</title>
  <meta name="description" content="{html.escape(description)}" />
  <link rel="canonical" href="{html.escape(canonical)}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="{html.escape(title)}" />
  <meta property="og:description" content="{html.escape(description)}" />
  <meta property="og:url" content="{html.escape(canonical)}" />
  <meta property="og:image" content="{html.escape(cover)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="{html.escape(cover)}" />
  <script type="application/ld+json">{json.dumps(article_ld)}</script>
  <script type="application/ld+json">{json.dumps(breadcrumb_ld)}</script>
  <style>
    body {{ font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #111; }}
    a {{ color: #0369a1; }}
    nav {{ margin-bottom: 1.5rem; font-size: 0.9rem; }}
    img.cover {{ width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; }}
  </style>
</head>
<body>
  <nav>
    <a href="{SITE_URL}/">Home</a> /
    <a href="{SITE_URL}/blog">Blog</a> /
    <a href="{SITE_URL}/services">Services</a> /
    <a href="{SITE_URL}/contact">Contact</a>
  </nav>
  <article>
    <h1>{html.escape(h1)}</h1>
    <p><em>{html.escape(str(doc.get("excerpt") or ""))}</em></p>
    <img class="cover" src="{html.escape(cover)}" alt="{html.escape(str(doc.get("cover_image_alt") or h1))}" />
    {content_html}
  </article>
  <hr />
  <p>
    Need this built for your workplace?
    <a href="{SITE_URL}/contact">Contact Aeromek AI</a> ·
    <a href="{SITE_URL}/services/workplace-object-detection">Warehouse collision avoidance</a> ·
    <a href="{SITE_URL}/services/industrial-inspection">Textile machine vision</a> ·
    <a href="{SITE_URL}/services/drone-systems">Drone building inspection</a> ·
    <a href="{SITE_URL}/services/computer-vision">Computer Vision Services</a>
  </p>
</body>
</html>"""
    return HTMLResponse(content=page)
