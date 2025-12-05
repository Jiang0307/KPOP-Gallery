export const Alert = ({ isOpen, message, type = 'error', onClose, duration = 3000 }) => {
  if (!isOpen) return null;

  // 如果設定了 duration，自動關閉
  if (duration > 0) {
    setTimeout(() => {
      if (onClose) onClose();
    }, duration);
  }

  const backgroundColor = type === 'error' ? '#fee' : type === 'success' ? '#d4edda' : '#fff3cd';
  const color = type === 'error' ? '#c33' : type === 'success' ? '#155724' : '#856404';
  const borderColor = type === 'error' ? '#f5c6cb' : type === 'success' ? '#c3e6cb' : '#ffeaa7';

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        backgroundColor: backgroundColor,
        color: color,
        border: `1px solid ${borderColor}`,
        borderRadius: '4px',
        padding: '0.75rem 1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        zIndex: 3000,
        maxWidth: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: color,
            cursor: 'pointer',
            fontSize: '1.25rem',
            lineHeight: '1',
            padding: '0',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

