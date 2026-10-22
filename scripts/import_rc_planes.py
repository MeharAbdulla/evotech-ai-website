"""Import scraped RC planes into Aeromek (rebranded, USD +$100, SEO fields)."""
from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC_JSON = Path(r"E:\Website scraper\output\arttech_rc_planes\rc_planes.json")
SRC_IMAGES = Path(r"E:\Website scraper\output\arttech_rc_planes\images")
OUT_IMAGES = ROOT / "public" / "rc-planes"
OUT_DATA = ROOT / "src" / "data" / "rcPlanes.js"
OUT_SLUGS = ROOT / "backend" / "app" / "data" / "rc_plane_slugs.json"

BRAND_PATTERNS = [
    (r"(?i)\bExtreme\s*Flight\b", ""),
    (r"(?i)\bTeam\s*Extreme\b", "Aeromek team"),
    (r"(?i)\bFMS\s*Models?\b", ""),
    (r"(?i)\bFMS\b", ""),
    (r"(?i)\bFreewing\b", ""),
    (r"(?i)\bFlex\s*Innovation\b", ""),
    (r"(?i)\bArt\s*Tech(?:hobbies)?\b", ""),
    (r"(?i)\barttechhobbies\.com\b", "aeromek.com"),
    (r"(?i)\bXPWR\s*\d*\s*cc\b", "brushless motor"),
    (r"(?i)\bXpwr\b", "brushless motor"),
    (r"(?i)\bAirBoss\b", "ESC"),
    (r"(?i)\bCastle\s*Creations\b", ""),
    (r"(?i)\bHitec\b", ""),
    (r"(?i)\bPredator\b", "ESC"),
    (r"(?i)\bReflex\s*V\d+\b", "flight stabilizer"),
    (r"(?i)\bEF\s+Cyclone\b", "spinner"),
    (r"(?i)\bEF\s+Servo\s+Arms?\b", "servo arms"),
    (r"(?i)\bEF\s+Laser\b", "Laser"),
    (r"(?i)^EF\s*[-–—]\s*", ""),
    (r"(?i)\bEF\s+(?=\d)", ""),  # "EF 36" brand prefix
    (r"(?i)^Flex\s+", ""),
    (r"(?i)\bobtained official licensing[^.]*\.", ""),
    (r"(?i)\bAuthorized by Textron Innovations Inc\.?", ""),
    (r"(?i)\bTextron Innovations Inc\.?", ""),
    (r"(?i)\bJase\s*Dussia\b", "our test pilot"),
    (r"(?i)\bLeo\s*Loudenslager\b", "classic aerobatic"),
    (r"(?i)\bMirco\s*Pecorari\b", ""),
    (r"(?i)\bWalter\s*Extra\b", ""),
    (r"(?i)\bT-Motor\b", "high-power motor"),
]

CATEGORY_MAP = {
    "Extreme Flight": "Aerobatic",
    "FMS Models": "Sport Scale",
    "Freewing": "EDF Jet",
    "Flex Innovation": "3D Aerobatic",
    "Airplanes": "Airplane",
}


def slugify(text: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9\s\-]", "", text.lower())
    s = re.sub(r"[\s_]+", "-", s)
    s = re.sub(r"-{2,}", "-", s).strip("-")
    return s[:80] or "rc-plane"


def scrub(text: str) -> str:
    if not text:
        return ""
    out = text
    # Normalize common scrape artifacts
    out = out.replace("\u2033", '"').replace("\u2032", "'")
    out = out.replace("\u201d", '"').replace("\u201c", '"')
    out = out.replace("\u2019", "'").replace("\u2018", "'")
    out = out.replace("\u2014", "-").replace("\u2013", "-")
    out = out.replace("�", "")
    for pat, repl in BRAND_PATTERNS:
        out = re.sub(pat, repl, out)
    out = re.sub(r"\bESC\s+ESC\b", "ESC", out, flags=re.I)
    out = re.sub(r"\s{2,}", " ", out)
    out = re.sub(r"\s+([,.;:])", r"\1", out)
    out = re.sub(r"\s+-\s+", " - ", out)
    return out.strip(" -–—")


def map_categories(cats: list[str]) -> list[str]:
    mapped = []
    for c in cats or []:
        m = CATEGORY_MAP.get(c, c)
        if m and m not in mapped and m.lower() not in ("airplanes", "airplane"):
            mapped.append(m)
    if not mapped:
        mapped = ["RC Airplane"]
    return mapped


def seo_description(name: str, categories: list[str], price_usd: int, desc: str) -> str:
    cats = ", ".join(categories[:2])
    snippet = scrub(desc)[:140].rsplit(" ", 1)[0] if desc else ""
    base = f"Buy {name} — Aeromek RC airplane ({cats}). Price ${price_usd} USD."
    if snippet:
        return f"{base} {snippet}."
    return f"{base} Specs, images, and ordering via Aeromek AI."


def main() -> None:
    data = json.loads(SRC_JSON.read_text(encoding="utf-8"))
    products = data.get("products") or data
    OUT_IMAGES.mkdir(parents=True, exist_ok=True)

    used_slugs: set[str] = set()
    out = []

    for i, p in enumerate(products):
        raw_cats = p.get("categories") or []
        # Planes only — skip motor / car listings
        if any(str(c).lower() in ("motors", "cars", "car") for c in raw_cats):
            if not any(
                str(c).lower() in ("airplanes", "extreme flight", "fms models", "freewing", "flex innovation")
                for c in raw_cats
            ):
                continue

        raw_name = p.get("name") or f"RC Plane {i+1}"
        name = scrub(raw_name) or f"Aeromek RC Plane {i+1}"
        # Clean leftover punctuation from brand strip
        name = re.sub(r"^\W+", "", name)
        name = re.sub(r"\s{2,}", " ", name).strip()

        cats = map_categories(raw_cats)
        cats = [c for c in cats if c.lower() not in ("motors", "cars", "car")]
        if not cats:
            cats = ["RC Airplane"]
        try:
            base_price = int(re.sub(r"[^\d]", "", str(p.get("price") or "0")) or "0")
        except ValueError:
            base_price = 0
        price_usd = base_price + 100

        slug = slugify(name)
        if slug in used_slugs:
            slug = f"{slug}-{i+1}"
        used_slugs.add(slug)

        def copy_image(src_path: Path, idx: int) -> str | None:
            if not src_path.exists():
                return None
            ext = src_path.suffix.lower() or ".jpg"
            dest_name = f"{slug}-{idx}{ext}"
            dest = OUT_IMAGES / dest_name
            shutil.copy2(src_path, dest)
            return f"/rc-planes/{dest_name}"

        image_files = []
        idx = 0
        for rel in p.get("local_images") or []:
            path = copy_image(SRC_IMAGES / Path(rel).name, idx)
            if path:
                image_files.append(path)
                idx += 1

        if not image_files and p.get("images"):
            for img in p["images"]:
                path = copy_image(Path(img.get("local_path") or ""), idx)
                if path:
                    image_files.append(path)
                    idx += 1

        description = scrub(p.get("description") or "")
        # Soft SEO lead-in without competitor brands
        if description and not description.lower().startswith("aeromek"):
            description = (
                f"{name} is an Aeromek RC airplane available for purchase. "
                f"{description}"
            )

        short = scrub(p.get("short_description") or "")
        if not short:
            short = (
                f"{name} — {cats[0]} RC airplane. "
                f"Priced at ${price_usd} USD. Contact Aeromek to order."
            )

        out.append(
            {
                "id": f"rc-{slug}",
                "slug": slug,
                "name": name,
                "categories": cats,
                "price_usd": price_usd,
                "currency": "USD",
                "in_stock": bool(p.get("in_stock", True)),
                "short_description": short[:220],
                "description": description,
                "images": image_files,
                "thumbnail": image_files[0] if image_files else "/drones/drone-1.jpg",
                "meta_title": f"{name} — Aeromek RC Airplane ${price_usd}",
                "meta_description": seo_description(name, cats, price_usd, description)[:160],
            }
        )

    # Featured: one strong pick per category, then fill to 6 by price
    featured = []
    seen = set()
    by_cat = {}
    for p in out:
        cat = p["categories"][0]
        by_cat.setdefault(cat, []).append(p)
    for cat, items in by_cat.items():
        pick = max(items, key=lambda x: x["price_usd"])
        if pick["id"] not in seen:
            featured.append(pick["id"])
            seen.add(pick["id"])
    for p in sorted(out, key=lambda x: -x["price_usd"]):
        if len(featured) >= 6:
            break
        if p["id"] not in seen:
            featured.append(p["id"])
            seen.add(p["id"])

    js = (
        "/** Aeromek RC airplane catalog - prices in USD (source + $100). */\n"
        f"export const rcPlanes = {json.dumps(out, indent=2, ensure_ascii=False)};\n\n"
        f"export const featuredRcPlaneIds = {json.dumps(featured)};\n\n"
        "export function getRcPlaneBySlug(slug) {\n"
        "  return rcPlanes.find((p) => p.slug === slug) || null;\n"
        "}\n\n"
        "export function getFeaturedRcPlanes(limit = 3) {\n"
        "  const map = new Map(rcPlanes.map((p) => [p.id, p]));\n"
        "  return featuredRcPlaneIds.map((id) => map.get(id)).filter(Boolean).slice(0, limit);\n"
        "}\n\n"
        "export function getRcPlanesByCategory() {\n"
        "  const groups = {};\n"
        "  for (const p of rcPlanes) {\n"
        "    const cat = p.categories[0] || 'RC Airplane';\n"
        "    (groups[cat] ||= []).push(p);\n"
        "  }\n"
        "  return Object.entries(groups)\n"
        "    .sort((a, b) => a[0].localeCompare(b[0]))\n"
        "    .map(([category, items]) => ({\n"
        "      category,\n"
        "      items: items.sort((a, b) => b.price_usd - a.price_usd),\n"
        "    }));\n"
        "}\n\n"
        "export const rcPlaneCategories = [\n"
        "  ...new Set(rcPlanes.flatMap((p) => p.categories)),\n"
        "].sort();\n"
    )
    OUT_DATA.parent.mkdir(parents=True, exist_ok=True)
    OUT_DATA.write_text(js, encoding="utf-8")
    OUT_SLUGS.parent.mkdir(parents=True, exist_ok=True)
    OUT_SLUGS.write_text(
        json.dumps([p["slug"] for p in out], indent=2),
        encoding="utf-8",
    )
    print(f"Wrote {len(out)} products to {OUT_DATA}")
    print(f"Images in {OUT_IMAGES}: {len(list(OUT_IMAGES.glob('*')))} files")


if __name__ == "__main__":
    main()
