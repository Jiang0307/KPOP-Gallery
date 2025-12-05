import { useState, useEffect } from 'react';

export const StarForm = ({ star, onSubmit, onCancel }) => {
  const [name, setName] = useState(star?.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (star) {
      setName(star.name);
    }
  }, [star]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (star) {
        await onSubmit({ name });
      } else {
        await onSubmit({ name });
      }
      setName('');
    } catch (err) {
      setError(err.response?.data?.detail || '操作失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem'
      }}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '500px'
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '1rem', fontWeight: 'bold', color: '#000' }}>
          {star ? '編輯明星' : '新增明星'}
        </h3>
        
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '0.75rem',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#000' }}>
            明星名字
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="例如：WINTER、RYUJIN"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-start' }}>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#5dade2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading || !name.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !name.trim() ? 0.6 : 1
            }}
          >
            {loading ? '處理中...' : (star ? '更新' : '新增')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
};


