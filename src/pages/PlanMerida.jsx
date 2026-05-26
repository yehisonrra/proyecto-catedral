// src/pages/PlanMerida.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlanMerida() {
  const navigate = useNavigate();

  const containerStyle = {
    background: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url('/logos/banner1.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    flex: 1,
    padding: '30px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#002640',
    backgroundColor: 'rgba(255,255,255,0.8)',
    display: 'inline-block',
    padding: '20px 40px',
    borderRadius: '20px',
    marginBottom: '30px'
  };

  const messageStyle = {
    fontSize: '1.2rem',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: '20px',
    borderRadius: '15px',
    maxWidth: '600px',
    marginBottom: '30px'
  };

  const buttonStyle = {
    backgroundColor: '#f37021',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.2s'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>PLAN MÉRIDA 465</h1>
      <div style={messageStyle}>
        <p>Este plan se encuentra en fase de desarrollo.</p>
      </div>
      <button 
        style={buttonStyle}
        onClick={() => navigate('/fase1')}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d95e0e'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f37021'}
      >
        Ver Fase 1 del Plan Catedral (Vinculada)
      </button>
    </div>
  );
}