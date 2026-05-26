// src/components/SearchBar.jsx
import React from 'react';

const searchContainerStyle = {
  marginBottom: '30px',
  display: 'flex',
  justifyContent: 'center'
};

const searchInputStyle = {
  width: '100%',
  maxWidth: '500px',
  padding: '12px 20px',
  borderRadius: '40px',
  border: 'none',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  fontSize: '1rem',
  outline: 'none',
  backgroundColor: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(5px)',
  transition: 'all 0.3s'
};

export default function SearchBar({ placeholder, onSearch, disabled = false }) {
  const [value, setValue] = React.useState('');

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onSearch) onSearch(newValue);
  };

  return (
    <div style={searchContainerStyle}>
      <input
        type="text"
        placeholder={placeholder || "🔍 Buscar..."}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        style={{
          ...searchInputStyle,
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'text'
        }}
        onFocus={e => e.target.style.boxShadow = '0 2px 15px rgba(243,112,33,0.3)'}
        onBlur={e => e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)'}
      />
    </div>
  );
}