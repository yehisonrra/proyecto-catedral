// src/pages/fotos/FrentesFotos.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import { datosFase2 } from '../fases/Fase2';

export default function FrentesFotos() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTiny   = useIsMobile(480);

  const containerStyle = {
    background: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url('/logos/FONDO.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    flex: 1,
    padding: isMobile ? '15px' : '30px',
    boxSizing: 'border-box',
    minHeight: 'calc(100vh - 80px)'
  };

  const titleStyle = {
    fontSize: isMobile ? (isTiny ? '1.5rem' : '1.8rem') : '2.2rem',
    fontWeight: 'bold',
    color: '#002855',
    textAlign: 'center',
    marginBottom: isMobile ? '5px' : '10px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(140px, 1fr))' : 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: isMobile ? '15px' : '25px',
    marginTop: isMobile ? '20px' : '40px',
    maxWidth: '1400px',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: isMobile ? '14px' : '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    textAlign: 'center'
  };

  const imgPlaceholder = {
    height: isMobile ? '120px' : '160px',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  const infoStyle = {
    padding: isMobile ? '10px' : '15px'
  };

  const buttonStyle = {
    backgroundColor: '#f37021',
    color: 'white',
    border: 'none',
    padding: isMobile ? '5px 12px' : '8px 16px',
    borderRadius: '30px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
    fontSize: isMobile ? '0.7rem' : '0.9rem',
    transition: 'background 0.2s'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>FASE II</h1>

      <div style={{ textAlign: 'center', marginTop: isMobile ? '5px' : '10px' }}>
        <div style={{
          fontSize: isMobile ? '0.7rem' : '1rem',
          color: '#002640',
          fontWeight: 'bold',
          backgroundColor: 'rgba(255,255,255,0.9)',
          display: 'inline-block',
          padding: isMobile ? '4px 12px' : '8px 25px',
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
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(0,0,0,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
          >
            <div style={{ ...imgPlaceholder, backgroundImage: `url(${frente.imagen})`, backgroundSize: 'cover' }} />
            <div style={infoStyle}>
              <h4 style={{ color: '#f37021', margin: '0 0 4px', fontSize: isMobile ? '0.7rem' : '0.9rem' }}>
                FRENTE #{frente.id.toString().padStart(2, '0')}
              </h4>
              <p style={{ fontWeight: 'bold', color: '#002640', fontSize: isMobile ? '0.75rem' : '0.9rem', margin: '0 0 6px' }}>
                {frente.nombre}
              </p>
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