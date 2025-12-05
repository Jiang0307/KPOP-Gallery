import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

export const ImageModal = ({ image, onClose, onDelete }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (!image) return null;

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirmDialog(false);
    onDelete(image.id);
    onClose();
  };

  const handleDownload = async () => {
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
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1rem'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '2rem',
            height: '2rem',
            cursor: 'pointer',
            fontSize: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}
        >
          ×
        </button>

        <img
          src={image.s3_url}
          alt={image.filename}
          style={{
            maxWidth: '100%',
            maxHeight: '80vh',
            objectFit: 'contain',
            display: 'block'
          }}
        />

        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}>
          <p style={{ margin: '0.5rem 0', fontWeight: '500' }}>{image.filename}</p>
          <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.875rem' }}>
            上傳時間: {new Date(image.uploaded_at).toLocaleString('zh-TW')}
          </p>
          <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.875rem' }}>
            檔案大小: {(image.file_size / 1024 / 1024).toFixed(2)} MB
          </p>
          <div style={{
            marginTop: '0.5rem',
            display: 'flex',
            gap: '0.75rem'
          }}>
            <button
              onClick={handleDownload}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9375rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0056b3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#007bff';
              }}
            >
              下載圖片
            </button>
            <button
              onClick={handleDeleteClick}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9375rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#c82333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#dc3545';
              }}
            >
              刪除圖片
            </button>
          </div>
        </div>
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


