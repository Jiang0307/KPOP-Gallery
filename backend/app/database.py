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
    db_name = "kpop_gallery"  # 預設值
    
    # 嘗試從 URI 中提取資料庫名稱
    if "/" in uri:
        # 分割 URI，取得最後一部分（在最後一個 / 之後）
        parts = uri.split("/")
        if len(parts) > 3:  # mongodb+srv://user:pass@host/db_name 或 mongodb://host:port/db_name
            potential_db = parts[-1].split("?")[0]  # 移除查詢參數
            if potential_db and potential_db.strip():  # 確保不是空字串
                db_name = potential_db
    
    return database.client[db_name]





