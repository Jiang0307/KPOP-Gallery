import { useState, useEffect } from 'react';

export const SearchBar = ({ onSearch, placeholder = '搜尋...' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce 搜尋
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // 300ms 延遲

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '0.75rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '1rem'
        }}
      />
    </div>
  );
};


