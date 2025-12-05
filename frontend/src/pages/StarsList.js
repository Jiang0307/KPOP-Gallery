import { useState, useEffect } from 'react';
import { starsService } from '../services/stars';
import { StarCard } from '../components/StarCard';
import { StarForm } from '../components/StarForm';
import { Alert } from '../components/Alert';

export const StarsList = () => {
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingStar, setEditingStar] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // 載入明星列表
  const loadStars = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await starsService.getStars();
      setStars(data);
    } catch (err) {
      console.error('載入明星列表失敗:', err);
      if (err.response) {
        // 服務器有回應
        setError(err.response?.data?.detail || `載入失敗: ${err.response.status}`);
      } else if (err.request) {
        // 請求已發送但沒有回應
        setError('無法連接到後端服務器，請確認後端是否在運行');
      } else {
        // 其他錯誤
        setError(err.message || '載入失敗');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStars();
  }, []);

  // 新增明星
  const handleCreateStar = async (starData) => {
    try {
      const newStar = await starsService.createStar(starData);
      setStars([newStar, ...stars]);
      setShowForm(false);
    } catch (err) {
      throw err;
    }
  };

  // 更新明星
  const handleUpdateStar = async (starData) => {
    if (!editingStar) return;
    try {
      const updatedStar = await starsService.updateStar(editingStar.id, starData);
      setStars(stars.map(s => s.id === editingStar.id ? updatedStar : s));
      setEditingStar(null);
      setShowForm(false);
    } catch (err) {
      throw err;
    }
  };

  // 刪除明星
  const handleDeleteStar = async (starId) => {
    try {
      await starsService.deleteStar(starId);
      setStars(stars.filter(s => s.id !== starId));
    } catch (err) {
      setAlertMessage(err.response?.data?.detail || '刪除失敗');
      setShowAlert(true);
    }
  };

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
        <h1 style={{ margin: 0, color: '#333' }}> KPOP Gallery</h1>
        {!showForm && !editingStar && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            + 新增明星
          </button>
        )}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 新增/編輯表單 Modal */}
        {(showForm || editingStar) && (
          <StarForm
            star={editingStar || undefined}
            onSubmit={editingStar ? handleUpdateStar : handleCreateStar}
            onCancel={() => {
              setShowForm(false);
              setEditingStar(null);
            }}
          />
        )}

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

        {/* 載入中 */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            載入中...
          </div>
        )}

        {/* 明星列表 */}
        {!loading && stars.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            color: '#666'
          }}>
            還沒有明星，快來新增一個吧！
          </div>
        )}

        {/* 明星網格 */}
        {!loading && stars.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {stars.map(star => (
              <StarCard
                key={star.id}
                star={star}
                onDelete={handleDeleteStar}
              />
            ))}
          </div>
        )}
      </div>

      <Alert
        isOpen={showAlert}
        message={alertMessage}
        type="error"
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
};


