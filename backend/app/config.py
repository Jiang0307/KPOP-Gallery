from pydantic import BaseSettings  # 從 pydantic 導入，不是 pydantic_settings
from typing import Optional

class Settings(BaseSettings):
    # MongoDB 配置（連接字串包含資料庫名稱，與 MERN-Todo-List 相同）
    mongodb_uri: str = "mongodb://localhost:27017/kpop_gallery"
    
    # Cloudinary 配置
    cloudinary_cloud_name: Optional[str] = None
    cloudinary_api_key: Optional[str] = None
    cloudinary_api_secret: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()