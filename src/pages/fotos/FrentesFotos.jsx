// src/pages/fotos/FrentesFotos.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import { datosFase2 } from '../fases/Fase2';

export default function FrentesFotos() {
  const navigate = useNavigate();

  const containerStyle = {
    background: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url('/logos/FONDO.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    flex: 1,
    padding: '30px',
    boxSizing: 'border-box',
    minHeight: 'calc(100vh - 80px)'
  };

  const titleStyle = {
    fontSize: '2.2rem',
    fontWeight: 'bold',
    color: '#002855',
    textAlign: 'center',
    marginBottom: '10px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '25px',
    marginTop: '40px',
    maxWidth: '1400px',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    textAlign: 'center'
  };

  const imgPlaceholder = {
    height: '160px',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  const infoStyle = {
    padding: '15px'
  };

  const buttonStyle = {
    backgroundColor: '#f37021',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '30px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background 0.2s'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>FASE II</h1>
      <SearchBar />
      
      {/* Contenedor para centrar el subtítulo */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <div style={{
          fontSize: '1rem',
          color: '#002640',
          fontWeight: 'bold',
          backgroundColor: 'rgba(255,255,255,0.9)',
          display: 'inline-block',
          padding: '8px 25px',
          borderRadius: '30px',
          textShadow: '0px 1px 2px rgba(255,255,255,0.5)'
        }}>
          SELECCIÓN DE FRENTES DE TRABAJO (30 frentes)
        </div>
      </div>

      <div style={gridStyle}>
        {datosFase2.map((frente) => (
          <div
            key={frente.id}
            style={cardStyle}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'; }}
          >
            <div style={{ ...imgPlaceholder, backgroundImage: `url(${frente.imagen})`, backgroundSize: 'cover' }} />
            <div style={infoStyle}>
              <h4 style={{ color: '#f37021', margin: '0 0 5px' }}>FRENTE #{frente.id.toString().padStart(2, '0')}</h4>
              <p style={{ fontWeight: 'bold', color: '#002640', fontSize: '0.9rem' }}>{frente.nombre}</p>
              <button
                style={buttonStyle}
                onClick={() => navigate(`/banco-fotos/plan2/frente/${frente.id}`)}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d95e0e'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f37021'}
              >
                📸 Ver Fotos
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}