import { useEffect, useRef } from 'react';
import { ImageCard } from './ImageCard';

export const ImageGallery = ({
  images,
  onLoadMore,
  hasMore,
  loading,
  onImageClick,
  onImageDelete
}) => {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 當觸發點進入視窗時，載入更多
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // 提前 100px 開始載入，讓體驗更流暢
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, onLoadMore]);

  return (
    <div style={{
      minHeight: '400px', // 確保有足夠高度顯示滾動條
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {images.map(image => (
          <ImageCard
            key={image.id}
            image={image}
            onClick={() => onImageClick(image)}
            onDelete={onImageDelete}
          />
        ))}
      </div>

      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#666' 
        }}>
          載入中...
        </div>
      )}

      {/* 滾動觸發點 - 當滾動到這裡時自動載入更多 */}
      {hasMore && !loading && (
        <div 
          ref={observerTarget} 
          style={{ 
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '0.875rem'
          }}
        >
          滾動載入更多...
        </div>
      )}

      {!hasMore && images.length > 0 && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#999',
          fontSize: '0.875rem'
        }}>
          已載入所有圖片
        </div>
      )}
    </div>
  );
};


