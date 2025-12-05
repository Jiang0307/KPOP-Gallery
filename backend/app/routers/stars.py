from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from app.database import get_database
from app.models.star import StarCreate, StarUpdate, StarResponse
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/stars", tags=["stars"])

@router.get("", response_model=List[StarResponse])
async def get_stars(search: Optional[str] = None):
    """取得所有明星列表（支援搜尋）"""
    db = get_database()
    
    query = {}
    
    # 如果有搜尋關鍵字，加入搜尋條件
    if search:
        query["name"] = {"$regex": search, "$options": "i"}  # 不區分大小寫
    
    cursor = db.stars.find(query).sort("created_at", -1)
    stars = await cursor.to_list(length=1000)  # 最多 1000 筆
    
    return [StarResponse(
        id=str(star["_id"]),
        name=star["name"],
        created_at=star["created_at"]
    ) for star in stars]

@router.post("", response_model=StarResponse, status_code=status.HTTP_201_CREATED)
async def create_star(star_data: StarCreate):
    """新增明星"""
    db = get_database()
    
    # 檢查是否已有相同名字的明星
    existing_star = await db.stars.find_one({"name": star_data.name})
    if existing_star:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="該明星已存在"
        )
    
    # 建立新明星
    star_dict = {
        "name": star_data.name,
        "created_at": datetime.utcnow()
    }
    
    result = await db.stars.insert_one(star_dict)
    star_dict["_id"] = result.inserted_id
    star_dict["id"] = str(result.inserted_id)
    
    return StarResponse(
        id=star_dict["id"],
        name=star_dict["name"],
        created_at=star_dict["created_at"]
    )

@router.get("/{star_id}", response_model=StarResponse)
async def get_star(star_id: str):
    """取得明星詳情"""
    db = get_database()
    
    star = await db.stars.find_one({"_id": ObjectId(star_id)})
    
    if not star:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="明星不存在"
        )
    
    return StarResponse(
        id=str(star["_id"]),
        name=star["name"],
        created_at=star["created_at"]
    )

@router.put("/{star_id}", response_model=StarResponse)
async def update_star(star_id: str, star_data: StarUpdate):
    """更新明星名字"""
    db = get_database()
    
    # 驗證明星是否存在
    star = await db.stars.find_one({"_id": ObjectId(star_id)})
    if not star:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="明星不存在"
        )
    
    # 檢查新名字是否與其他明星重複
    existing_star = await db.stars.find_one({
        "name": star_data.name,
        "_id": {"$ne": ObjectId(star_id)}
    })
    if existing_star:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="該明星名字已存在"
        )
    
    # 更新明星
    await db.stars.update_one(
        {"_id": ObjectId(star_id)},
        {"$set": {"name": star_data.name}}
    )
    
    updated_star = await db.stars.find_one({"_id": ObjectId(star_id)})
    
    return StarResponse(
        id=str(updated_star["_id"]),
        name=updated_star["name"],
        created_at=updated_star["created_at"]
    )

@router.delete("/{star_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_star(star_id: str):
    """刪除明星（同時刪除該明星的所有圖片）"""
    db = get_database()
    
    # 驗證明星是否存在
    star = await db.stars.find_one({"_id": ObjectId(star_id)})
    if not star:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="明星不存在"
        )
    
    # 取得該明星的所有圖片
    images = await db.images.find({"star_id": ObjectId(star_id)}).to_list(length=10000)
    
    # 從 Cloudinary 刪除所有圖片
    from app.services.cloudinary_service import cloudinary_service
    for image in images:
        await cloudinary_service.delete_file(image["s3_key"])
    
    # 從 MongoDB 刪除所有圖片記錄
    await db.images.delete_many({"star_id": ObjectId(star_id)})
    
    # 刪除明星
    await db.stars.delete_one({"_id": ObjectId(star_id)})
    
    return None

