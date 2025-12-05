from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

class Database:
    client: AsyncIOMotorClient = None

database = Database()

async def connect_to_mongo():
    """連接 MongoDB"""
    database.client = AsyncIOMotorClient(settings.mongodb_url)
    print(f"✅ 已連接到 MongoDB: {settings.mongodb_url}")

async def close_mongo_connection():
    """關閉 MongoDB 連接"""
    if database.client:
        database.client.close()
        print("✅ 已關閉 MongoDB 連接")

def get_database():
    """取得資料庫實例"""
    return database.client[settings.mongodb_db_name]





