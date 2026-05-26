// src/pages/Inicio.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Inicio() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    setVisible(true);
  }, []);

  // Datos de los 4 planes (antes fases)
  const planes = [
    { 
      id: 1,
      imagen: '/logos/banner1.jpg',
      titulo: 'PLAN MÉRIDA 465',
      ruta: '/PlanMerida'
    },
    { 
      id: 2,
      imagen: '/logos/banner2.jpg',
      titulo: 'PLAN DE RESTAURACIÓN INTEGRAL DEL MONUMENTO NACIONAL CATEDRAL DE MÉRIDA BASILICA MENOR DE LA INMACULADA CONCEPCIÓN',
      ruta: '/fase1'
    },
    { 
      id: 3,
      imagen: '/logos/banner3.jpg',
      titulo: 'PLAN 3',
      descripcion: 'Proyecto en desarrollo',
      ruta: '/plan3'
    },
    { 
      id: 4,
      imagen: '/logos/banner4.jpg',
      titulo: 'PLAN 4',
      descripcion: 'Proyecto en desarrollo',
      ruta: '/plan4'
    }
  ];

  const containerStyle = {
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Poppins', 'Montserrat', 'Segoe UI', sans-serif",
    paddingTop: '80px',
    paddingBottom: '40px',
    background: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url('/logos/banner2.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  const titleWrapperStyle = {
    textAlign: 'center',
    marginBottom: '60px',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'all 0.8s cubic-bezier(0.2, 0.9, 0.4, 1.1)'
  };

  const mainTitleStyle = {
    fontSize: 'clamp(2rem, 6vw, 4rem)',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #2f2f2f, #4a4a4a)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    margin: 0,
    letterSpacing: '-1px'
  };

  const subtitleStyle = {
    fontStyle: 'italic',
    color: '#1e2a3a',
    fontSize: 'clamp(1rem, 4vw, 1.4rem)',
    fontWeight: '600',
    marginTop: '15px',
    textShadow: '0px 1px 2px rgba(255,255,255,0.5)'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '40px',
    width: '100%',
    maxWidth: '1200px',
    marginTop: '20px',
    padding: '0 20px'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(38, 35, 35, 0.2) 0%, rgba(95, 86, 86, 0.5) 100%)',
    borderRadius: '24px',
    transition: 'all 0.3s ease',
    pointerEvents: 'none'
  };

  const bannerBaseStyle = {
    position: 'relative',
    padding: '80px 20px',
    borderRadius: '24px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'white',
    textShadow: '1px 1px 8px rgba(0,0,0,0.6)',
    border: 'none',
    outline: 'none',
    boxShadow: '0 20px 35px -10px rgba(0,0,0,0.2)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden'
  };

  return (
    <div style={containerStyle}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      
      <div style={titleWrapperStyle}>
        <h1 style={mainTitleStyle}>SISTEMA DE INFORMACIÓN TÉCNICA</h1>
        <div style={{
          width: '80px',
          height: '4px',
          background: '#f37021',
          margin: '20px auto 15px',
          borderRadius: '4px'
        }} />
        <p style={subtitleStyle}>
          "Rumbo a la inclusión de la Catedral como patrimonio de la UNESCO"
        </p>
      </div>

      <div style={gridStyle}>
        {planes.map((plan) => (
          <button
            key={plan.id}
            className="banner-fase"
            style={{
              ...bannerBaseStyle,
              backgroundImage: `url(${plan.imagen})`,
              fontSize: '1.2rem',
              whiteSpace: 'normal',
              lineHeight: '1.4'
            }}
            onClick={() => navigate(plan.ruta)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 30px 45px -12px rgba(0,0,0,0.3)';
              e.currentTarget.style.backgroundSize = '110%';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 20px 35px -10px rgba(0,0,0,0.2)';
              e.currentTarget.style.backgroundSize = 'cover';
            }}
          >
            <div style={overlayStyle} />
            <div style={{ position: 'relative', zIndex: 2, fontWeight: '800' }}>
              {plan.titulo}
              <p style={{ fontSize: '0.9rem', marginTop: '10px', fontWeight: 'normal' }}>{plan.descripcion}</p>
            </div>
            <div style={{
              position: 'relative',
              zIndex: 2,
              marginTop: '20px',
              fontSize: '0.85rem',
              opacity: 0.9,
              letterSpacing: '1px'
            }}>
              ── explorar ──
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .banner-fase {
          transition: transform 0.3s ease, box-shadow 0.3s ease, background-size 0.3s ease;
          border: none !important;
          outline: none !important;
        }
        .banner-fase:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}