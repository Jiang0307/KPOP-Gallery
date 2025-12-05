from pydantic import BaseSettings  # 從 pydantic 導入，不是 pydantic_settings
from typing import Optional

class Settings(BaseSettings):
    # MongoDB 配置
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "star_gallery"
    
    # Cloudinary 配置
    cloudinary_cloud_name: Optional[str] = None
    cloudinary_api_key: Optional[str] = None
    cloudinary_api_secret: Optional[str] = None
    
    # Session 配置
    secret_key: str = "your-secret-key-change-this"
    session_expiration_hours: int = 24
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()