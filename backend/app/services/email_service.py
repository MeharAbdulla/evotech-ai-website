"""Send consultation lead emails via SMTP (Gmail app password)."""
from __future__ import annotations

import asyncio
import logging
import smtplib
from email.message import EmailMessage
from typing import Any

from app.config import settings

logger = logging.getLogger("uvicorn.error")


def _smtp_configured() -> bool:
    return bool(
        (settings.SMTP_USER or "").strip()
        and (settings.SMTP_PASSWORD or "").strip()
        and (settings.SMTP_TO or "").strip()
    )


def _build_consultation_message(data: dict[str, Any]) -> EmailMessage:
    to_addr = (settings.SMTP_TO or settings.SMTP_USER).strip()
    from_addr = (settings.SMTP_USER or "").strip()
    customer_email = (data.get("email") or "").strip()
    name = (data.get("full_name") or "Unknown").strip()
    company = (data.get("company_name") or "").strip()
    service = (data.get("service") or "").strip()

    subject = f"New consultation request — {name}"
    if company:
        subject += f" ({company})"

    lines = [
        "New Aeromek consultation request",
        "",
        f"Name: {name}",
        f"Company: {company or '—'}",
        f"Email: {customer_email or '—'}",
        f"Phone: {(data.get('phone_number') or '—').strip()}",
        f"Country: {(data.get('country') or '—').strip()}",
        f"Service: {service or '—'}",
        f"Budget: {(data.get('budget') or '—')}",
        "",
        "Project description:",
        (data.get("description") or "—").strip(),
        "",
        "—",
        "Saved in Aeromek admin → Messages.",
    ]

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f"Aeromek Website <{from_addr}>"
    msg["To"] = to_addr
    if customer_email:
        msg["Reply-To"] = customer_email
    msg.set_content("\n".join(lines))
    return msg


def _send_sync(msg: EmailMessage) -> None:
    host = (settings.SMTP_HOST or "smtp.gmail.com").strip()
    port = int(settings.SMTP_PORT or 587)
    user = settings.SMTP_USER.strip()
    password = settings.SMTP_PASSWORD.strip().replace(" ", "")

    with smtplib.SMTP(host, port, timeout=30) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(user, password)
        server.send_message(msg)


async def send_consultation_email(data: dict[str, Any]) -> bool:
    """
    Email lead details to SMTP_TO.
    Returns True on success. Never raises to the request path — form save stays primary.
    """
    if not _smtp_configured():
        logger.warning("SMTP not configured — consultation email skipped")
        return False
    try:
        msg = _build_consultation_message(data)
        await asyncio.to_thread(_send_sync, msg)
        return True
    except Exception:
        logger.exception("Failed to send consultation email")
        return False
