"""
Application settings loaded from environment variables.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Configuration loaded from environment."""
    
    # S3 Configuration
    s3_bucket: str
    s3_prefix: str = "telemetry/"  # Path prefix inside bucket
    aws_region: str = "us-east-1"
    
    # Optional: explicit credentials (prefer IAM roles in production)
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None
    
    # App settings
    app_name: str = "Telemetry Analytics API"
    debug: bool = False
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance."""
    return Settings()
