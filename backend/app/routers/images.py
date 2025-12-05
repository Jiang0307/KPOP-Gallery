from fastapi import APIRouter, HTTPException, status, UploadFile, File
from typing import List
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

@router.post("/{star_id}/images/upload", response_model=List[ImageResponse], status_code=status.HTTP_201_CREATED)
async def upload_images(
    star_id: str,
    files: List[UploadFile] = File(...)
):
    """上傳圖片到指定明星"""
    db = get_database()
    
    # 驗證明星是否存在
    star = await db.stars.find_one({"_id": ObjectId(star_id)})
    if not star:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="明星不存在"
        )
    
    uploaded_images = []
    
    for file in files:
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
        
        # 上傳到 Cloudinary
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
        
        # 儲存圖片資訊到 MongoDB
        # 保留 s3_key 和 s3_url 欄位名稱以保持向後兼容
        image_dict = {
            "star_id": ObjectId(star_id),
            "s3_key": public_id,  # 使用 public_id 作為 key
            "s3_url": image_url,   # Cloudinary URL
            "filename": file.filename,
            "file_size": len(file_content),
            "mime_type": file.content_type,
            "uploaded_at": datetime.utcnow()
        }
        
        result = await db.images.insert_one(image_dict)
        image_dict["_id"] = result.inserted_id
        image_dict["id"] = str(result.inserted_id)
        
        uploaded_images.append(ImageResponse(
            id=image_dict["id"],
            star_id=star_id,
            s3_url=image_url,
            filename=file.filename,
            file_size=len(file_content),
            mime_type=file.content_type,
            uploaded_at=image_dict["uploaded_at"]
        ))
    
    return uploaded_images

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

