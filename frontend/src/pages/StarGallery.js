import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { starsService } from '../services/stars';
import { imagesService } from '../services/images';
import { ImageGallery } from '../components/ImageGallery';
import { ImageModal } from '../components/ImageModal';
import { ImageUpload } from '../components/ImageUpload';
import { Alert } from '../components/Alert';

export const StarGallery = () => {
  const { starId } = useParams();
  const [star, setStar] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const limit = 12; // 預設載入 12 張（約 2-3 列）

  // 載入明星資訊
  useEffect(() => {
    if (!starId) return;

    const loadStar = async () => {
      try {
        const starData = await starsService.getStar(starId);
        setStar(starData);
      } catch (err) {
        setError(err.response?.data?.detail || '載入失敗');
      }
    };

    loadStar();
  }, [starId]);

  // 載入圖片
  const loadImages = useCallback(async (pageNum, append = false) => {
    if (!starId) return;

    try {
      if (!append) {
        setLoading(true);
        setError('');
      } else {
        setLoadingMore(true);
      }

      const newImages = await imagesService.getStarImages(starId, pageNum, limit);
      
      if (append) {
        setImages(prev => [...prev, ...newImages]);
      } else {
        setImages(newImages);
      }

      setHasMore(newImages.length === limit);
    } catch (err) {
      setError(err.response?.data?.detail || '載入圖片失敗');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [starId, limit]);

  useEffect(() => {
    if (starId) {
      loadImages(1, false);
    }
  }, [starId, loadImages]);

  // 載入更多圖片
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadImages(nextPage, true);
    }
  };

  // 上傳圖片
  const handleUploadImages = async (files) => {
    if (!starId) return;

    try {
      const newImages = await imagesService.uploadImages(starId, files);
      setImages([...newImages, ...images]);
      setPage(1); // 重置分頁
    } catch (err) {
      throw err;
    }
  };

  // 刪除圖片
  const handleDeleteImage = async (imageId) => {
    try {
      await imagesService.deleteImage(imageId);
      setImages(images.filter(img => img.id !== imageId));
      if (selectedImage?.id === imageId) {
        setSelectedImage(null);
      }
    } catch (err) {
      setAlertMessage(err.response?.data?.detail || '刪除失敗');
      setShowAlert(true);
    }
  };

  if (!starId) {
    return <div>無效的明星 ID</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '2rem'
    }}>
      {/* 頂部導航 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        backgroundColor: 'white',
        padding: '1rem 2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            to="/"
            style={{
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            ← 返回明星列表
          </Link>
          <h1 style={{ margin: 0, color: '#333' }}>
            {star ? `⭐ ${star.name}` : '載入中...'}
          </h1>
        </div>
        <ImageUpload
          onUpload={handleUploadImages}
          disabled={loading}
          buttonMode={true}
        />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 錯誤訊息 */}
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {/* 圖片畫廊 */}
        {loading && images.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            載入中...
          </div>
        ) : images.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            color: '#666'
          }}>
            還沒有圖片，快來上傳第一張吧！
          </div>
        ) : (
          <ImageGallery
            images={images}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loading={loadingMore}
            onImageClick={setSelectedImage}
            onImageDelete={handleDeleteImage}
          />
        )}
      </div>

      {/* 圖片詳情 Modal */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDelete={handleDeleteImage}
        />
      )}

      <Alert
        isOpen={showAlert}
        message={alertMessage}
        type="error"
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
};


