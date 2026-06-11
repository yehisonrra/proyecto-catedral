// src/pages/Inicio.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Inicio() {
  const navigate  = useNavigate();
  const isMobile  = useIsMobile();
  const [visible, setVisible] = useState(false);

  useEffect(() => { setVisible(true); }, []);

  const planes = [
    { id: 1, imagen: '/logos/banner1.jpg', titulo: 'PLAN MÉRIDA 465', ruta: '/PlanMerida' },
    { id: 2, imagen: '/logos/banner2.jpg', titulo: 'PLAN DE RESTAURACIÓN INTEGRAL DEL MONUMENTO NACIONAL CATEDRAL DE MÉRIDA BASILICA MENOR DE LA INMACULADA CONCEPCIÓN', ruta: '/fase1' },
    { id: 3, imagen: '/logos/banner3.jpg', titulo: 'PLAN 3', descripcion: 'Proyecto en desarrollo', ruta: '/plan3' },
    { id: 4, imagen: '/logos/banner4.jpg', titulo: 'PLAN 4', descripcion: 'Proyecto en desarrollo', ruta: '/plan4' },
  ];

  const containerStyle = {
    width              : '100%',
    flex               : 1,
    display            : 'flex',
    flexDirection      : 'column',
    alignItems         : 'center',
    justifyContent     : 'center',
    fontFamily         : "'Poppins', 'Montserrat', 'Segoe UI', sans-serif",
    paddingTop         : isMobile ? '60px' : '80px',
    paddingBottom      : '40px',
    paddingLeft        : isMobile ? '10px' : '0',
    paddingRight       : isMobile ? '10px' : '0',
    background         : `linear-gradient(rgba(255,255,255,0.4),rgba(255,255,255,0.4)),url('/logos/banner2.jpg')`,
    backgroundSize     : 'cover',
    backgroundPosition : 'center',
    backgroundAttachment: isMobile ? 'scroll' : 'fixed',
  };

  const titleWrapperStyle = {
    textAlign  : 'center',
    marginBottom: isMobile ? '30px' : '60px',
    padding    : isMobile ? '0 10px' : '0',
    opacity    : visible ? 1 : 0,
    transform  : visible ? 'translateY(0)' : 'translateY(30px)',
    transition : 'all 0.8s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
  };

  const mainTitleStyle = {
    fontSize            : isMobile ? 'clamp(1.4rem, 7vw, 2.5rem)' : 'clamp(2rem, 6vw, 4rem)',
    fontWeight          : '900',
    background          : 'linear-gradient(135deg, #2f2f2f, #4a4a4a)',
    WebkitBackgroundClip: 'text',
    backgroundClip      : 'text',
    color               : 'transparent',
    margin              : 0,
    letterSpacing       : '-1px',
  };

  const subtitleStyle = {
    fontStyle  : 'italic',
    color      : '#1e2a3a',
    fontSize   : isMobile ? 'clamp(0.8rem, 3.5vw, 1.1rem)' : 'clamp(1rem, 4vw, 1.4rem)',
    fontWeight : '600',
    marginTop  : '15px',
    textShadow : '0px 1px 2px rgba(255,255,255,0.5)',
    padding    : isMobile ? '0 5px' : '0',
  };

  const bannerBaseStyle = {
    position          : 'relative',
    padding           : isMobile ? '50px 15px' : '80px 20px',
    borderRadius      : '24px',
    textAlign         : 'center',
    cursor            : 'pointer',
    fontSize          : isMobile ? '1rem' : '1.2rem',
    fontWeight        : '700',
    color             : 'white',
    textShadow        : '1px 1px 8px rgba(0,0,0,0.6)',
    border            : 'none',
    outline           : 'none',
    boxShadow         : '0 20px 35px -10px rgba(0,0,0,0.2)',
    backgroundSize    : 'cover',
    backgroundPosition: 'center',
    transition        : 'transform 0.3s ease, box-shadow 0.3s ease',
    width             : '100%',
    boxSizing         : 'border-box',
    overflow          : 'hidden',
    whiteSpace        : 'normal',
    lineHeight        : '1.4',
  };

  const overlayStyle = {
    position    : 'absolute',
    top: 0, left: 0,
    width       : '100%',
    height      : '100%',
    background  : 'linear-gradient(135deg, rgba(38,35,35,0.2) 0%, rgba(95,86,86,0.5) 100%)',
    borderRadius: '24px',
    pointerEvents: 'none',
  };

  return (
    <div style={containerStyle}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={titleWrapperStyle}>
        <h1 style={mainTitleStyle}>SISTEMA DE INFORMACIÓN TÉCNICA</h1>
        <div style={{ width: '80px', height: '4px', background: '#f37021', margin: '20px auto 15px', borderRadius: '4px' }} />
        <p style={subtitleStyle}>"Rumbo a la inclusión de la Catedral como patrimonio de la UNESCO"</p>
      </div>

      {/* Grid: 2 columnas en escritorio, 1 en móvil */}
      <div className="inicio-grid" style={{
        display             : 'grid',
        gridTemplateColumns : isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap                 : isMobile ? '20px' : '40px',
        width               : '100%',
        maxWidth            : '1200px',
        marginTop           : '20px',
        padding             : isMobile ? '0 5px' : '0 20px',
      }}>
        {planes.map((plan) => (
          <button
            key={plan.id}
            className="banner-fase"
            style={{ ...bannerBaseStyle, backgroundImage: `url(${plan.imagen})` }}
            onClick={() => navigate(plan.ruta)}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 30px 45px -12px rgba(0,0,0,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 20px 35px -10px rgba(0,0,0,0.2)';
              }
            }}
          >
            <div style={overlayStyle} />
            <div style={{ position: 'relative', zIndex: 2, fontWeight: '800' }}>
              {plan.titulo}
              {plan.descripcion && (
                <p style={{ fontSize: '0.9rem', marginTop: '10px', fontWeight: 'normal' }}>{plan.descripcion}</p>
              )}
            </div>
            <div style={{ position: 'relative', zIndex: 2, marginTop: '20px', fontSize: '0.85rem', opacity: 0.9, letterSpacing: '1px' }}>
              ── explorar ──
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .banner-fase { transition: transform 0.3s ease, box-shadow 0.3s ease; border: none !important; outline: none !important; }
        .banner-fase:focus { outline: none; }
      `}</style>
    </div>
  );
}
