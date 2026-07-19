from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import db_manager

from app.routes import auth_routes
from app.routes.projects import router as projects_router
from app.routes.developers import router as developers_router
from app.routes.services import router as services_router
from app.routes.gigs import router as gigs_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles application startup and shutdown events cleanly.
    Ensures structural integrity for database connections.
    """
    # Startup: Initialize the database pool
    await db_manager.connect_to_database()
    yield
    # Shutdown: Safely drain and close the connection pool
    await db_manager.close_database_connection()

# Initialize FastAPI application with core metadata and lifespan logic
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    docs_url="/docs" if settings.ENV != "production" else None,
    redoc_url="/redoc" if settings.ENV != "production" else None,
    lifespan=lifespan
)

# Apply CORS Middleware to allow communication with the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, PUT, DELETE, OPTIONS, etc.
    allow_headers=["*"],  # Allows all standard and custom headers
)

# Static Files — ensure the local uploads directory exists (used when S3 is not configured)
import os
os.makedirs("uploads", exist_ok=True)
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# Routers
app.include_router(auth_routes.router)
app.include_router(projects_router)
app.include_router(developers_router)
app.include_router(services_router)
app.include_router(gigs_router)

@app.get("/", tags=["Health Check"])
async def root():
    """
    Base endpoint to verify that the backend engine is running.
    """
    return {
        "status": "healthy",
        "message": "Backend Running Successfully",
        "app_name": settings.APP_NAME
    }