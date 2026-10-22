"""Generate SEO blog posts via Z.ai (preferred), Groq, or Gemini."""
from __future__ import annotations

import json
import logging
import re
from datetime import datetime, timezone
from typing import Any, Optional

import httpx

from app.config import settings

logger = logging.getLogger("uvicorn.error")

TOPIC_ROTATION = [
    # Priority GSC-impression intents (boosted — appear first in rotation)
    "Warehouse collision avoidance systems with forklift and pedestrian cameras",
    "How US distribution centers evaluate warehouse collision avoidance camera AI",
    "Textile machine vision for fabric defect detection on US production lines",
    "Textile vision software vs custom camera AI for mid-size mills",
    "Drone building inspection for US commercial property and roof surveys",
    "Drone roof inspection workflows for facility managers in the USA",
    "Commercial building drone inspection cameras and flight planning basics",
    "Retail out of stock detection with shelf cameras for US grocery chains",
    # Core industrial CV (USA plants / OSHA / manufacturing)
    "USA manufacturing computer vision for OSHA PPE compliance on factory floors",
    "Defect detection with industrial cameras for US automotive parts suppliers",
    "Weld seam and bead inspection using computer vision in metal fabrication shops",
    "Food processing visual inspection for contamination and packaging defects",
    "Pharmaceutical blister-pack and label verification with machine vision",
    "Electronics PCB optical inspection AOI with deep learning vs rule-based",
    "Warehouse dim-pick and carton OCR with computer vision for US 3PLs",
    "Forklift and pedestrian collision avoidance cameras for US distribution centers",
    "AGV and AMR path clearance detection with edge computer vision",
    "Pallet and load stability detection using warehouse ceiling cameras",
    "Conveyor belt anomaly and jam detection with industrial YOLO models",
    "Bottle fill-level and cap presence inspection on US beverage lines",
    "Textile fabric defect detection with line-scan and area-scan cameras",
    "Steel coil and surface scratch inspection in US steel plants",
    "Construction site PPE hard-hat and vest detection for US contractors",
    "Oil and gas flare and smoke monitoring with remote CCTV AI",
    "Mining conveyor rock size estimation with stereo or mono vision",
    "Retail shelf out-of-stock detection for US grocery and big-box stores",
    "Parking lot occupancy and license plate analytics for industrial campuses",
    "Airport baggage and security lane object detection use cases",
    # Safety / CCTV / fire
    "Retrofitting US plant CCTV for AI fire and smoke detection without new cameras",
    "Restricted-zone intrusion alerts with workplace camera AI",
    "Fall detection and man-down alerts from industrial CCTV feeds",
    "Vehicle gate ANPR for US factory logistics yards",
    # Agriculture / outdoor
    "US smart farming crop disease detection from field cameras and drones",
    "Livestock counting and health monitoring with farm computer vision",
    "Drone-based roof and solar-panel inspection for US commercial buildings",
    "Wildlife corridor camera traps and species detection for conservation",
    # Edge / robotics / embedded (secondary, still unique angles)
    "NVIDIA Jetson edge AI for multi-camera US factory cells",
    "Choosing industrial cameras and lighting for reliable US plant vision",
    "OpenCV calibration and preprocessing that lifts YOLO accuracy on dirty cameras",
    "Integrating robot arm pick-and-place with 2D/3D machine vision",
    "PLC and SCADA integration patterns for computer vision reject signals",
    "ESP32 camera gateways for low-cost US SME plant monitoring pilots",
    "STM32 motion control paired with vision feedback loops in packaging machines",
    "Raspberry Pi 5 multi-camera pilots for US warehouse vision POCs",
    "Custom PCB design for industrial IoT vision gateways and sensor hubs",
    "Measuring ROI of industrial camera AI for mid-size US manufacturers",
    "Hiring criteria for computer vision engineers on US factory AI projects",
    "Data labeling strategies for factory datasets that generalize across shifts",
    "MLOps for on-prem YOLO model updates without stopping production lines",
    "Privacy-preserving workplace computer vision that avoids storing faces",
    "Thermal plus RGB fusion for early fire detection in US warehouses",
    "Medical device manufacturing visual inspection under FDA process expectations",
    "Semiconductor wafer and die visual inspection basics for suppliers",
    "Logistics hub package dimensioning and damage detection with cameras",
]

SYSTEM_PROMPT = """You are an SEO content writer for Aeromek AI (aeromek.com).
PRIMARY market: United States industrial and commercial buyers (plant managers, EHS/safety leads,
operations, manufacturing engineers, warehouse directors, automation integrators).
PRIMARY expertise: Computer Vision & Industrial Automation Engineering — object detection, YOLO,
OpenCV, CCTV/camera AI, quality inspection, edge deployment, robotics vision, workplace safety AI.
Secondary: embedded/IoT (ESP32, STM32, Raspberry Pi), PCB, drones, AI agents.

Goal: help Aeromek rank for searches like "warehouse collision avoidance systems", "textile machine
vision", "drone building inspection", "computer vision for manufacturing", "YOLO factory safety",
"CCTV AI fire detection", and related US buyer intents.

Write one ORIGINAL post with a UNIQUE angle. Return ONLY valid JSON (no markdown fences):
{
  "title": "SEO title under 70 chars, US-search friendly, no keyword stuffing",
  "slug": "kebab-case-url-slug",
  "excerpt": "1-2 sentence summary under 160 chars",
  "meta_title": "SEO meta title under 60 chars",
  "meta_description": "SEO meta description under 155 chars with clear benefit",
  "keywords": ["primary keyword", "secondary1", "secondary2", "secondary3", "secondary4"],
  "category": "one of: Computer Vision, Workplace Safety, Industrial AI, CCTV AI, Edge AI, Robotics, AI Agents, IoT",
  "content": "Full markdown body 650-1000 words"
}

Markdown `content` requirements:
1. Intro of 1-2 paragraphs (no H1 — page title is H1). Mention United States / US plants or buyers when natural.
2. Use ## and ### only (never #).
3. Practical engineering examples (cameras, lighting, models, edge hardware, integration, KPIs).
4. ## FAQ with 2-4 short Q&As.
5. 2-4 natural internal links from (prefer money pages when on-topic):
   - [/services/workplace-object-detection](/services/workplace-object-detection) (warehouse collision avoidance)
   - [/services/industrial-inspection](/services/industrial-inspection) (textile machine vision)
   - [/services/drone-systems](/services/drone-systems) (drone building / roof inspection)
   - [/services/computer-vision](/services/computer-vision)
   - [/services/yolo](/services/yolo)
   - [/services/opencv](/services/opencv)
   - [/services/cctv-ai](/services/cctv-ai)
   - [/services/ai-development](/services/ai-development)
   - [/services/embedded-systems](/services/embedded-systems)
   - [/services/iot](/services/iot)
   - [/services/esp32](/services/esp32)
   - [/services/stm32](/services/stm32)
   - [/services/raspberry-pi](/services/raspberry-pi)
   - [/services/pcb-design](/services/pcb-design)
   - [/projects](/projects)
   - [/contact](/contact)
6. End with CTA to hire Aeromek → /contact.

Rules:
- One primary keyword in title, intro, and one H2. No stuffing.
- NEVER reuse near-duplicate titles of recent posts listed in the user prompt.
- Prefer specific industry + problem titles (e.g. "Weld Seam Inspection with Cameras") over generic "Industrial AI" fluff.
- Mention Aeromek AI 1–2 times naturally.
- slug = kebab-case from title; content = markdown only.
"""


def _slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"[\s_]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s[:80] or "aeromek-blog-post"


def _normalize_title_tokens(text: str) -> set[str]:
    stop = {
        "a",
        "an",
        "the",
        "for",
        "and",
        "or",
        "of",
        "to",
        "in",
        "on",
        "with",
        "using",
        "how",
        "your",
        "from",
        "into",
        "ai",
        "guide",
    }
    tokens = re.findall(r"[a-z0-9]+", (text or "").lower())
    return {t for t in tokens if len(t) > 2 and t not in stop}


def title_similarity(a: str, b: str) -> float:
    ta, tb = _normalize_title_tokens(a), _normalize_title_tokens(b)
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / max(1, len(ta | tb))


def is_near_duplicate_title(title: str, existing_titles: list[str], threshold: float = 0.55) -> bool:
    return any(title_similarity(title, other) >= threshold for other in existing_titles if other)


def _topic_for_slot(
    slot_index: int = 0,
    now: Optional[datetime] = None,
    existing_titles: Optional[list[str]] = None,
) -> str:
    """Pick a rotating topic that is not too similar to recent published titles."""
    day = (now or datetime.now(timezone.utc)).timetuple().tm_yday
    start = (day * 5 + max(0, slot_index) * 7) % len(TOPIC_ROTATION)
    existing = existing_titles or []
    for offset in range(len(TOPIC_ROTATION)):
        topic = TOPIC_ROTATION[(start + offset) % len(TOPIC_ROTATION)]
        if not is_near_duplicate_title(topic, existing, threshold=0.45):
            return topic
    return TOPIC_ROTATION[start]


def topic_for_day(now: Optional[datetime] = None) -> str:
    return _topic_for_slot(0, now)


def _extract_json(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    # GLM models sometimes wrap reasoning; strip common think blocks
    cleaned = re.sub(r"<think>[\s\S]*?</think>", "", cleaned, flags=re.I)
    cleaned = re.sub(r"<thinking>[\s\S]*?</thinking>", "", cleaned, flags=re.I)
    cleaned = cleaned.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{[\s\S]*\}", cleaned)
        if not match:
            raise
        return json.loads(match.group(0))


async def _call_zai(user_prompt: str) -> tuple[str, str]:
    if not settings.ZAI_API_KEY:
        raise RuntimeError("ZAI_API_KEY is not configured")
    model = (settings.ZAI_MODEL or "glm-4.5-flash").strip()
    async with httpx.AsyncClient(timeout=180.0) as client:
        resp = await client.post(
            "https://api.z.ai/api/paas/v4/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.ZAI_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "temperature": 0.7,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
            },
        )
        resp.raise_for_status()
        data = resp.json()
        message = data["choices"][0]["message"]
        content = message.get("content") or ""
        if isinstance(content, list):
            content = "".join(
                part.get("text", "") if isinstance(part, dict) else str(part)
                for part in content
            )
        content = str(content).strip()
        if not content:
            raise RuntimeError(f"Z.ai returned empty content: {data!r}"[:500])
        return content, "zai"


async def _call_groq(user_prompt: str) -> tuple[str, str]:
    if not settings.GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not configured")
    async with httpx.AsyncClient(timeout=55.0) as client:
        resp = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "temperature": 0.7,
                "response_format": {"type": "json_object"},
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
            },
        )
        resp.raise_for_status()
        data = resp.json()
        content = data["choices"][0]["message"]["content"]
        return content, "groq"


async def _call_gemini(user_prompt: str) -> tuple[str, str]:
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not configured")
    models = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-001",
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-flash-latest",
    ]
    last_exc: Optional[Exception] = None
    async with httpx.AsyncClient(timeout=55.0) as client:
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
                        "contents": [
                            {
                                "parts": [
                                    {
                                        "text": f"{SYSTEM_PROMPT}\n\nTopic focus:\n{user_prompt}"
                                    }
                                ]
                            }
                        ],
                        "generationConfig": {
                            "temperature": 0.7,
                            "responseMimeType": "application/json",
                        },
                    },
                )
                if resp.status_code == 404:
                    continue
                resp.raise_for_status()
                data = resp.json()
                content = data["candidates"][0]["content"]["parts"][0]["text"]
                return content, "gemini"
            except Exception as exc:
                last_exc = exc
                continue
    raise RuntimeError(f"Gemini failed for all models: {last_exc}")


async def generate_blog_payload(
    force_topic: Optional[str] = None,
    slot_index: int = 0,
    existing_titles: Optional[list[str]] = None,
) -> dict[str, Any]:
    existing = [t for t in (existing_titles or []) if t]
    topic = force_topic or _topic_for_slot(slot_index, existing_titles=existing)
    avoid = "\n".join(f"- {t}" for t in existing[:40]) or "- (none yet)"
    user_prompt = (
        f"Write today's USA-focused SEO blog post on: {topic}.\n"
        f"Date context: {datetime.now(timezone.utc).strftime('%Y-%m-%d')} UTC.\n"
        f"Post slot {slot_index + 1} today — choose a DISTINCT angle.\n"
        f"Do NOT write anything close to these existing titles:\n{avoid}\n"
        f"Return ONLY valid JSON matching the schema."
    )

    provider_pref = (settings.BLOG_PROVIDER or "auto").lower().strip()
    last_error: Optional[Exception] = None
    raw = ""
    provider = ""

    attempts: list[str] = []
    if provider_pref in ("zai", "z.ai", "glm"):
        attempts = ["zai"]
    elif provider_pref == "groq":
        attempts = ["groq"]
    elif provider_pref == "gemini":
        attempts = ["gemini"]
    else:
        if settings.ZAI_API_KEY:
            attempts.append("zai")
        if settings.GROQ_API_KEY:
            attempts.append("groq")
        if settings.GEMINI_API_KEY:
            attempts.append("gemini")
        if not attempts:
            attempts = ["zai", "groq", "gemini"]

    callers = {
        "zai": _call_zai,
        "groq": _call_groq,
        "gemini": _call_gemini,
    }

    for name in attempts:
        try:
            raw, provider = await callers[name](user_prompt)
            break
        except Exception as exc:
            last_error = exc
            logger.warning("Blog generation via %s failed: %s", name, exc)

    if not raw:
        raise RuntimeError(
            f"Blog generation failed. Configure ZAI_API_KEY (preferred), GROQ_API_KEY, or GEMINI_API_KEY. Last error: {last_error}"
        )

    data = _extract_json(raw)
    title = str(data.get("title") or "").strip()
    if not title:
        raise RuntimeError("LLM returned empty title")

    # One retry if the model still echoes a near-duplicate title
    if is_near_duplicate_title(title, existing, threshold=0.55):
        retry_prompt = (
            user_prompt
            + f"\nYour previous title was too similar: {title}. "
            "Pick a DIFFERENT industry/problem and new title."
        )
        try:
            raw2, provider = await callers[provider](retry_prompt)
            data = _extract_json(raw2)
            title = str(data.get("title") or title).strip()
        except Exception as exc:
            logger.warning("Duplicate-title retry failed: %s", exc)

    if is_near_duplicate_title(title, existing, threshold=0.62):
        raise RuntimeError(f"Generated title too similar to existing posts: {title}")

    slug = _slugify(str(data.get("slug") or title))
    excerpt = str(data.get("excerpt") or title)[:300]
    content = str(data.get("content") or "").strip()
    if len(content) < 200:
        raise RuntimeError("LLM returned content that is too short")

    keywords = data.get("keywords") or []
    if isinstance(keywords, str):
        keywords = [k.strip() for k in keywords.split(",") if k.strip()]
    keywords = [str(k).strip() for k in keywords if str(k).strip()][:12]

    return {
        "title": title[:160],
        "slug": slug,
        "excerpt": excerpt,
        "content": content,
        "meta_title": str(data.get("meta_title") or title)[:70],
        "meta_description": str(data.get("meta_description") or excerpt)[:170],
        "keywords": keywords,
        "category": str(data.get("category") or "Computer Vision")[:60],
        "status": "Published",
        "provider": provider,
    }
