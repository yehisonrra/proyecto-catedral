// src/pages/CatalogoQR.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

export default function CatalogoQR() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const planes = [
    {
      id: 1,
      imagen: '/logos/banner1.jpg',
      titulo: 'PLAN MÉRIDA 465',
      ruta: '/catalogo-qr/plan1'
    },
    {
      id: 2,
      imagen: '/logos/banner2.jpg',
      titulo: 'PLAN DE RESTAURACIÓN INTEGRAL DEL MONUMENTO NACIONAL CATEDRAL DE MÉRIDA BASILICA MENOR DE LA INMACULADA CONCEPCIÓN',
      ruta: '/catalogo-qr/plan2'
    },
    {
      id: 3,
      imagen: '/logos/banner3.jpg',
      titulo: 'PLAN 3',
      descripcion: 'Proyecto en desarrollo',
      ruta: '/catalogo-qr/plan3'
    },
    {
      id: 4,
      imagen: '/logos/banner4.jpg',
      titulo: 'PLAN 4',
      descripcion: 'Proyecto en desarrollo',
      ruta: '/catalogo-qr/plan4'
    }
  ];

  const containerStyle = {
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Poppins', 'Montserrat', sans-serif",
    paddingTop: '80px',
    paddingBottom: '40px',
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url('/logos/FONDO.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  };

  const titleWrapperStyle = {
    textAlign: 'center',
    marginBottom: '40px',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'all 0.8s cubic-bezier(0.2, 0.9, 0.4, 1.1)'
  };

  const mainTitleStyle = {
    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #2f2f2f, #4a4a4a)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    margin: 0,
    letterSpacing: '-1px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '40px',
    width: '100%',
    maxWidth: '1300px',
    marginTop: '30px',
    padding: '0 20px'
  };

  const bannerBaseStyle = {
    position: 'relative',
    borderRadius: '28px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'white',
    textShadow: '2px 2px 12px rgba(0,0,0,0.5)',
    border: 'none',
    outline: 'none',
    boxShadow: '0 20px 35px -12px rgba(0,0,0,0.3)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1), box-shadow 0.3s',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    padding: '100px 30px'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
    borderRadius: '28px',
    transition: 'all 0.3s ease',
    pointerEvents: 'none'
  };

  return (
    <div style={containerStyle}>
      <div style={titleWrapperStyle}>
        <h1 style={mainTitleStyle}>CATÁLOGO DE QRs</h1>
        <div style={{
          width: '100px',
          height: '5px',
          background: '#f37021',
          margin: '20px auto',
          borderRadius: '5px'
        }} />
        <p style={{ fontStyle: 'italic', color: '#1e2a3a', fontSize: 'clamp(1rem, 4vw, 1.4rem)', fontWeight: '600', marginTop: '15px', textShadow: '0px 1px 2px rgba(255,255,255,0.5)' }}>
          Accede a los códigos QR de cada frente de trabajo
        </p>
      </div>

      <SearchBar />

      <div style={gridStyle}>
        {planes.map((plan) => (
          <button
            key={plan.id}
            style={{
              ...bannerBaseStyle,
              backgroundImage: `url(${plan.imagen})`,
            }}
            onClick={() => navigate(plan.ruta)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 30px 45px -15px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 20px 35px -12px rgba(0,0,0,0.3)';
            }}
          >
            <div style={overlayStyle} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              {plan.titulo}
              <p style={{ fontSize: '1rem', marginTop: '12px', fontWeight: '500' }}>{plan.descripcion}</p>
              <div style={{
                marginTop: '25px',
                fontSize: '0.9rem',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'inline-block',
                padding: '8px 20px',
                borderRadius: '40px',
                backdropFilter: 'blur(4px)'
              }}>
                📱 Ver QRs
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}