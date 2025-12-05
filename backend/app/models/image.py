from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from bson import ObjectId
from app.models.common import PyObjectId

class Image(BaseModel):
    id: Optional[PyObjectId] = None
    user_id: PyObjectId
    star_id: PyObjectId
    s3_key: str
    s3_url: str
    filename: str
    file_size: int
    mime_type: str
    uploaded_at: datetime = datetime.utcnow()

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ImageResponse(BaseModel):
    id: str
    user_id: str
    star_id: str
    s3_url: str
    filename: str
    file_size: int
    mime_type: str
    uploaded_at: datetime

    class Config:
        json_encoders = {ObjectId: str}

