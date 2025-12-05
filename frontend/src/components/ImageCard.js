import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

export const ImageCard = ({ image, onDelete, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirmDialog(false);
    onDelete(image.id);
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(image.s3_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = image.filename || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // 如果 fetch 失敗，嘗試直接打開
      window.open(image.s3_url, '_blank');
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        aspectRatio: '1',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      {!imageLoaded && !imageError && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#999'
        }}>
          載入中...
        </div>
      )}
      
      {imageError ? (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          backgroundColor: '#f0f0f0'
        }}>
          載入失敗
        </div>
      ) : (
        <img
          src={image.s3_url}
          alt={image.filename}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: imageLoaded ? 'block' : 'none'
          }}
        />
      )}

      <div style={{
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <button
          onClick={handleDownload}
          style={{
            backgroundColor: 'rgba(0, 123, 255, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '0.25rem 0.5rem',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 105, 217, 1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.9)';
          }}
          title="下載圖片"
        >
          下載
        </button>
        <button
          onClick={handleDeleteClick}
          style={{
            backgroundColor: 'rgba(220, 53, 69, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '0.25rem 0.5rem',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(200, 35, 51, 1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.9)';
          }}
          title="刪除圖片"
        >
          刪除
        </button>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="確認刪除"
        message="確定要刪除這張圖片嗎？"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmDialog(false)}
        confirmText="確定"
        cancelText="取消"
      />
    </div>
  );
};


