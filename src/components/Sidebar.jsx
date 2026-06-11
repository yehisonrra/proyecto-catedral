// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useInformes } from '../context/InformesContext';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Sidebar({ isOpen, toggle }) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isRecorridosOpen,  setIsRecorridosOpen]  = useState(false);
  const [isUtilitariosOpen, setIsUtilitariosOpen] = useState(false);
  const { conteos } = useInformes();

  // En móvil el header mide ~50px; en escritorio ~80px
  const topOffset = isMobile ? '50px' : '80px';

  const sidebarStyle = {
    position       : 'fixed',
    top            : topOffset,
    left           : 0,
    height         : `calc(100vh - ${topOffset})`,
    backgroundColor: 'rgba(0, 58, 99, 0.95)',
    overflowX      : 'hidden',
    overflowY      : 'auto',
    transition     : '0.3s ease',
    zIndex         : 1100,
    width          : isMobile ? '80%' : '280px',
    maxWidth       : '280px',
    transform      : isOpen ? 'translateX(0)' : 'translateX(-100%)',
  };

  const btnToggleStyle = {
    position       : 'fixed',
    top            : isMobile ? '56px' : '95px',
    left           : isOpen ? (isMobile ? 'calc(80% + 10px)' : '290px') : '10px',
    zIndex         : 1200,
    backgroundColor: '#005691',
    color          : 'white',
    border         : 'none',
    padding        : isMobile ? '8px' : '10px',
    borderRadius   : '5px',
    cursor         : 'pointer',
    transition     : '0.3s ease',
    fontSize       : isMobile ? '0.85rem' : '1rem',
  };

  const menuItemWrapper = {
    display       : 'flex',
    justifyContent: 'space-between',
    alignItems    : 'center',
    padding       : '10px',
    borderRadius  : '8px',
    textDecoration: 'none',
    marginBottom  : '4px',
  };

  const linkStyle     = { color: 'white', textDecoration: 'none', fontSize: '0.9rem' };
  const badgeStyle    = { backgroundColor: '#f37021', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem' };
  const subMenuListStyle = { display: 'flex', flexDirection: 'column', paddingLeft: '20px', marginTop: '2px', gap: '2px' };
  const subLinkStyle  = { ...linkStyle, fontSize: '0.8rem', opacity: 0.8 };
  const subBadgeStyle = { ...badgeStyle, fontSize: '0.65rem', padding: '1px 6px' };

  const isActive = (path) => location.pathname === path;

  // Al hacer clic en un enlace en móvil, cierra el sidebar
  const handleLinkClick = () => { if (isMobile) toggle(); };

  return (
    <>
      <button style={btnToggleStyle} onClick={toggle}>
        {isOpen ? '✕' : '☰'}
      </button>

      <aside style={sidebarStyle}>
        <div style={{ width: '100%', padding: '15px', display: 'flex', flexDirection: 'column', gap: '5px', boxSizing: 'border-box', height: '100%' }}>

          <div style={{ ...menuItemWrapper, backgroundColor: isActive('/') ? 'rgba(255,255,255,0.15)' : 'transparent' }}>
            <Link to="/" style={linkStyle} onClick={handleLinkClick}>🏠 Inicio / Principal</Link>
          </div>

          <div style={{ ...menuItemWrapper, backgroundColor: isActive('/informes/especiales') ? 'rgba(255,255,255,0.15)' : 'transparent' }}>
            <Link to="/informes/especiales" style={linkStyle} onClick={handleLinkClick}>📂 Informes Especiales</Link>
            <span style={badgeStyle}>{conteos?.especiales || 0}</span>
          </div>

          <div style={{ ...menuItemWrapper, backgroundColor: isActive('/informes/divulgacion') ? 'rgba(255,255,255,0.15)' : 'transparent' }}>
            <Link to="/informes/divulgacion" style={linkStyle} onClick={handleLinkClick}>📂 Informes de Divulgación</Link>
            <span style={badgeStyle}>{conteos?.divulgacion || 0}</span>
          </div>

          <div style={{ ...menuItemWrapper, backgroundColor: isActive('/informes/avance') ? 'rgba(255,255,255,0.15)' : 'transparent' }}>
            <Link to="/informes/avance" style={linkStyle} onClick={handleLinkClick}>📂 Avance de Obra</Link>
            <span style={badgeStyle}>{conteos?.avance || 0}</span>
          </div>

          {/* Recorridos */}
          <div style={{ cursor: 'pointer' }}>
            <div style={menuItemWrapper} onClick={() => setIsRecorridosOpen(!isRecorridosOpen)}>
              <span style={linkStyle}>📂 Inf. de Recorridos {isRecorridosOpen ? '▲' : '▼'}</span>
              <span style={badgeStyle}>{conteos?.recorridos?.total || 0}</span>
            </div>
            {isRecorridosOpen && (
              <div style={subMenuListStyle}>
                <div style={menuItemWrapper}>
                  <Link to="/informes/recorridos/academicos" style={subLinkStyle} onClick={handleLinkClick}>• Académicos</Link>
                  <span style={subBadgeStyle}>{conteos?.recorridos?.academicos || 0}</span>
                </div>
                <div style={menuItemWrapper}>
                  <Link to="/informes/recorridos/institucionales" style={subLinkStyle} onClick={handleLinkClick}>• Institucionales</Link>
                  <span style={subBadgeStyle}>{conteos?.recorridos?.institucionales || 0}</span>
                </div>
                <div style={menuItemWrapper}>
                  <Link to="/informes/recorridos/tecnico-politico" style={subLinkStyle} onClick={handleLinkClick}>• Técnico-Político</Link>
                  <span style={subBadgeStyle}>{conteos?.recorridos?.tecnicoPolitico || 0}</span>
                </div>
              </div>
            )}
          </div>

          {/* Utilitarios */}
          <div style={{ cursor: 'pointer' }}>
            <div style={menuItemWrapper} onClick={() => setIsUtilitariosOpen(!isUtilitariosOpen)}>
              <span style={linkStyle}>📂 Inf. Utilitarios {isUtilitariosOpen ? '▲' : '▼'}</span>
              <span style={badgeStyle}>{conteos?.utilitarios?.total || 0}</span>
            </div>
            {isUtilitariosOpen && (
              <div style={subMenuListStyle}>
                <div style={menuItemWrapper}>
                  <Link to="/informes/utilitarios/inicial" style={subLinkStyle} onClick={handleLinkClick}>• Inicial</Link>
                  <span style={subBadgeStyle}>{conteos?.utilitarios?.inicial || 0}</span>
                </div>
                <div style={menuItemWrapper}>
                  <Link to="/informes/utilitarios/frente-secundario" style={subLinkStyle} onClick={handleLinkClick}>• Fte. Secundario</Link>
                  <span style={subBadgeStyle}>{conteos?.utilitarios?.frenteSecundario || 0}</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ ...menuItemWrapper, marginTop: '10px', backgroundColor: isActive('/banco-fotos') ? '#005691' : 'transparent' }}>
            <Link to="/banco-fotos" style={linkStyle} onClick={handleLinkClick}>🖼️ Banco de Fotos</Link>
          </div>

          <div style={{ ...menuItemWrapper, marginTop: '10px', backgroundColor: isActive('/catalogo-qr') ? '#005691' : 'transparent' }}>
            <Link to="/catalogo-qr" style={linkStyle} onClick={handleLinkClick}>📱 Catálogo de QRs</Link>
          </div>

          <div style={{ flex: 1 }} />

          {/* Instagram */}
          <div style={{ paddingTop: '15px', paddingBottom: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', margin: 0, letterSpacing: '1px', fontWeight: 'bold' }}>
              ¡SÍGUENOS EN INSTAGRAM!
            </p>
            <a href="https://www.instagram.com/catedralmeridarestauracion" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '500' }}>
              <img src="/logos/LOGO_INSTAGRAM.png" alt="Instagram" style={{ width: '35px', height: '35px' }} />
              <span>@catedralmeridarestauracion</span>
            </a>
          </div>

        </div>
      </aside>
    </>
  );
}
