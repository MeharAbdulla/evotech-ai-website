"""
Vercel Python serverless entrypoint.

Exposes the FastAPI backend (which lives in ../backend/app) under the /api/*
path so it can be deployed in the same Vercel project as the React frontend.
Also exposes /sitemap.xml at the function root for Vercel rewrites.
"""
import os
import sys

# Make the backend package importable regardless of the working directory.
BACKEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi import Depends, FastAPI
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.main import app as backend_app
from app.routes.seo import blog_html_for_crawlers, sitemap_xml

# All backend routes are served beneath /api on Vercel.
app = FastAPI(docs_url=None, redoc_url=None)

# Public SEO aliases (Vercel may rewrite /sitemap.xml here with this path)
@app.get("/sitemap.xml")
async def root_sitemap(db: AsyncIOMotorDatabase = Depends(get_database)):
    return await sitemap_xml(db)


@app.get("/seo/sitemap.xml")
async def alias_sitemap(db: AsyncIOMotorDatabase = Depends(get_database)):
    return await sitemap_xml(db)


@app.get("/seo/blog/{slug}")
async def alias_blog_html(slug: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    return await blog_html_for_crawlers(slug, db)


app.mount("/api", backend_app)
