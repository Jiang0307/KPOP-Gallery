import cloudinary
import cloudinary.uploader
from app.config import settings
import uuid
from typing import Optional

class CloudinaryService:
    def __init__(self):
        """初始化 Cloudinary 客戶端"""
        if not settings.cloudinary_cloud_name or not settings.cloudinary_api_key or not settings.cloudinary_api_secret:
            self.configured = False
            print("⚠️  Cloudinary 配置未設定，圖片上傳功能將無法使用")
        else:
            cloudinary.config(
                cloud_name=settings.cloudinary_cloud_name,
                api_key=settings.cloudinary_api_key,
                api_secret=settings.cloudinary_api_secret
            )
            self.configured = True
    
    def generate_public_id(self, star_id: str, filename: str) -> str:
        """生成 Cloudinary public_id（路徑）"""
        # 格式：star_gallery/stars/{star_id}/{uuid}
        unique_id = str(uuid.uuid4())
        # 移除檔案副檔名，Cloudinary 會自動處理
        name_without_ext = filename.rsplit('.', 1)[0] if '.' in filename else filename
        safe_name = name_without_ext.replace(' ', '_').replace('/', '_')
        public_id = f"star_gallery/stars/{star_id}/{unique_id}_{safe_name}"
        return public_id
    
    async def upload_file(self, file_content: bytes, public_id: str, content_type: str) -> str:
        """上傳檔案到 Cloudinary"""
        if not self.configured:
            raise Exception("Cloudinary 未配置，請設定環境變數")
        
        try:
            # 將 bytes 轉換為檔案格式
            import io
            file_obj = io.BytesIO(file_content)
            
            # 上傳到 Cloudinary（使用 file 參數）
            result = cloudinary.uploader.upload(
                file_obj,
                public_id=public_id,
                resource_type="image",
                overwrite=True,
                use_filename=False
            )
            
            # 返回公開 URL（優先使用 secure_url）
            return result.get("secure_url") or result.get("url")
        except Exception as e:
            raise Exception(f"上傳檔案到 Cloudinary 失敗: {str(e)}")
    
    async def delete_file(self, public_id: str) -> bool:
        """從 Cloudinary 刪除檔案"""
        if not self.configured:
            print("⚠️  Cloudinary 未配置，無法刪除檔案")
            return False
        
        try:
            # 從 public_id 中提取實際的 public_id（移除資料夾前綴）
            result = cloudinary.uploader.destroy(public_id, resource_type="image")
            return result.get("result") == "ok"
        except Exception as e:
            print(f"刪除 Cloudinary 檔案失敗: {str(e)}")
            return False
    
    def get_file_url(self, public_id: str) -> str:
        """取得檔案 URL（使用 public_id）"""
        if not self.configured:
            return ""
        return cloudinary.CloudinaryImage(public_id).build_url()

# 建立全域實例
cloudinary_service = CloudinaryService()

