from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
import json

router = APIRouter(prefix="/api/v1", tags=["settings"])

# In-memory settings storage (can be replaced with database)
settings_store = {
    "theme": "dark",
    "language": "en",
    "notifications": True,
}


@router.get("/settings")
async def get_settings(db: Session = Depends(get_db)):
    """Get all settings"""
    return settings_store


@router.post("/settings")
async def save_settings(data: dict, db: Session = Depends(get_db)):
    """Save settings"""
    global settings_store
    if "changes" in data:
        settings_store.update(data["changes"])
    return {"status": "ok", "settings": settings_store}
