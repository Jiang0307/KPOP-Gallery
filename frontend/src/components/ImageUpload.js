import { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

export const ImageUpload = ({ onUpload, disabled = false, buttonMode = false }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setError('');

    try {
      await onUpload(acceptedFiles);
    } catch (err) {
      setError(err.response?.data?.detail || '上傳失敗');
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: disabled || uploading,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    noClick: buttonMode, // 按鈕模式下不讓 dropzone 處理點擊
  });

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // 驗證檔案大小和類型
      const validFiles = files.filter(file => {
        const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
        if (!isValidType) {
          setError(`${file.name} 不是支援的圖片格式`);
        } else if (!isValidSize) {
          setError(`${file.name} 超過 10MB 大小限制`);
        }
        return isValidType && isValidSize;
      });
      
      if (validFiles.length > 0) {
        await onDrop(validFiles);
      }
      // 重置 input，這樣可以再次選擇相同的檔案
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 按鈕模式
  if (buttonMode) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={disabled || uploading}
        />
        <button
          onClick={handleButtonClick}
          disabled={disabled || uploading}
          style={{
            padding: '0.5rem 1.25rem',
            backgroundColor: uploading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: disabled || uploading ? 'not-allowed' : 'pointer',
            fontSize: '0.9375rem',
            fontWeight: '500',
            transition: 'background-color 0.2s',
            opacity: disabled || uploading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!disabled && !uploading) {
              e.currentTarget.style.backgroundColor = '#0056b3';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !uploading) {
              e.currentTarget.style.backgroundColor = '#007bff';
            }
          }}
        >
          {uploading ? '上傳中...' : '+ 上傳圖片'}
        </button>
        {error && (
          <div style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            backgroundColor: '#fee',
            color: '#c33',
            padding: '0.75rem 1rem',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 3000,
            maxWidth: '300px'
          }}>
            {error}
          </div>
        )}
      </>
    );
  }

  // 原本的拖放模式
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed',
          borderColor: isDragActive ? '#007bff' : '#ddd',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          cursor: disabled || uploading ? 'not-allowed' : 'pointer',
          backgroundColor: isDragActive ? '#f0f8ff' : '#fafafa',
          transition: 'all 0.2s',
          opacity: disabled || uploading ? 0.6 : 1
        }}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div>
            <p style={{ color: '#666', margin: '0.5rem 0' }}>上傳中...</p>
          </div>
        ) : isDragActive ? (
          <div>
            <p style={{ color: '#007bff', fontSize: '1.125rem', fontWeight: '500', margin: '0.5rem 0' }}>
              放開以上傳圖片
            </p>
            <p style={{ color: '#666', fontSize: '0.875rem', margin: '0.5rem 0' }}>
              支援 JPEG, PNG, GIF, WebP（最大 10MB）
            </p>
          </div>
        ) : (
          <div>
            <p style={{ color: '#333', fontSize: '1.125rem', fontWeight: '500', margin: '0.5rem 0' }}>
              拖放圖片到這裡，或點擊選擇檔案
            </p>
            <p style={{ color: '#666', fontSize: '0.875rem', margin: '0.5rem 0' }}>
              支援 JPEG, PNG, GIF, WebP（最大 10MB）
            </p>
            <p style={{ color: '#999', fontSize: '0.75rem', margin: '0.5rem 0' }}>
              可一次選擇多張圖片
            </p>
          </div>
        )}
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '0.75rem',
          borderRadius: '4px',
          marginTop: '1rem'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};


