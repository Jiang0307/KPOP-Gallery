FROM python:3.11-slim

WORKDIR /app

# 安裝依賴
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 複製應用程式碼
COPY . .

# 暴露端口（Railway 會自動分配，這裡只是標記）
EXPOSE 8000

# 啟動命令（從環境變數讀取端口，Railway 會自動設定 PORT）
# 使用 shell 形式以支援環境變數
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]





