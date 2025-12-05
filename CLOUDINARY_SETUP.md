# Cloudinary 設定指南

本指南將協助您完成 Cloudinary 的設定，讓圖片上傳功能正常運作。

## 為什麼選擇 Cloudinary？

- ✅ **設定簡單**：只需 3 個環境變數
- ✅ **免費額度**：25GB 儲存、25GB 頻寬/月
- ✅ **自動優化**：自動壓縮和轉換圖片
- ✅ **CDN 加速**：全球 CDN 分發，圖片載入快速
- ✅ **無需複雜配置**：不需要設定 IAM、Bucket 政策等

## 設定步驟

### 步驟 1：註冊 Cloudinary 帳號

1. 前往 [Cloudinary 官網](https://cloudinary.com/)
2. 點擊右上角的 **Sign Up** 按鈕
3. 填寫註冊資訊：
   - Email
   - 密碼
   - 確認您不是機器人
4. 點擊 **Create Account**

### 步驟 2：取得 API 認證資訊

註冊完成後，您會自動進入 **Dashboard** 頁面。如果沒有，請點擊右上角的 **Dashboard**。

在 Dashboard 頁面，您可以看到：

1. **Cloud name**：您的雲端名稱（例如：`dxyz123456`）
2. **API Key**：您的 API 金鑰
3. **API Secret**：您的 API 秘密（點擊 **Reveal** 顯示）

**重要**：請立即複製並保存這三個資訊！

### 步驟 3：設定環境變數

1. 在專案根目錄的 `backend/` 資料夾中，複製 `.env.example` 檔案：

```bash
cd backend
cp .env.example .env
```

2. 編輯 `.env` 檔案，填入您的 Cloudinary 資訊：

```env
# MongoDB 配置
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=star_gallery

# Cloudinary 配置
CLOUDINARY_CLOUD_NAME=您的雲端名稱
CLOUDINARY_API_KEY=您的API金鑰
CLOUDINARY_API_SECRET=您的API秘密

# Session 配置
SECRET_KEY=your-secret-key-change-this
SESSION_EXPIRATION_HOURS=24
```

3. 儲存檔案

### 步驟 4：安裝 Cloudinary 套件

```bash
cd backend
pip install cloudinary
```

或使用 requirements.txt：

```bash
pip install -r requirements.txt
```

### 步驟 5：測試設定

1. 重新啟動後端伺服器：

```bash
cd backend
uvicorn app.main:app --reload
```

2. 檢查後端啟動訊息，應該不會看到 "⚠️ Cloudinary 配置未設定" 的警告
3. 在前端嘗試上傳一張圖片
4. 如果上傳成功，可以在 Cloudinary Dashboard 的 **Media Library** 中查看上傳的圖片

## 查看上傳的圖片

1. 登入 [Cloudinary Dashboard](https://console.cloudinary.com/)
2. 點擊左側選單的 **Media Library**
3. 您應該可以看到 `star_gallery/stars/` 資料夾
4. 點擊進入即可查看所有上傳的圖片

## 常見問題

### Q: 上傳失敗，顯示 "Invalid API Key"
A: 檢查 `.env` 檔案中的 `CLOUDINARY_API_KEY` 和 `CLOUDINARY_API_SECRET` 是否正確。

### Q: 圖片無法顯示
A: Cloudinary 會自動生成公開 URL，如果無法顯示，請檢查：
1. 圖片是否成功上傳到 Cloudinary
2. 在 Cloudinary Dashboard 的 Media Library 中查看圖片 URL

### Q: 如何查看我的使用量？
A: 在 Cloudinary Dashboard 的 **Usage** 頁面可以查看：
- 儲存空間使用量
- 頻寬使用量
- 轉換次數

### Q: 免費額度用完了怎麼辦？
A: Cloudinary 提供多種付費方案，可以根據需求選擇。對於小型專案，免費額度通常足夠使用。

## 免費額度說明

Cloudinary 免費方案包含：
- **25GB 儲存空間**
- **25GB 頻寬/月**
- **25,000 轉換次數/月**

對於大多數小型專案來說，這個額度已經非常充足。

## 安全建議

1. **不要將 `.env` 檔案提交到 Git**：確保 `.env` 在 `.gitignore` 中
2. **保護 API Secret**：API Secret 就像密碼一樣，不要分享給他人
3. **定期檢查使用量**：在 Dashboard 中定期查看使用情況

## 需要幫助？

如果遇到問題，請檢查：
1. Cloudinary Dashboard 中的設定是否正確
2. `.env` 檔案中的值是否正確
3. 後端伺服器的日誌訊息
4. 瀏覽器的開發者工具中的錯誤訊息

更多資訊請參考 [Cloudinary 官方文件](https://cloudinary.com/documentation)





