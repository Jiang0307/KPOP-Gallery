# Star Gallery - 明星圖片收藏系統

一個全端明星圖片收藏系統，使用 React + FastAPI + MongoDB + Cloudinary。

## 技術棧

- **前端**: React + TypeScript + Vite
- **後端**: FastAPI (Python)
- **資料庫**: MongoDB
- **圖片儲存**: Cloudinary
- **身份驗證**: Session-based
- **開發環境**: Docker + Docker Compose

## 專案結構

```
Star-Gallery/
├── frontend/          # React 前端應用
├── backend/           # FastAPI 後端應用
├── docker-compose.yml # 本地開發環境
└── README.md
```

## 快速開始

### 1. 環境設定

#### 設定 Cloudinary（必須）

圖片上傳功能需要 Cloudinary 設定。請參考 [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md) 取得完整的設定步驟。

**快速設定：**
1. 註冊 [Cloudinary 帳號](https://cloudinary.com/)（免費）
2. 在 Dashboard 取得 Cloud Name、API Key 和 API Secret
3. 複製環境變數範例檔案：
   ```bash
   cd backend
   cp .env.example .env
   ```
4. 編輯 `backend/.env` 檔案，填入您的 Cloudinary 配置：
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

**詳細步驟請參考：** [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md)

### 2. 使用 Docker Compose 啟動（推薦）

```bash
docker-compose up -d
```

這會啟動：
- MongoDB (port 27017)
- 後端 API (port 8000)
- 前端開發伺服器 (port 5173)

### 3. 手動啟動（開發模式）

#### 後端
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### 前端
```bash
cd frontend
npm install
npm run dev
```

## 功能

- ✅ 明星管理（新增、編輯、刪除）
- ✅ 圖片上傳到 Cloudinary
- ✅ 明星專屬圖片畫廊
- ✅ 無限滾動載入
- ✅ 搜尋功能

## 開發階段

- [x] 階段 1: 專案初始化與基礎架構
- [ ] 階段 2: 後端基礎架構與身份驗證
- [x] 階段 3: Cloudinary 整合
- [ ] 階段 4: 明星管理 API
- [ ] 階段 5: 圖片管理 API
- [ ] 階段 6: 前端身份驗證
- [ ] 階段 7: 前端明星管理
- [ ] 階段 8: 前端圖片畫廊
- [ ] 階段 9: 圖片上傳功能
- [ ] 階段 10: 搜尋功能
- [ ] 階段 11: Docker 容器化
- [ ] 階段 12: 雲端部署與 GitLab CI/CD（最後階段）

## 注意事項

- **必須設定 Cloudinary**：圖片上傳功能需要 Cloudinary 配置，請參考 [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md)
- MongoDB 會自動在 Docker 中啟動
- 開發時前端會連接到 `http://localhost:8000` 的後端 API
- 如果未設定 Cloudinary，系統仍可運作，但圖片上傳功能將無法使用
