from datetime import datetime
from pydantic import BaseModel
from bson import ObjectId

class ImageResponse(BaseModel):
    id: str
    star_id: str
    s3_url: str
    filename: str
    file_size: int
    mime_type: str
    uploaded_at: datetime

    class Config:
        json_encoders = {ObjectId: str}

