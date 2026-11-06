import os
from typing import List, Union
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "FindBack"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://findback:findback_secure_password@localhost:5432/findback_db"
    SYNC_DATABASE_URL: str = "postgresql://findback:findback_secure_password@localhost:5432/findback_db"
    
    # Security
    JWT_SECRET: str = "supersecretkey_change_in_production_findback_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # Campus Domain Restriction (supports comma-separated list of approved institutional domains)
    ALLOWED_EMAIL_DOMAIN: str = "heritageit.edu,campus.edu"

    @property
    def allowed_domains_list(self) -> List[str]:
        return [d.strip().lower() for d in self.ALLOWED_EMAIL_DOMAIN.split(",") if d.strip()]
    
    # Uploads & Assets
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
    MAX_UPLOAD_SIZE_BYTES: int = 5 * 1024 * 1024  # 5 MB maximum file upload limit
    
    # AI Engine Settings
    USE_LOCAL_MODELS: bool = True
    GEMINI_API_KEY: str = ""
    
    # Matching Weights (Composite Score = 100%)
    WEIGHT_TEXT: float = 0.35
    WEIGHT_IMAGE: float = 0.35
    WEIGHT_SPATIAL: float = 0.15
    WEIGHT_TEMPORAL: float = 0.15
    MATCH_NOTIFICATION_THRESHOLD: float = 75.0

    @validator("JWT_SECRET")
    def validate_jwt_secret(cls, v: str, values: dict) -> str:
        env = values.get("ENVIRONMENT", "development")
        if env == "production" and ("change_in_production" in v or len(v) < 32):
            raise ValueError("Insecure default JWT_SECRET detected in production! Must be configured with >=32 random characters.")
        return v

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
