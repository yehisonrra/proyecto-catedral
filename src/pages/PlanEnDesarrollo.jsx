// src/pages/PlanEnDesarrollo.jsx
import React from 'react';

export default function PlanEnDesarrollo({ titulo, imagenFondo }) {
  const containerStyle = {
    background: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url(${imagenFondo})`,
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
    maxWidth: '600px'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{titulo}</h1>
      <div style={messageStyle}>
        <p>Este plan se encuentra en fase de desarrollo.</p>
      </div>
    </div>
  );
}