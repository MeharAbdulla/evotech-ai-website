from urllib.parse import quote

from fastapi import APIRouter, HTTPException, Depends, Response
from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorGridFSBucket

from app.database import get_database

router = APIRouter(tags=["Uploads"])

# Content types that browsers should render inline rather than force-download.
_INLINE_TYPES = ("image/", "application/pdf", "text/", "video/", "audio/")


@router.get("/uploads/{file_id}")
async def serve_upload(
    file_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Stream a file previously stored in MongoDB GridFS."""
    try:
        oid = ObjectId(file_id)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=400, detail="Invalid file id")

    bucket = AsyncIOMotorGridFSBucket(db)

    try:
        stream = await bucket.open_download_stream(oid)
    except Exception:
        raise HTTPException(status_code=404, detail="File not found")

    data = await stream.read()

    metadata = stream.metadata or {}
    content_type = metadata.get("contentType") or "application/octet-stream"
    filename = metadata.get("filename") or stream.filename or "file"

    disposition_type = "inline" if content_type.startswith(_INLINE_TYPES) else "attachment"
    headers = {
        "Content-Disposition": f"{disposition_type}; filename*=UTF-8''{quote(filename)}",
        "Cache-Control": "public, max-age=31536000, immutable",
    }

    return Response(content=data, media_type=content_type, headers=headers)
