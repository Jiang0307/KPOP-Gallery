from datetime import datetime
from pydantic import BaseModel
from bson import ObjectId

class StarCreate(BaseModel):
    name: str

class StarUpdate(BaseModel):
    name: str

class StarResponse(BaseModel):
    id: str
    name: str
    created_at: datetime

    class Config:
        json_encoders = {ObjectId: str}

