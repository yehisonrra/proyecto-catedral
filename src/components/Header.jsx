// src/components/Header.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Header({ isOpen }) {
  const location = useLocation();
  const currentPath = location.pathname;

  let titulo = '';
  let subtitulo = '';

  // Condiciones para mostrar el título largo con salto de línea
  const rutasConTituloLargo = [
    '/fase2',
    '/fase3',
    '/fase4',
    '/banco-fotos/plan2',
    '/banco-fotos/plan2/frentes',
    '/informes',
    '/catalogo-qr/plan2',
  ];
  // Verificar también rutas que comiencen con '/banco-fotos/plan2/frente/'
  const esRutaLarga = rutasConTituloLargo.includes(currentPath) || currentPath.startsWith('/banco-fotos/plan2/frente/') || currentPath.startsWith('/fase2/frente/')  || currentPath.startsWith('/informes') || currentPath.startsWith('/catalogo-qr/plan2');

  // Asignar títulos según la ruta
  if (currentPath === '/') {
    titulo = 'PLAN DE GESTIÓN PATRIMONIAL DEL CENTRO HISTÓRICO DE MÉRIDA';
  }
  else if (currentPath === '/PlanMerida') {
    titulo = 'PLAN MÉRIDA 465';
  }
  else if (currentPath === '/plan3') {
    titulo = 'PLAN 3';
    subtitulo = 'En fase de desarrollo';
  }
  else if (currentPath === '/plan4') {
    titulo = 'PLAN 4';
    subtitulo = 'En fase de desarrollo';
  }
  else if (currentPath === '/fase1') {
    titulo = 'PLAN DE RESTAURACIÓN INTEGRAL DEL MONUMENTO NACIONAL CATEDRAL DE MÉRIDA BASILICA MENOR DE LA INMACULADA CONCEPCIÓN';
    subtitulo = 'FASE I: Vinculada al Plan Mérida 465';
  }
  else if (currentPath === '/banco-fotos') {
    titulo = 'PLAN DE GESTIÓN PATRIMONIAL DEL CENTRO HISTÓRICO DE MÉRIDA';}

    else if (currentPath === '/catalogo-qr') {
    titulo = 'PLAN DE GESTIÓN PATRIMONIAL DEL CENTRO HISTÓRICO DE MÉRIDA';}

  else if (esRutaLarga) {
    // Para todas las rutas que deben mostrar el título largo, dejamos titulo vacío y usaremos el JSX directo
    titulo = ''; // Se ignorará, usaremos el JSX especial
  }
  else {
    titulo = 'SISTEMA DE INFORMACIÓN TÉCNICA';
  }

  const headerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '4px solid #005691',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1100,
    boxSizing: 'border-box',
    fontFamily: "'Segoe UI', Roboto, sans-serif"
  };

  const logoGroupLeftStyle = { display: 'flex', alignItems: 'center', gap: '8px' };
  const logoGroupRightStyle = { display: 'flex', alignItems: 'center' };
  const titleContainerStyle = { flex: 1, padding: '0 20px', textAlign: 'center' };
  const titleStyle = { 
    color: '#000', 
    margin: 0, 
    fontSize: '1.2rem', 
    fontWeight: '800', 
    textTransform: 'uppercase', 
    lineHeight: '1.3' 
  };
  const subtitleStyle = {
    fontSize: '0.8rem',
    fontWeight: '600',
    marginTop: '4px',
    color: '#002640'
  };
  const logoStyle = { height: '55px', width: 'auto' };

  return (
    <header style={headerStyle}>
      <div style={logoGroupLeftStyle}>
        <img src="/logos/LOGO_NM.png" alt="Logo NM" style={logoStyle} />
        <img src="/logos/LOGO_GOBER.png" alt="Logo Gobernación" style={logoStyle} />
        <img src="/logos/LOGO_ULA.png" alt="Logo ULA" style={logoStyle} />
        <img src="/logos/LOGO.png" alt="Logo Proyecto" style={logoStyle} />
      </div>
      <div style={titleContainerStyle}>
        <h1 style={titleStyle}>
          {esRutaLarga ? (
            <>
              PLAN DE RESTAURACIÓN INTEGRAL DEL MONUMENTO NACIONAL CATEDRAL DE MÉRIDA
              <br />
              BASILICA MENOR DE LA INMACULADA CONCEPCIÓN
            </>
          ) : (
            titulo
          )}
        </h1>
        {subtitulo && <p style={subtitleStyle}>{subtitulo}</p>}
      </div>
      <div style={logoGroupRightStyle}>
        <img src="/logos/LOGO_CATEDRAL.png" alt="Logo Catedral" style={logoStyle} />
      </div>
    </header>
  );
}