// src/components/GlobalSearchBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const searchContainerStyle = {
  marginTop: '20px',        // separación del header
  marginBottom: '0px',
  display: 'flex',
  justifyContent: 'center',
};

const searchInputStyle = {
  width: '100%',
  maxWidth: '600px',        // un poco más ancho
  padding: '12px 24px',
  borderRadius: '50px',
  border: 'none',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  fontSize: '1rem',
  outline: 'none',
  backgroundColor: 'white', // fondo sólido blanco
  color: '#333',
  transition: 'all 0.3s'
};

export default function GlobalSearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={searchContainerStyle}>
      <input
        type="text"
        placeholder="🔍 Busqueda Inteligente (informes, frentes, imágenes...)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={searchInputStyle}
        onFocus={e => e.target.style.boxShadow = '0 4px 16px rgba(243,112,33,0.3)'}
        onBlur={e => e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'}
      />
    </form>
  );
}