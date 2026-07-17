// src/components/Footer.jsx
import React from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Footer({ isOpen }) {
  const isMobile = useIsMobile();    // true si ≤ 768px
  const isTiny   = useIsMobile(480); // true si ≤ 480px

  // Estilos base (exactamente igual que el original para PC)
  const baseFooterStyle = {
    backgroundColor      : 'rgba(255, 255, 255, 0.3)',
    backdropFilter       : 'blur(10px)',
    WebkitBackdropFilter : 'blur(10px)',
    borderBottom         : '6px solid #f37021',
    boxSizing            : 'border-box',
    marginTop            : 'auto',
    flexWrap             : 'wrap',
  };

  // En PC: igual que antes. En móvil: se apila y centra.
  const footerStyle = {
    ...baseFooterStyle,
    padding            : isMobile ? (isTiny ? '12px 10px' : '15px 20px') : '20px 30px',
    display            : 'flex',
    flexDirection      : isMobile ? 'column' : 'row',
    alignItems         : 'center',
    justifyContent     : isMobile ? 'center' : 'space-between',
    gap                : isMobile ? '12px' : '10px',
  };

  // Tamaños en PC (exactamente los originales) y en móvil (más pequeños)
  const logoHeight = isMobile ? (isTiny ? '28px' : '32px') : '40px';
  const unefaHeight = isMobile ? (isTiny ? '32px' : '36px') : '45px';
  const fontSize   = isMobile ? (isTiny ? '0.6rem' : '0.7rem') : '0.75rem';
  const fontSizeSub= isMobile ? (isTiny ? '0.65rem' : '0.75rem') : '0.8rem';

  // El separador vertical solo se muestra en PC
  const showSeparator = !isMobile;

  return (
    <footer style={footerStyle}>
      {/* Bloque izquierdo: logos INCODACA y TÉCNICA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'center' : 'flex-start',
        gap: isMobile ? '12px' : '20px',
        flexWrap: 'wrap',
      }}>
        <img src="/logos/LOGO_INCODACA.png" alt="INCODACA" style={{ height: logoHeight, width: 'auto' }} />
        {showSeparator && (
          <div style={{ height: '30px', width: '1px', backgroundColor: 'rgba(0,0,0,0.1)' }} />
        )}
        <img src="/logos/LOGO_TECNI.png" alt="OFICINA TÉCNICA" style={{ height: logoHeight, width: 'auto' }} />
      </div>

      {/* Bloque derecho: texto y logo UNEFA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'center' : 'flex-end',
        gap: isMobile ? '10px' : '15px',
        flexWrap: 'wrap',
        textAlign: isMobile ? 'center' : 'right',
      }}>
        <div>
          <p style={{
            margin: '0 0 4px 0',
            color: '#555',
            fontSize: fontSize,
            fontWeight: 'bold',
          }}>
            © 2026 SERVICIO COMUNITARIO UNEFA
          </p>
          <p style={{
            margin: '0',
            color: '#002640',
            fontSize: fontSizeSub,
            fontWeight: '800',
          }}>
            MÉRIDA, VENEZUELA
          </p>
        </div>

        <img
          src="/logos/LOGO_UNEFA.png"
          alt="Logo UNEFA"
          style={{
            height: unefaHeight,
            width: 'auto',
            filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))',
          }}
        />

          <img
          src="/logos/LOGO_ARMAS.png"   // ← CAMBIA ESTA RUTA POR LA DE TU LOGO
          alt="Logo adicional"
          style={{
            height: unefaHeight,        // Mismo tamaño que UNEFA
            width: 'auto',
            filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))',
          }}
        />

      </div>
    </footer>
  );
}