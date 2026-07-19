import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Application Configurations
    APP_NAME: str = "Evotech AI Management System"
    DEBUG: bool = False
    ENV: str = "development"
    
    # MongoDB Configurations
    MONGODB_URI: str
    MONGODB_DB_NAME: str

    # CORS Configurations
    # Include both localhost and 127.0.0.1 — browsers treat them as different origins
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # AWS S3 (optional) — when AWS_S3_BUCKET is set, uploads go to S3 instead of local disk.
    AWS_S3_BUCKET: str = ""
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    # Optional custom/CDN base URL (e.g. CloudFront). If empty, the default S3 URL is used.
    AWS_S3_PUBLIC_URL: str = ""

    # Automatically load from a .env file if it exists
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        extra="ignore"
    )

# Instantiate the settings to be imported across the app
settings = Settings()