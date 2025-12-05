# 明星圖片收藏網站開發計劃

## 專案名稱
Star-Gallery（明星圖片收藏網站）

## 技術棧
- **前端**: React
- **後端**: FastAPI (Python)
- **資料庫**: MongoDB
- **圖片儲存**: Cloudinary
- **容器化**: Docker + Docker Compose
- **CI/CD**: GitLab CI/CD

**說明**: 
- NPM 用來安裝和管理套件（如 React、axios 等）
- Vite 是建置工具，取代 Create React App，提供更快的開發體驗
- TypeScript 提供型別安全，提升程式碼品質和開發體驗
- 兩者可以一起使用，不衝突

## 專案結構
```
Star-Gallery/
├── frontend/          # React 前端應用
├── backend/           # FastAPI 後端應用
├── docker-compose.yml
├── .gitlab-ci.yml     # GitLab CI/CD 配置
└── README.md
```

## 核心功能
1. **圖片上傳**: 支援拖放上傳，上傳到 AWS S3 / cloudinary
2. **圖片畫廊**: 網格展示所有圖片，支援無限滾動
3. **標籤系統**: 為每張圖片添加標籤（如：演員、歌手、運動員）
4. **搜尋功能**: 根據標籤或明星名稱搜尋

## 實作步驟

### 階段 1: 專案初始化與基礎架構
- 建立前端 React 專案（Vite + TypeScript）
- 建立後端 FastAPI 專案結構
- 設定 Docker 和 Docker Compose（包含 MongoDB）
- 配置環境變數管理

### 階段 2: 後端 API 開發
- 設定 FastAPI 應用和路由
- 實作 MongoDB 連接和資料模型
- 實作 AWS S3 整合（上傳、刪除、取得 URL）
- 建立 API 端點：
  - `POST /api/images/upload` - 上傳圖片
  - `GET /api/images` - 取得圖片列表（支援分頁、搜尋）
  - `GET /api/images/{id}` - 取得單一圖片詳情
  - `DELETE /api/images/{id}` - 刪除圖片
  - `PUT /api/images/{id}/tags` - 更新標籤

### 階段 3: 前端開發
- 設定 React Router 和狀態管理
- 建立圖片上傳元件（拖放功能）
- 建立圖片畫廊元件（網格佈局）
- 建立標籤管理介面
- 建立搜尋功能
- 整合 API 呼叫

### 階段 4: Docker 容器化
- 建立前端 Dockerfile
- 建立後端 Dockerfile
- 更新 docker-compose.yml（包含所有服務）
- 測試本地 Docker 環境

### 階段 5: CI/CD 設定（最後階段）
- 設定 GitLab CI/CD 流程
- 配置自動化測試、建置和部署流程

## 主要檔案結構

### 後端
- `backend/main.py` - FastAPI 應用入口
- `backend/models/image.py` - 圖片資料模型
- `backend/routers/images.py` - 圖片相關路由
- `backend/services/s3_service.py` - AWS S3 服務
- `backend/config.py` - 配置管理
- `backend/Dockerfile` - 後端容器化配置
- `backend/requirements.txt` - Python 依賴套件

### 前端
- `frontend/src/App.tsx` - 主應用元件
- `frontend/src/components/ImageUpload.tsx` - 上傳元件
- `frontend/src/components/ImageGallery.tsx` - 畫廊元件
- `frontend/src/components/SearchBar.tsx` - 搜尋元件
- `frontend/src/services/api.ts` - API 呼叫服務
- `frontend/src/types/index.ts` - TypeScript 型別定義
- `frontend/Dockerfile` - 前端容器化配置
- `frontend/package.json` - NPM 依賴套件
- `frontend/tsconfig.json` - TypeScript 配置

### 配置檔案
- `docker-compose.yml` - 本地開發環境
- `.gitlab-ci.yml` - GitLab CI/CD 流程配置
- `.env.example` - 環境變數範例

## 學習重點
- TypeScript 型別系統和介面定義
- React + TypeScript 的最佳實踐
- FastAPI 的異步處理和依賴注入
- AWS S3 的預簽名 URL 和直接上傳
- MongoDB 的查詢和索引優化
- Docker 多階段建置和最佳實踐
- CI/CD 的自動化流程（最後階段）

## 開發順序
1. 初始化專案結構
2. 設定 Docker 環境
3. 開發後端 API
4. 開發前端介面
5. Docker 容器化
6. CI/CD 設定（最後階段）

## 注意事項
- 專案名稱：Star-Gallery
- 後端使用 FastAPI（Python 框架），適合學習和快速開發
- 前端使用 TypeScript 提供型別安全
- CI/CD 使用 GitLab CI/CD
- 所有對話和計劃已保存在此文件中

