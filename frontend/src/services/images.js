import api from './api';

export const imagesService = {
  // 取得明星的圖片列表
  async getStarImages(starId, page = 1, limit = 20) {
    const response = await api.get(`/api/stars/${starId}/images`, {
      params: { page, limit }
    });
    return response.data;
  },

  // 取得單一圖片詳情
  async getImage(imageId) {
    const response = await api.get(`/api/stars/images/${imageId}`);
    return response.data;
  },

  // 上傳圖片到指定明星
  async uploadImages(starId, files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await api.post(`/api/stars/${starId}/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 刪除圖片
  async deleteImage(imageId) {
    await api.delete(`/api/stars/images/${imageId}`);
  },
};


