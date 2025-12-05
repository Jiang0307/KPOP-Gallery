from fastapi import APIRouter, HTTPException, status, UploadFile, File
from typing import List
import asyncio
from app.database import get_database
from app.services.cloudinary_service import cloudinary_service
from app.models.image import ImageResponse
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/stars", tags=["images"])

ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def validate_image_file(file: UploadFile) -> None:
    """驗證圖片檔案"""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"不支援的檔案類型。支援的類型：{', '.join(ALLOWED_IMAGE_TYPES)}"
        )

async def process_single_file(
    file: UploadFile,
    star_id: str,
    db
) -> ImageResponse:
    """
    處理單個檔案的上傳（並發處理用）
    
    這個函數會被並發執行，所以每個檔案的上傳不會互相阻塞
    """
    # 驗證檔案類型
    validate_image_file(file)
    
    # 讀取檔案內容
    file_content = await file.read()
    
    # 驗證檔案大小
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"檔案 {file.filename} 超過 10MB 限制"
        )
    
    # 生成 Cloudinary public_id
    public_id = cloudinary_service.generate_public_id(
        star_id=star_id,
        filename=file.filename
    )
    
    # 上傳到 Cloudinary（這裡是 I/O 操作，並發時可以同時進行多個）
    try:
        image_url = await cloudinary_service.upload_file(
            file_content=file_content,
            public_id=public_id,
            content_type=file.content_type
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"上傳失敗: {str(e)}"
        )
    
    # 儲存圖片資訊到 MongoDB（也是 I/O 操作，可以並發）
    image_dict = {
        "star_id": ObjectId(star_id),
        "s3_key": public_id,
        "s3_url": image_url,
        "filename": file.filename,
        "file_size": len(file_content),
        "mime_type": file.content_type,
        "uploaded_at": datetime.utcnow()
    }
    
    result = await db.images.insert_one(image_dict)
    image_dict["_id"] = result.inserted_id
    image_dict["id"] = str(result.inserted_id)
    
    return ImageResponse(
        id=image_dict["id"],
        star_id=star_id,
        s3_url=image_url,
        filename=file.filename,
        file_size=len(file_content),
        mime_type=file.content_type,
        uploaded_at=image_dict["uploaded_at"]
    )

@router.post("/{star_id}/images/upload", response_model=List[ImageResponse], status_code=status.HTTP_201_CREATED)
async def upload_images(
    star_id: str,
    files: List[UploadFile] = File(...)
):
    """
    上傳圖片到指定明星（並發版本）
    
    改進說明：
    - 原本：使用 for loop 順序處理，一個檔案處理完才處理下一個
    - 現在：使用 asyncio.gather 並發處理，多個檔案同時上傳
    
    效能提升：
    - 假設上傳 5 張圖片，每張需要 2 秒
    - 原本：2 + 2 + 2 + 2 + 2 = 10 秒
    - 現在：約 2 秒（最慢的那個檔案的時間）
    
    前端如何送多個檔案：
    - 前端使用 FormData，所有檔案用同一個 key 'files'
    - 後端用 List[UploadFile] 接收所有檔案
    - 然後用 asyncio.gather() 並發處理
    """
    db = get_database()
    
    # 驗證明星是否存在
    star = await db.stars.find_one({"_id": ObjectId(star_id)})
    if not star:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="明星不存在"
        )
    
    # 並發處理所有檔案
    # asyncio.gather 會同時執行所有任務，等待全部完成
    upload_tasks = [
        process_single_file(file, star_id, db)
        for file in files
    ]
    
    # 使用 asyncio.gather 並發執行所有上傳任務
    # 如果某個檔案失敗，會拋出異常（可以選擇部分成功，見下方註解）
    try:
        uploaded_images = await asyncio.gather(*upload_tasks)
        return list(uploaded_images)
    except HTTPException:
        # 重新拋出 HTTPException
        raise
    except Exception as e:
        # 處理其他異常
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"上傳過程中發生錯誤: {str(e)}"
        )

@router.get("/{star_id}/images", response_model=List[ImageResponse])
async def get_star_images(
    star_id: str,
    page: int = 1,
    limit: int = 20
):
    """取得指定明星的圖片列表（支援分頁）"""
    db = get_database()
    
    # 驗證明星是否存在
    star = await db.stars.find_one({"_id": ObjectId(star_id)})
    if not star:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="明星不存在"
        )
    
    # 計算跳過數量
    skip = (page - 1) * limit
    
    # 查詢圖片
    cursor = db.images.find({"star_id": ObjectId(star_id)}).sort("uploaded_at", -1).skip(skip).limit(limit)
    
    images = await cursor.to_list(length=limit)
    
    return [ImageResponse(
        id=str(img["_id"]),
        star_id=str(img["star_id"]),
        s3_url=img["s3_url"],
        filename=img["filename"],
        file_size=img["file_size"],
        mime_type=img["mime_type"],
        uploaded_at=img["uploaded_at"]
    ) for img in images]

@router.delete("/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_image(image_id: str):
    """刪除圖片"""
    db = get_database()
    
    # 查詢圖片
    image = await db.images.find_one({"_id": ObjectId(image_id)})
    
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="圖片不存在"
        )
    
    # 從 Cloudinary 刪除檔案
    await cloudinary_service.delete_file(image["s3_key"])
    
    # 從 MongoDB 刪除記錄
    await db.images.delete_one({"_id": ObjectId(image_id)})
    
    return None

@router.get("/images/{image_id}", response_model=ImageResponse)
async def get_image(image_id: str):
    """取得單一圖片詳情"""
    db = get_database()
    
    image = await db.images.find_one({"_id": ObjectId(image_id)})
    
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="圖片不存在"
        )
    
    return ImageResponse(
        id=str(image["_id"]),
        star_id=str(image["star_id"]),
        s3_url=image["s3_url"],
        filename=image["filename"],
        file_size=image["file_size"],
        mime_type=image["mime_type"],
        uploaded_at=image["uploaded_at"]
    )

