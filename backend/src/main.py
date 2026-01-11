"""FastAPI application initialization and configuration."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings


# Create FastAPI app
app = FastAPI(
    title="Phase II Todo API",
    description="REST API for todo task management with JWT authentication",
    version="1.0.0",
    docs_url=f"{settings.API_PREFIX}/docs",
    redoc_url=f"{settings.API_PREFIX}/redoc",
    openapi_url=f"{settings.API_PREFIX}/openapi.json",
)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root() -> dict:
    """Root endpoint - health check."""
    return {
        "message": "Phase II Todo API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health() -> dict:
    """Health check endpoint."""
    return {"status": "healthy"}


# Router registration
from .api import auth, tasks

app.include_router(
    auth.router,
    prefix=f"{settings.API_PREFIX}/auth",
    tags=["Authentication"]
)

app.include_router(
    tasks.router,
    prefix=f"{settings.API_PREFIX}/tasks",
    tags=["Tasks"]
)
