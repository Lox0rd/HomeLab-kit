from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import logging

from .config import settings
from .database import Base, engine
from .api import health, labs, auth, system, docker, services

# Create tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://homelab.local", "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["homelab.local", "localhost", "127.0.0.1"]
)

# Include routers
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(labs.router)
app.include_router(system.router)
app.include_router(docker.router)
app.include_router(services.router)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_event():
    logger.info(f"{settings.APP_NAME} started")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info(f"{settings.APP_NAME} shutdown")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
