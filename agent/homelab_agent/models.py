from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any, Dict, List

# Auth
class UserCreate(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Labs
class LabMetadata(BaseModel):
    id: str
    title: str
    difficulty: str
    estimated_time: int
    prerequisites: List[str] = []
    tasks: List[Dict[str, Any]] = []


class LabResponse(BaseModel):
    id: int
    lab_id: str
    title: str
    difficulty: str
    estimated_time: int
    metadata: Dict[str, Any]

    class Config:
        from_attributes = True


class LabProgressResponse(BaseModel):
    lab_id: str
    status: str
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    hints_used: int
    solution_viewed: bool

    class Config:
        from_attributes = True


class LabCheckRequest(BaseModel):
    lab_id: str


class LabCheckResponse(BaseModel):
    success: bool
    completed: bool
    message: str
    checks: Dict[str, Any]


# System
class SystemStatus(BaseModel):
    cpu_percent: float
    ram_percent: float
    disk_percent: float
    hostname: str


class HealthResponse(BaseModel):
    status: str
    version: str
    uptime: float
