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
    # 格式：mongodb://host:port/db_name 或 mongodb+srv://host/db_name?options
    uri = settings.mongodb_uri
    
    # 解析 URI 以提取資料庫名稱
    try:
        # 移除查詢參數
        uri_without_query = uri.split("?")[0]
        # 分割 URI，取得最後一部分
        parts = uri_without_query.split("/")
        # 如果最後一部分是資料庫名稱（不是空字串且不是主機名）
        if len(parts) > 3 and parts[-1]:
            db_name = parts[-1]
        else:
            # 如果沒有指定資料庫名稱，使用預設值
            db_name = "kpop_gallery"
    except Exception:
        # 如果解析失敗，使用預設值
        db_name = "kpop_gallery"
    
    return database.client[db_name]





