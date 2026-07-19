"""
Vercel Python serverless entrypoint.

Exposes the FastAPI backend (which lives in ../backend/app) under the /api/*
path so it can be deployed in the same Vercel project as the React frontend.
"""
import os
import sys

# Make the backend package importable regardless of the working directory.
BACKEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi import FastAPI

from app.main import app as backend_app

# All backend routes are served beneath /api on Vercel.
app = FastAPI(docs_url=None, redoc_url=None)
app.mount("/api", backend_app)
