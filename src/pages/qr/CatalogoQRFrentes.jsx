// src/pages/qr/CatalogoQRFrentes.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import { datosFase2 } from '../fases/Fase2';

export default function CatalogoQRFrentes() {
  const navigate = useNavigate();
  const [qrSeleccionado, setQrSeleccionado] = useState(null);
  const contentRef = useRef(null);

 const handleImprimir = () => {
  const ventana = window.open('', '_blank');
  
  ventana.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Catálogo de QRs - Fase II</title>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
          background: white;
          margin: 0;
          padding: 0;
        }
        /* Configuración de página para impresión */
        @page {
          size: letter;
          margin: 1.5cm;
        }
        /* Portada */
        .portada {
          page-break-after: always;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          background-image: linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)), url('/logos/FONDO.jpg');
          background-size: cover;
          background-position: center;
        }
        .portada .logo-container {
          margin-bottom: 40px;
        }
        .portada .logo-container img {
          height: 70px;
          margin: 0 10px;
        }
        .portada h1 {
          font-size: 2rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #002640;
          background: rgba(255,255,255,0.85);
          display: inline-block;
          padding: 20px 30px;
          border-radius: 20px;
          line-height: 1.3;
        }
        .portada .fase {
          margin-top: 30px;
          font-size: 1.8rem;
          font-weight: bold;
          color: #f37021;
          background: rgba(255,255,255,0.8);
          padding: 10px 25px;
          border-radius: 40px;
        }
        .portada .footer-text {
          margin-top: 80px;
          font-size: 0.9rem;
          color: #002640;
          background: rgba(255,255,255,0.7);
          padding: 5px 15px;
          border-radius: 20px;
        }
        /* Encabezado y pie que se repiten en cada página (excepto portada) */
        .page-header, .page-footer {
          display: none;
        }
        @media print {
          .page-header {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 1.2cm;
            background: #f8f8f8;
            border-bottom: 2px solid #f37021;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            font-size: 12px;
            color: #002640;
          }
          .page-header .logo-group {
            display: flex;
            gap: 8px;
          }
          .page-header .logo-group img {
            height: 30px;
          }
          .page-footer {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 0.8cm;
            background: #f8f8f8;
            border-top: 1px solid #ddd;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            color: #666;
          }
          body {
            margin-top: 1.5cm;
            margin-bottom: 1.2cm;
          }
          .portada {
            margin-top: 0;
            margin-bottom: 0;
          }
        }
        /* Contenido de los QR */
        .contenido {
          padding: 20px;
        }
        .titulo-seccion {
          text-align: center;
          margin: 20px 0;
          font-size: 1.5rem;
          color: #002640;
          border-bottom: 3px solid #f37021;
          display: inline-block;
          width: auto;
          padding-bottom: 5px;
        }
        .qr-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 25px;
          margin-top: 20px;
        }
        .qr-card {
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 15px;
          background: white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          page-break-inside: avoid;
          break-inside: avoid;
        }
        .qr-card img {
          width: 120px;
          height: 120px;
          margin-bottom: 10px;
        }
        .qr-card h4 {
          color: #f37021;
          margin: 8px 0 4px;
          font-size: 14px;
        }
        .qr-card p {
          font-weight: bold;
          color: #002640;
          font-size: 12px;
        }
        @media (max-width: 800px) {
          .qr-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      </style>
    </head>
    <body>
      <!-- PORTADA -->
      <div class="portada">
        <div>
          <div class="logo-container">
            <img src="/logos/LOGO_NM.png" alt="NM">
            <img src="/logos/LOGO_GOBER.png" alt="Gobernación">
            <img src="/logos/LOGO_ULA.png" alt="ULA">
            <img src="/logos/LOGO.png" alt="Proyecto">
            <img src="/logos/LOGO_CATEDRAL.png" alt="Catedral">
          </div>
          <h1>PLAN DE RESTAURACIÓN INTEGRAL DEL<br>MONUMENTO NACIONAL CATEDRAL DE MÉRIDA<br>BASILICA MENOR DE LA INMACULADA CONCEPCIÓN</h1>
          <div class="fase">FASE II</div>
          <div class="footer-text">MÉRIDA, VENEZUELA</div>
        </div>
      </div>

      <!-- CONTENIDO DE QRs -->
      <div class="contenido">
        <div style="text-align: center;">
          <h2 class="titulo-seccion">FRENTES DE TRABAJO</h2>
          <p style="margin-top: 10px;">30 frentes disponibles - Escanea el código para acceder a la información técnica</p>
        </div>
        <div class="qr-grid">
          ${datosFase2.map(frente => `
            <div class="qr-card">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/fase2/frente/' + frente.id)}" alt="QR Frente ${frente.id}">
              <h4>FRENTE #${frente.id.toString().padStart(2, '0')}</h4>
              <p>${frente.nombre}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ENCABEZADO Y PIE (se muestran en todas las páginas excepto portada) -->
      <div class="page-header">
        <div class="logo-group">
          <img src="/logos/LOGO_NM.png" alt="NM">
          <img src="/logos/LOGO_GOBER.png" alt="Gobernación">
          <img src="/logos/LOGO_ULA.png" alt="ULA">
          <img src="/logos/LOGO.png" alt="Proyecto">
        </div>
        <span>PLAN DE RESTAURACIÓN INTEGRAL - CATÁLOGO DE QRs</span>
        <div>
          <img src="/logos/LOGO_CATEDRAL.png" alt="Catedral" style="height:30px">
        </div>
      </div>
      <div class="page-footer">
        MÉRIDA, VENEZUELA
      </div>
    </body>
    </html>
  `);
  
  ventana.document.close();
  ventana.print();
};

  const containerStyle = {
    background: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url('/logos/FONDO.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    flex: 1,
    padding: '30px',
    boxSizing: 'border-box',
    minHeight: 'calc(100vh - 80px)'
  };

  const bannerStyle = {
    borderLeft: '5px solid #f37021',
    paddingLeft: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    marginBottom: '30px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '25px',
    marginTop: '30px'
  };

  const cardStyle = {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: '16px',
    padding: '15px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  };

  const qrImageStyle = {
    width: '120px',
    height: '120px',
    marginBottom: '10px'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    cursor: 'pointer'
  };

  const modalImgStyle = {
    maxWidth: '90%',
    maxHeight: '90%',
    borderRadius: '12px'
  };

  return (
    <div style={containerStyle}>
      <SearchBar />
      <div style={bannerStyle}>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: '#002640' }}>Códigos QR - FASE II</h2>
          <p style={{ margin: '5px 0 0', color: '#f37021', fontWeight: 'bold' }}>30 frentes de trabajo</p>
        </div>
        <div>
          <button
            onClick={handleImprimir}
            style={{ backgroundColor: '#005691', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}
          >
            🖨️ Imprimir
          </button>
          <button onClick={() => navigate('/catalogo-qr/plan2')} style={{ backgroundColor: '#ddd', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>
            ← Volver
          </button>
        </div>
      </div>

      <div style={gridStyle}>
        {datosFase2.map((frente) => (
          <div
            key={frente.id}
            style={cardStyle}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            onClick={() => setQrSeleccionado(frente)}
          >
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/fase2/frente/' + frente.id)}`}
              alt={`QR Frente ${frente.id}`}
              style={qrImageStyle}
            />
            <h4 style={{ color: '#f37021', margin: '8px 0 4px' }}>FRENTE #{frente.id.toString().padStart(2, '0')}</h4>
            <p style={{ fontWeight: 'bold', color: '#002640', fontSize: '0.8rem' }}>{frente.nombre}</p>
          </div>
        ))}
      </div>

      {qrSeleccionado && (
        <div style={modalOverlayStyle} onClick={() => setQrSeleccionado(null)}>
          <div style={{ textAlign: 'center' }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.origin + '/fase2/frente/' + qrSeleccionado.id)}`}
              alt="QR ampliado"
              style={modalImgStyle}
            />
            <p style={{ color: 'white', marginTop: '10px' }}>FRENTE #{qrSeleccionado.id} - {qrSeleccionado.nombre}</p>
          </div>
        </div>
      )}
    </div>
  );
}