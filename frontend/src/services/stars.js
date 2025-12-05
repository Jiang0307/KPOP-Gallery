import api from './api';

export const starsService = {
  // 取得明星列表
  async getStars(search) {
    const params = search ? { search } : {};
    const response = await api.get('/api/stars', { params });
    return response.data;
  },

  // 取得明星詳情
  async getStar(starId) {
    const response = await api.get(`/api/stars/${starId}`);
    return response.data;
  },

  // 新增明星
  async createStar(starData) {
    const response = await api.post('/api/stars', starData);
    return response.data;
  },

  // 更新明星
  async updateStar(starId, starData) {
    const response = await api.put(`/api/stars/${starId}`, starData);
    return response.data;
  },

  // 刪除明星
  async deleteStar(starId) {
    await api.delete(`/api/stars/${starId}`);
  },
};


