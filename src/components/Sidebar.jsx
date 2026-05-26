import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useInformes } from '../context/InformesContext';

export default function Sidebar({ isOpen, toggle }) {
  // Se eliminan setVistaActual y vistaActual porque ahora se usa useLocation
  const location = useLocation();
  const [isRecorridosOpen, setIsRecorridosOpen] = useState(false);
  const [isUtilitariosOpen, setIsUtilitariosOpen] = useState(false);
  const { conteos } = useInformes();

  // Estilos (todo igual que antes)
  const sidebarStyle = {
    position: 'fixed',
    top: '80px',
    left: 0,
    height: 'calc(100vh - 80px)',
    backgroundColor: 'rgba(0, 58, 99, 0.85)',
    overflowX: 'hidden',
    transition: '0.3s ease',
    zIndex: 1100,
    width: '280px',
    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
  };

  const btnToggleStyle = {
    position: 'fixed',
    top: '95px',
    left: isOpen ? '290px' : '20px',
    zIndex: 1200,
    backgroundColor: '#005691',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: '0.3s ease',
  };

  const menuItemWrapper = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderRadius: '8px',
    textDecoration: 'none',
    marginBottom: '4px'
  };

  const linkStyle = { color: 'white', textDecoration: 'none', fontSize: '0.9rem' };
  const badgeStyle = { backgroundColor: '#f37021', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem' };

  const subMenuListStyle = {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '20px',
    marginTop: '2px',
    gap: '2px'
  };

  const subLinkStyle = { ...linkStyle, fontSize: '0.8rem', opacity: 0.8 };
  const subBadgeStyle = { ...badgeStyle, fontSize: '0.65rem', padding: '1px 6px' };

  // Helper para saber si una ruta está activa
  const isActive = (path) => location.pathname === path;
  return (
    <>
      <button style={btnToggleStyle} onClick={toggle}>
        {isOpen ? '✕' : '☰'}
      </button>

      <aside style={sidebarStyle}>
        <div style={{ width: '280px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '5px', boxSizing: 'border-box', height: '100%' }}>
          
          {/* Inicio */}
          <div style={{...menuItemWrapper, backgroundColor: isActive('/') ? 'rgba(255,255,255,0.15)' : 'transparent'}}>
            <Link to="/" style={linkStyle}>🏠 Inicio / Principal</Link>
          </div>

          {/* Informes Directos */}
<div style={{...menuItemWrapper, backgroundColor: isActive('/informes/especiales') ? 'rgba(255,255,255,0.15)' : 'transparent'}}>
  <Link to="/informes/especiales" style={linkStyle}>📂 Informes Especiales</Link>
  <span style={badgeStyle}>{conteos?.especiales || 0}</span>
</div>

<div style={{...menuItemWrapper, backgroundColor: isActive('/informes/divulgacion') ? 'rgba(255,255,255,0.15)' : 'transparent'}}>
  <Link to="/informes/divulgacion" style={linkStyle}>📂 Informes de Divulgación</Link>
  <span style={badgeStyle}>{conteos?.divulgacion || 0}</span>
</div>

<div style={{...menuItemWrapper, backgroundColor: isActive('/informes/avance') ? 'rgba(255,255,255,0.15)' : 'transparent'}}>
  <Link to="/informes/avance" style={linkStyle}>📂 Avance de Obra</Link>
  <span style={badgeStyle}>{conteos?.avance || 0}</span>
</div>

{/* Recorridos (submenú) */}
<div style={{ cursor: 'pointer' }}>
  <div style={menuItemWrapper} onClick={() => setIsRecorridosOpen(!isRecorridosOpen)}>
    <span style={linkStyle}>📂 Inf. de Recorridos {isRecorridosOpen ? '▲' : '▼'}</span>
    <span style={badgeStyle}>{conteos?.recorridos?.total || 0}</span>
  </div>
  {isRecorridosOpen && (
    <div style={subMenuListStyle}>
      <div style={menuItemWrapper}>
        <Link to="/informes/recorridos/academicos" style={subLinkStyle}>• Académicos</Link>
        <span style={subBadgeStyle}>{conteos?.recorridos?.academicos || 0}</span>
      </div>
      <div style={menuItemWrapper}>
        <Link to="/informes/recorridos/institucionales" style={subLinkStyle}>• Institucionales</Link>
        <span style={subBadgeStyle}>{conteos?.recorridos?.institucionales || 0}</span>
      </div>
      <div style={menuItemWrapper}>
        <Link to="/informes/recorridos/tecnico-politico" style={subLinkStyle}>• Técnico-Político</Link>
        <span style={subBadgeStyle}>{conteos?.recorridos?.tecnicoPolitico || 0}</span>
      </div>
    </div>
  )}
</div>

{/* Utilitarios (submenú) */}
<div style={{ cursor: 'pointer' }}>
  <div style={menuItemWrapper} onClick={() => setIsUtilitariosOpen(!isUtilitariosOpen)}>
    <span style={linkStyle}>📂 Inf. Utilitarios {isUtilitariosOpen ? '▲' : '▼'}</span>
    <span style={badgeStyle}>{conteos?.utilitarios?.total || 0}</span>
  </div>
  {isUtilitariosOpen && (
    <div style={subMenuListStyle}>
      <div style={menuItemWrapper}>
        <Link to="/informes/utilitarios/inicial" style={subLinkStyle}>• Inicial</Link>
        <span style={subBadgeStyle}>{conteos?.utilitarios?.inicial || 0}</span>
      </div>
      <div style={menuItemWrapper}>
        <Link to="/informes/utilitarios/frente-secundario" style={subLinkStyle}>• Fte. Secundario</Link>
        <span style={subBadgeStyle}>{conteos?.utilitarios?.frenteSecundario || 0}</span>
      </div>
    </div>
  )}
</div>

{/* Banco de Fotos */}
<div style={{...menuItemWrapper, marginTop: '10px', backgroundColor: isActive('/banco-fotos') ? '#005691' : 'transparent'}}>
  <Link to="/banco-fotos" style={linkStyle}>🖼️ Banco de Fotos</Link>
</div>

{/* Catálogo de QRs */}
<div style={{...menuItemWrapper, marginTop: '10px', backgroundColor: isActive('/catalogo-qr') ? '#005691' : 'transparent'}}>
  <Link to="/catalogo-qr" style={linkStyle}>📱 Catálogo de QRs</Link>
</div>

          <div style={{ flex: 1 }}></div>

          {/* Footer Social (Instagram) */}
          <div style={{ 
            paddingTop: '15px',
            paddingBottom: '20px', 
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', margin: 0, letterSpacing: '1px', fontWeight: 'bold' }}>
              ¡SÍGUENOS EN INSTAGRAM!
            </p>
            <a 
              href="https://www.instagram.com/catedralmeridarestauracion" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                color: '#fff', 
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: '500'
              }}
            >
              <img src="/logos/LOGO_INSTAGRAM.png" alt="Instagram" style={{ width: '35px', height: '35px' }} />
              <span>@catedralmeridarestauracion</span>
            </a>
          </div>
        </div> 
      </aside> 
    </>
  );
}