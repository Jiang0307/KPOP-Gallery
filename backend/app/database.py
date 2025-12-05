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
    if "/" in uri:
        db_name = uri.split("/")[-1].split("?")[0]  # 移除查詢參數
    else:
        db_name = "kpop_gallery"  # 預設值
    return database.client[db_name]





