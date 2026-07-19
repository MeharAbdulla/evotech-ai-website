import shutil
import logging
from pathlib import Path

from fastapi import UploadFile

from app.config import settings

# The logger now automatically belongs to this specific module domain
logger = logging.getLogger(__name__)


class UploadService:
    """
    A generic file upload service for domain entities (Projects, Developers,
    Gigs, etc.) within the EVOTECH AI ecosystem.

    Storage backend is chosen automatically:
      - If AWS S3 settings are configured, files are uploaded to S3 and a full
        public HTTPS URL is returned (persistent — survives redeploys).
      - Otherwise files are saved to the local `uploads/` directory and a
        relative path is returned (good for local development).
    """

    def __init__(self, base_upload_dir: str = "uploads"):
        self.base_dir = Path(base_upload_dir).resolve()
        self.use_s3 = bool(settings.AWS_S3_BUCKET)
        self._s3_client = None

    @property
    def s3_client(self):
        if self._s3_client is None:
            import boto3  # imported lazily so local dev doesn't require boto3 at import time

            self._s3_client = boto3.client(
                "s3",
                region_name=settings.AWS_REGION,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID or None,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY or None,
            )
        return self._s3_client

    async def save_file(self, file: UploadFile, category: str, entity_id: str) -> str:
        """
        Persist an uploaded file and return a URL/path usable by the frontend.
        """
        # Clean inputs to prevent basic path traversal vulnerabilities
        safe_category = Path(category).name
        safe_entity_id = Path(entity_id).name
        safe_filename = Path(file.filename).name

        if self.use_s3:
            return await self._save_to_s3(file, safe_category, safe_entity_id, safe_filename)
        return await self._save_to_disk(file, safe_category, safe_entity_id, safe_filename)

    async def _save_to_s3(self, file: UploadFile, category: str, entity_id: str, filename: str) -> str:
        key = f"{category}/{entity_id}/{filename}"
        try:
            await file.seek(0)
            extra_args = {}
            if file.content_type:
                extra_args["ContentType"] = file.content_type

            self.s3_client.upload_fileobj(
                file.file,
                settings.AWS_S3_BUCKET,
                key,
                ExtraArgs=extra_args or None,
            )

            if settings.AWS_S3_PUBLIC_URL:
                base = settings.AWS_S3_PUBLIC_URL.rstrip("/")
                url = f"{base}/{key}"
            else:
                url = f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"

            logger.info(f"Uploaded asset to S3: {url}")
            return url

        except Exception as exc:
            logger.error(f"S3 upload failed for key '{key}': {exc}")
            raise RuntimeError(f"Could not upload file to S3 storage: {exc}") from exc
        finally:
            await file.close()

    async def _save_to_disk(self, file: UploadFile, category: str, entity_id: str, filename: str) -> str:
        target_dir = self.base_dir / category / entity_id
        target_file_path = target_dir / filename

        try:
            target_dir.mkdir(parents=True, exist_ok=True)

            with target_file_path.open("wb") as buffer:
                await file.seek(0)
                shutil.copyfileobj(file.file, buffer)

            logger.info(f"Saved uploaded asset to disk: {target_file_path}")

            return f"/{self.base_dir.name}/{category}/{entity_id}/{filename}"

        except IOError as io_err:
            logger.error(f"Disk I/O error during file storage: {io_err}")
            raise RuntimeError(f"Could not persist file to local storage: {io_err}") from io_err
        except Exception as exc:
            logger.error(f"Unexpected error during file storage: {exc}")
            raise RuntimeError(f"Internal error during file ingestion: {exc}") from exc
        finally:
            await file.close()
