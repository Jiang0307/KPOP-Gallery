from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import connect_to_mongo, close_mongo_connection
from app.routers import images, stars

app = FastAPI(
    title="Star Gallery API",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    # 啟動時連接 MongoDB
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    # 關閉時斷開連接
    await close_mongo_connection()

# CORS 設定 - 允許所有來源（與 MERN-Todo-List 專案相同）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允許所有來源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 註冊路由
app.include_router(stars.router)
app.include_router(images.router)

@app.get("/")
async def root():
    return {"message": "Star Gallery API"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

