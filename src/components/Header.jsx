// src/components/Header.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Header({ isOpen }) {
  const location    = useLocation();
  const currentPath = location.pathname;
  const isMobile    = useIsMobile();       // true si pantalla ≤ 768px
  const isTiny      = useIsMobile(480);    // true si pantalla ≤ 480px

  let titulo    = '';
  let subtitulo = '';

  const rutasConTituloLargo = [
    '/fase2', '/fase3', '/fase4',
    '/banco-fotos/plan2', '/banco-fotos/plan2/frentes',
    '/informes', '/catalogo-qr/plan2',
  ];
  const esRutaLarga =
    rutasConTituloLargo.includes(currentPath) ||
    currentPath.startsWith('/banco-fotos/plan2/frente/') ||
    currentPath.startsWith('/fase2/frente/') ||
    currentPath.startsWith('/informes') ||
    currentPath.startsWith('/catalogo-qr/plan2');

  if (currentPath === '/') {
    titulo = 'PLAN DE GESTIÓN PATRIMONIAL DEL CENTRO HISTÓRICO DE MÉRIDA';
  } else if (currentPath === '/PlanMerida') {
    titulo = 'PLAN MÉRIDA 465';
  } else if (currentPath === '/plan3') {
    titulo = 'PLAN 3';
    subtitulo = 'En fase de desarrollo';
  } else if (currentPath === '/plan4') {
    titulo = 'PLAN 4';
    subtitulo = 'En fase de desarrollo';
  } else if (currentPath === '/fase1') {
    titulo = isMobile
      ? 'PLAN DE RESTAURACIÓN — CATEDRAL DE MÉRIDA'
      : 'PLAN DE RESTAURACIÓN INTEGRAL DEL MONUMENTO NACIONAL CATEDRAL DE MÉRIDA BASILICA MENOR DE LA INMACULADA CONCEPCIÓN';
    subtitulo = 'FASE I: Vinculada al Plan Mérida 465';
  } else if (currentPath === '/banco-fotos' || currentPath === '/catalogo-qr') {
    titulo = isMobile
      ? 'PLAN DE GESTIÓN PATRIMONIAL'
      : 'PLAN DE GESTIÓN PATRIMONIAL DEL CENTRO HISTÓRICO DE MÉRIDA';
  } else if (esRutaLarga) {
    titulo = '';
  } else {
    titulo = 'SISTEMA DE INFORMACIÓN TÉCNICA';
  }

  // Valores adaptados al tamaño de pantalla
  const logoH     = isMobile ? (isTiny ? '24px' : '28px') : '55px';
  const padding   = isMobile ? '5px 8px'  : '10px 20px';
  const gap       = isMobile ? '4px'      : '8px';
  const titleSize = isMobile ? (isTiny ? '0.48rem' : '0.55rem') : '1.2rem';
  const subSize   = isMobile ? '0.46rem'  : '0.8rem';
  const titlePad  = isMobile ? '0 5px'   : '0 20px';

  // Título largo: versión corta en pantallas muy pequeñas
  const tituloLargoJSX = isTiny ? (
    <>CATEDRAL DE MÉRIDA — BASÍLICA MENOR</>
  ) : (
    <>
      PLAN DE RESTAURACIÓN INTEGRAL DEL MONUMENTO NACIONAL CATEDRAL DE MÉRIDA
      <br />
      BASILICA MENOR DE LA INMACULADA CONCEPCIÓN
    </>
  );

  return (
    <header style={{
      backgroundColor      : 'rgba(255, 255, 255, 0.25)',
      backdropFilter       : 'blur(15px)',
      WebkitBackdropFilter : 'blur(15px)',
      padding,
      display              : 'flex',
      alignItems           : 'center',
      justifyContent       : 'space-between',
      borderBottom         : '4px solid #005691',
      position             : 'fixed',
      top                  : 0,
      width                : '100%',
      zIndex               : 1100,
      boxSizing            : 'border-box',
      fontFamily           : "'Segoe UI', Roboto, sans-serif",
    }}>

      {/* Logos izquierda — en móvil se ocultan LOGO_NM y LOGO_GOBER */}
      <div style={{ display: 'flex', alignItems: 'center', gap }}>
        {!isMobile && <img src="/logos/LOGO_NM.png"    alt="Logo NM"          style={{ height: logoH, width: 'auto' }} />}
        {!isMobile && <img src="/logos/LOGO_GOBER.png" alt="Logo Gobernación" style={{ height: logoH, width: 'auto' }} />}
        <img src="/logos/LOGO_ULA.png"  alt="Logo ULA"      style={{ height: logoH, width: 'auto' }} />
        <img src="/logos/LOGO.png"      alt="Logo Proyecto" style={{ height: logoH, width: 'auto' }} />
      </div>

      {/* Título central */}
      <div style={{ flex: 1, padding: titlePad, textAlign: 'center' }}>
        <h1 style={{
          color         : '#000',
          margin        : 0,
          fontSize      : titleSize,
          fontWeight    : '800',
          textTransform : 'uppercase',
          lineHeight    : '1.3',
        }}>
          {esRutaLarga ? tituloLargoJSX : titulo}
        </h1>
        {subtitulo && (
          <p style={{ fontSize: subSize, fontWeight: '600', marginTop: '2px', color: '#002640' }}>
            {subtitulo}
          </p>
        )}
      </div>

      {/* Logo derecha */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/logos/LOGO_CATEDRAL.png" alt="Logo Catedral" style={{ height: logoH, width: 'auto' }} />
      </div>
    </header>
  );
}
