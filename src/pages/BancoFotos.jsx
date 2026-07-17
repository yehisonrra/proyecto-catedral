// src/pages/BancoFotos.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';

export default function BancoFotos() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTiny   = useIsMobile(480);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const planes = [
    {
      id: 1,
      imagen: '/logos/banner1.jpg',
      titulo: 'PLAN MÉRIDA 465',
      ruta: '/banco-fotos/plan1'
    },
    {
      id: 2,
      imagen: '/logos/banner2.jpg',
      titulo: 'PLAN DE RESTAURACIÓN INTEGRAL DEL MONUMENTO NACIONAL CATEDRAL DE MÉRIDA BASILICA MENOR DE LA INMACULADA CONCEPCIÓN',
      ruta: '/banco-fotos/plan2'
    },
    {
      id: 3,
      imagen: '/logos/banner3.jpg',
      titulo: 'PLAN 3',
      descripcion: 'Proyecto en desarrollo',
      ruta: '/banco-fotos/plan3'
    },
    {
      id: 4,
      imagen: '/logos/banner4.jpg',
      titulo: 'PLAN 4',
      descripcion: 'Proyecto en desarrollo',
      ruta: '/banco-fotos/plan4'
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
    paddingTop: isMobile ? '20px' : '80px',
    paddingBottom: isMobile ? '20px' : '40px',
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url('/logos/FONDO.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  };

  const titleWrapperStyle = {
    textAlign: 'center',
    marginBottom: isMobile ? '20px' : '40px',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'all 0.8s cubic-bezier(0.2, 0.9, 0.4, 1.1)'
  };

  const mainTitleStyle = {
    fontSize: 'clamp(1.8rem, 6vw, 3.5rem)',
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
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: isMobile ? '20px' : '40px',
    width: '100%',
    maxWidth: '1300px',
    marginTop: isMobile ? '15px' : '30px',
    padding: '0 15px'
  };

  // Estilo base del banner con flex para distribuir contenido verticalmente
  const bannerBaseStyle = {
    position: 'relative',
    borderRadius: '28px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: isMobile ? (isTiny ? '0.9rem' : '1.1rem') : '1.4rem',
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
    padding: isMobile ? (isTiny ? '40px 15px' : '60px 20px') : '100px 30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: isMobile ? '200px' : '300px'
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

  // Estilo del contenedor del título (flexible)
  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
  };

  // Estilo del título con manejo de desbordamiento
  const titleStyle = {
    fontSize: isMobile ? (isTiny ? '0.9rem' : '1.1rem') : '1.4rem',
    fontWeight: '800',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    maxWidth: '100%',
    lineHeight: 1.3,
    marginBottom: isMobile ? '8px' : '15px'
  };

  const descripcionStyle = {
    fontSize: isMobile ? '0.7rem' : '1rem',
    fontWeight: '500',
    marginTop: '5px',
    marginBottom: isMobile ? '10px' : '20px'
  };

  const explorarStyle = {
    marginTop: 'auto', // empuja el botón hacia abajo
    fontSize: isMobile ? '0.7rem' : '0.9rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'inline-block',
    padding: '6px 20px',
    borderRadius: '40px',
    backdropFilter: 'blur(4px)',
    alignSelf: 'center',
    marginTop: isMobile ? '15px' : '25px'
  };

  return (
    <div style={containerStyle}>
      <div style={titleWrapperStyle}>
        <h1 style={mainTitleStyle}>BANCO DE FOTOS</h1>
        <div style={{
          width: '80px',
          height: '4px',
          background: '#f37021',
          margin: '15px auto',
          borderRadius: '4px'
        }} />
        <p style={{
          fontStyle: 'italic',
          color: '#1e2a3a',
          fontSize: 'clamp(0.9rem, 3vw, 1.4rem)',
          fontWeight: '600',
          marginTop: '10px',
          textShadow: '0px 1px 2px rgba(255,255,255,0.5)'
        }}>
          Galería Visual del Proyecto
        </p>
      </div>

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
            <div style={contentStyle}>
              <div style={titleStyle}>{plan.titulo}</div>
              {plan.descripcion && (
                <div style={descripcionStyle}>{plan.descripcion}</div>
              )}
              <div style={explorarStyle}>📸 EXPLORAR</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}