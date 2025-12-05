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

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # 前端開發伺服器（Vite 配置的端口）
        "http://localhost:5173",   # Vite 默認端口
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
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

