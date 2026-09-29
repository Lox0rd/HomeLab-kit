import psutil
import socket
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import SystemStatus, HealthResponse
from ..config import settings
from datetime import datetime

router = APIRouter(prefix="/api/v1", tags=["system"])

# Track start time for uptime
START_TIME = datetime.utcnow()


@router.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint"""
    uptime = (datetime.utcnow() - START_TIME).total_seconds()
    return {
        "status": "ok",
        "version": settings.APP_VERSION,
        "uptime": uptime,
    }


@router.get("/system/status", response_model=SystemStatus)
async def system_status(db: Session = Depends(get_db)):
    """Get current system status"""
    return {
        "cpu_percent": psutil.cpu_percent(interval=1),
        "ram_percent": psutil.virtual_memory().percent,
        "disk_percent": psutil.disk_usage("/").percent,
        "hostname": socket.gethostname(),
    }


@router.get("/system/info")
async def system_info():
    """Get detailed system information"""
    return {
        "cpu_count": psutil.cpu_count(),
        "cpu_freq": psutil.cpu_freq().current if psutil.cpu_freq() else None,
        "ram_total_gb": psutil.virtual_memory().total / (1024**3),
        "ram_used_gb": psutil.virtual_memory().used / (1024**3),
        "disk_total_gb": psutil.disk_usage("/").total / (1024**3),
        "disk_used_gb": psutil.disk_usage("/").used / (1024**3),
        "hostname": socket.gethostname(),
    }
