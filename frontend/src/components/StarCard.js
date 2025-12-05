import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from './ConfirmDialog';
import { imagesService } from '../services/images';

export const StarCard = ({ star, onDelete }) => {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);

  // 獲取明星的圖片（隨機選擇一張）
  useEffect(() => {
    const loadPreviewImage = async () => {
      try {
        setLoadingImage(true);
        // 獲取多張圖片以便隨機選擇
        const images = await imagesService.getStarImages(star.id, 1, 10);
        if (images && images.length > 0) {
          // 隨機選擇一張
          const randomIndex = Math.floor(Math.random() * images.length);
          setPreviewImage(images[randomIndex]);
        }
      } catch (err) {
        // 如果獲取失敗或沒有圖片，保持 previewImage 為 null
        console.error('載入預覽圖失敗:', err);
      } finally {
        setLoadingImage(false);
      }
    };

    loadPreviewImage();
  }, [star.id]);

  const handleClick = () => {
    navigate(`/stars/${star.id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // 防止觸發卡片點擊
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirmDialog(false);
    onDelete(star.id);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        aspectRatio: '1',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      {previewImage ? (
        <>
          <img
            src={previewImage.s3_url}
            alt={star.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              flex: 1
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            padding: '0.75rem',
            color: 'white'
          }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
              {star.name}
            </h3>
          </div>
        </>
      ) : (
        <>
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {loadingImage ? (
              <p style={{ color: '#999', fontSize: '0.875rem' }}>載入中...</p>
            ) : (
              <p style={{ 
                color: '#999', 
                fontSize: '0.875rem',
                textAlign: 'center',
                margin: 0
              }}>
                尚無圖片<br />快來新增吧
              </p>
            )}
          </div>
          {!loadingImage && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
              padding: '0.75rem',
              color: 'white'
            }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                {star.name}
              </h3>
            </div>
          )}
        </>
      )}

      <button
        onClick={handleDeleteClick}
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          backgroundColor: 'rgba(220, 53, 69, 0.9)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '0.25rem 0.5rem',
          cursor: 'pointer',
          fontSize: '0.75rem',
          fontWeight: '500',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(200, 35, 51, 1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.9)';
        }}
      >
        刪除
      </button>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="確認刪除"
        message={`確定要刪除「${star.name}」嗎？這會同時刪除該明星的所有圖片。`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmDialog(false)}
        confirmText="確定"
        cancelText="取消"
      />
    </div>
  );
};


