import axios from 'axios';

// API Base URL - 統一配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// 建立 axios 實例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;


