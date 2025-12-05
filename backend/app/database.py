from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

class Database:
    client: AsyncIOMotorClient = None

database = Database()

async def connect_to_mongo():
    """連接 MongoDB"""
    database.client = AsyncIOMotorClient(settings.mongodb_uri)
    print(f"✅ 已連接到 MongoDB: {settings.mongodb_uri}")

async def close_mongo_connection():
    """關閉 MongoDB 連接"""
    if database.client:
        database.client.close()
        print("✅ 已關閉 MongoDB 連接")

def get_database():
    """取得資料庫實例（從連接字串中提取資料庫名稱）"""
    # 從連接字串中提取資料庫名稱
    # 格式：mongodb://host:port/db_name 或 mongodb+srv://host/db_name
    uri = settings.mongodb_uri
    
    # 解析 URI 來提取資料庫名稱
    # 移除查詢參數
    uri_without_params = uri.split("?")[0]
    
    # 檢查是否有資料庫名稱（在最後一個 / 之後）
    if "/" in uri_without_params:
        # 分割 URI，取得最後一部分
        parts = uri_without_params.split("/")
        if len(parts) > 1:
            db_name = parts[-1]
            # 如果資料庫名稱為空，使用預設值
            if not db_name or db_name.strip() == "":
                db_name = "kpop_gallery"
        else:
            db_name = "kpop_gallery"
    else:
        db_name = "kpop_gallery"  # 預設值
    
    return database.client[db_name]





