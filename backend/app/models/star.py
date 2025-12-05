from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from bson import ObjectId
from app.models.common import PyObjectId

class Star(BaseModel):
    id: Optional[PyObjectId] = None
    user_id: PyObjectId
    name: str
    created_at: datetime = datetime.utcnow()

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class StarCreate(BaseModel):
    name: str

class StarUpdate(BaseModel):
    name: str

class StarResponse(BaseModel):
    id: str
    user_id: str
    name: str
    created_at: datetime

    class Config:
        json_encoders = {ObjectId: str}

