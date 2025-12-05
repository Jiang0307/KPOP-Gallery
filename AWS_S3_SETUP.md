# AWS S3 設定指南

本指南將協助您完成 AWS S3 的設定，讓圖片上傳功能正常運作。

## 前置需求

- 已擁有 AWS 帳號
- 已登入 AWS 控制台

## 設定步驟

### 步驟 1：建立 S3 Bucket

1. 登入 [AWS 控制台](https://console.aws.amazon.com/)
2. 在搜尋欄輸入 "S3" 並選擇 **S3** 服務
3. 點擊 **建立儲存貯體** (Create bucket) 按鈕
4. 填寫儲存貯體設定：
   - **儲存貯體名稱**：輸入一個唯一的名稱（例如：`star-gallery-images-2024`）
     - 注意：S3 儲存貯體名稱必須全球唯一
   - **AWS 區域**：選擇離您最近的區域（例如：`us-east-1`、`ap-northeast-1`）
   - **物件擁有權**：選擇 **ACL 已停用** (ACLs disabled)
   - **封鎖所有公開存取**：取消勾選（因為圖片需要公開讀取）
     - 勾選「我了解目前的設定和此儲存貯體及其物件的結果」
5. 點擊 **建立儲存貯體** (Create bucket)

### 步驟 2：設定 Bucket 權限（公開讀取）

1. 點擊剛建立的儲存貯體名稱
2. 切換到 **權限** (Permissions) 標籤
3. 在 **儲存貯體政策** (Bucket policy) 區塊，點擊 **編輯** (Edit)
4. 貼上以下政策（將 `YOUR-BUCKET-NAME` 替換為您的儲存貯體名稱）：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::star-gallery-jgd/*"
        }
    ]
}
```

5. 點擊 **儲存變更** (Save changes)

### 步驟 3：建立 IAM 用戶

1. 在 AWS 控制台搜尋欄輸入 "IAM" 並選擇 **IAM** 服務
2. 在左側選單點擊 **使用者** (Users)
3. 點擊 **建立使用者** (Create user) 按鈕
4. 填寫使用者資訊：
   - **使用者名稱**：輸入名稱（例如：`star-gallery-s3-user`）
   - **提供 AWS 認證資料存取**：勾選此選項
5. 點擊 **下一步** (Next)

### 步驟 4：設定 IAM 政策

1. 在 **設定權限** 頁面，選擇 **直接附加現有政策** (Attach policies directly)
2. 點擊 **建立政策** (Create policy) 按鈕
3. 切換到 **JSON** 標籤
4. 貼上以下政策（將 `YOUR-BUCKET-NAME` 替換為您的儲存貯體名稱）：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME"
        }
    ]
}
```

5. 點擊 **下一步** (Next)
6. 輸入政策名稱（例如：`StarGalleryS3Policy`）
7. 點擊 **建立政策** (Create policy)
8. 返回建立使用者頁面，重新整理政策列表
9. 搜尋並勾選剛建立的政策
10. 點擊 **下一步** (Next)
11. 點擊 **建立使用者** (Create user)

### 步驟 5：取得 Access Key 和 Secret Key

1. 在 IAM 使用者列表中，點擊剛建立的使用者名稱
2. 切換到 **安全性認證資料** (Security credentials) 標籤
3. 在 **存取金鑰** (Access keys) 區塊，點擊 **建立存取金鑰** (Create access key)
4. 選擇使用案例：**應用程式在 AWS 外部執行** (Application running outside AWS)
5. 點擊 **下一步** (Next)
6. 點擊 **建立存取金鑰** (Create access key)
7. **重要**：立即複製並保存以下資訊：
   - **存取金鑰 ID** (Access key ID)
   - **秘密存取金鑰** (Secret access key)
   - ⚠️ **警告**：秘密存取金鑰只會顯示一次，請務必妥善保存

### 步驟 6：設定環境變數

1. 在專案根目錄的 `backend/` 資料夾中，複製 `.env.example` 檔案：

```bash
cd backend
cp .env.example .env
```

2. 編輯 `.env` 檔案，填入您的 AWS 資訊：

```env
# MongoDB 配置
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=star_gallery

# AWS S3 配置
AWS_ACCESS_KEY_ID=您的存取金鑰ID
AWS_SECRET_ACCESS_KEY=您的秘密存取金鑰
AWS_S3_BUCKET_NAME=您的儲存貯體名稱
AWS_REGION=您選擇的區域（例如：us-east-1）

# Session 配置
SECRET_KEY=your-secret-key-change-this
SESSION_EXPIRATION_HOURS=24
```

3. 儲存檔案

### 步驟 7：測試設定

1. 重新啟動後端伺服器：

```bash
cd backend
uvicorn app.main:app --reload
```

2. 檢查後端啟動訊息，應該不會看到 "⚠️ AWS S3 配置未設定" 的警告
3. 在前端嘗試上傳一張圖片
4. 如果上傳成功，可以在 AWS S3 控制台查看儲存貯體中的圖片

## 常見問題

### Q: 上傳失敗，顯示 "Access Denied"
A: 檢查 IAM 政策是否正確設定，確保使用者有 `s3:PutObject` 權限。

### Q: 圖片無法顯示（403 Forbidden）
A: 檢查儲存貯體政策是否正確設定，確保允許公開讀取 (`s3:GetObject`)。

### Q: 找不到儲存貯體
A: 確認儲存貯體名稱和區域是否正確，區域必須與 `.env` 中的 `AWS_REGION` 一致。

### Q: 如何查看上傳的圖片？
A: 在 AWS S3 控制台，進入您的儲存貯體，應該可以看到 `stars/` 資料夾，裡面包含上傳的圖片。

## 安全建議

1. **不要將 `.env` 檔案提交到 Git**：確保 `.env` 在 `.gitignore` 中
2. **定期輪換存取金鑰**：建議每 90 天更換一次
3. **限制 IAM 政策範圍**：只給予必要的權限
4. **使用環境變數**：在生產環境中使用環境變數而非檔案

## 費用說明

AWS S3 的費用包括：
- **儲存費用**：根據儲存的資料量計費（約 $0.023/GB/月）
- **請求費用**：上傳和讀取請求的費用（通常很低）
- **資料傳輸費用**：從 S3 下載資料的費用（前 100GB/月免費）

對於小型專案，通常每月費用不會超過 $1-2 美元。

## 需要幫助？

如果遇到問題，請檢查：
1. AWS 控制台中的設定是否正確
2. `.env` 檔案中的值是否正確
3. 後端伺服器的日誌訊息
4. 瀏覽器的開發者工具中的錯誤訊息





