import os
from pathlib import Path
from pydantic_settings import BaseSettings

PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data"
LABS_DIR = PROJECT_ROOT / "content" / "labs"

class Settings(BaseSettings):
    # App
    APP_NAME: str = "HOMELAB Agent"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Server
    HOST: str = "127.0.0.1"
    PORT: int = 8000

    # Database
    DATABASE_URL: str = f"sqlite:///{DATA_DIR}/homelab.db"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Labs
    LABS_PATH: str = str(LABS_DIR)

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# Ensure data directory exists
DATA_DIR.mkdir(parents=True, exist_ok=True)
