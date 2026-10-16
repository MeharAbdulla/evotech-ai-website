import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Application Configurations
    APP_NAME: str = "Aeromek Management System"
    DEBUG: bool = False
    ENV: str = "development"
    
    # MongoDB Configurations
    MONGODB_URI: str
    MONGODB_DB_NAME: str

    # Storage backend for uploaded files:
    #   "gridfs" -> store inside MongoDB (persists on Vercel/serverless) [default]
    #   "disk"   -> local ./uploads directory (good for plain local dev)
    #   S3 is used automatically instead if AWS_S3_BUCKET is set (see below).
    STORAGE_BACKEND: str = "gridfs"

    # CORS Configurations
    # Include both localhost and 127.0.0.1 — browsers treat them as different origins
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://aeromek.com",
        "https://www.aeromek.com",
        "https://aeromek.vercel.app",
    ]

    # AWS S3 (optional) — when AWS_S3_BUCKET is set, uploads go to S3 instead of local disk.
    AWS_S3_BUCKET: str = ""
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    # Optional custom/CDN base URL (e.g. CloudFront). If empty, the default S3 URL is used.
    AWS_S3_PUBLIC_URL: str = ""

    # Blog AI generation — prefer Z.ai (GLM), then Groq, then Gemini
    ZAI_API_KEY: str = ""
    ZAI_MODEL: str = "glm-4.5-flash"
    GROQ_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    BLOG_PROVIDER: str = "auto"  # auto | zai | groq | gemini
    # Blog cover images — Unsplash → Pixabay → Openverse/Wikimedia → local/seeded
    UNSPLASH_ACCESS_KEY: str = ""
    PIXABAY_API_KEY: str = ""
    TICKETMASTER_API_KEY: str = ""
    TICKETMASTER_API_SECRET: str = ""
    BLOG_CRON_SECRET: str = ""
    # Vercel Cron also sends Authorization: Bearer <CRON_SECRET>
    CRON_SECRET: str = ""
    # Auto-publish this many SEO posts per UTC day (GitHub Actions + optional Vercel cron)
    BLOG_DAILY_LIMIT: int = 10

    # Consultation form email (Gmail SMTP + app password)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_TO: str = ""

    # Automatically load from a .env file if it exists
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        extra="ignore"
    )

# Instantiate the settings to be imported across the app
settings = Settings()