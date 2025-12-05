from bson import ObjectId
from typing import Any

class PyObjectId(ObjectId):
    """Pydantic 1.x 兼容的 ObjectId 類型"""
    
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v: Any) -> ObjectId:
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str):
            if not ObjectId.is_valid(v):
                raise ValueError("Invalid ObjectId")
            return ObjectId(v)
        raise ValueError("Invalid ObjectId")

    @classmethod
    def __modify_schema__(cls, field_schema: dict):
        field_schema.update(type="string")





