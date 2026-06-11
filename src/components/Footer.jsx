// src/components/Footer.jsx
import React from 'react';

export default function Footer({ isOpen }) {
  return (
    <footer className="footer-root" style={{
      backgroundColor    : 'rgba(255, 255, 255, 0.3)',
      backdropFilter     : 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      padding            : '20px 30px',
      display            : 'flex',
      alignItems         : 'center',
      justifyContent     : 'space-between',
      width              : '100%',
      borderBottom       : '6px solid #f37021',
      boxSizing          : 'border-box',
      marginTop          : 'auto',
      flexWrap           : 'wrap',
      gap                : '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <img src="/logos/LOGO_INCODACA.png" alt="INCODACA"        style={{ height: '40px' }} />
        <div style={{ height: '30px', width: '1px', backgroundColor: 'rgba(0,0,0,0.1)' }} />
        <img src="/logos/LOGO_TECNI.png"    alt="OFICINA TÉCNICA" style={{ height: '40px' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div>
          <p style={{ margin: '0', color: '#555',   fontSize: '0.75rem', fontWeight: 'bold' }}>© 2026 SERVICIO COMUNITARIO UNEFA</p>
          <p style={{ margin: '0', color: '#002640', fontSize: '0.8rem',  fontWeight: '800'  }}>MÉRIDA, VENEZUELA</p>
        </div>
        <img src="/logos/LOGO_UNEFA.png" alt="Logo UNEFA" style={{ height: '45px', width: 'auto', filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))' }} />
      </div>
    </footer>
  );
}
