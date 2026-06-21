// src/pages/qr/CatalogoQRFrentes.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import { datosFase2 } from '../fases/Fase2';

export default function CatalogoQRFrentes() {
  const navigate = useNavigate();
  const [qrSeleccionado, setQrSeleccionado] = useState(null);

  // URL FIJA: Cambia esto por tu dominio oficial final (ej. https://catedralmerida.com)
  // Esto garantiza que el código QR nunca cambie, independientemente de dónde lo abras.
  const DOMINIO_OFICIAL = 'https://proyecto-catedral.vercel.app/';

  // --- FUNCIÓN PARA IMPRIMIR EL CATÁLOGO COMPLETO ---
  const handleImprimirCatalogo = () => {
    const ventana = window.open('', '_blank');
    
    ventana.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Catálogo Digital de QRs - Fase II</title>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', 'Roboto', Arial, sans-serif; }
          body { background: white; }
          @page { size: letter; margin: 1cm; }
          
          /* Portada */
          .portada { page-break-after: always; height: 95vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
          .portada .logo-container img { height: 65px; margin: 0 10px; }
          .portada h1 { font-size: 1.8rem; color: #002640; margin-top: 30px; }
          .portada .fase { margin-top: 20px; font-size: 1.5rem; font-weight: bold; color: #f37021; }
          
          /* Grid de QRs corregido para impresión */
          .contenido { padding: 10px; }
          .titulo-seccion { text-align: center; margin: 20px 0; font-size: 1.5rem; color: #002640; border-bottom: 2px solid #f37021; padding-bottom: 5px; }
          
          .qr-grid { 
            display: flex; 
            flex-wrap: wrap; 
            justify-content: center; 
            gap: 15px; 
            margin-top: 20px; 
          }
          
          .qr-card { 
            width: 160px; /* Tamaño fijo para evitar dispersión */
            text-align: center; 
            border: 1px solid #ccc; 
            border-radius: 8px; 
            padding: 15px 10px; 
            background: #fafafa; 
            page-break-inside: avoid; 
          }
          .qr-card img { width: 120px; height: 120px; margin-bottom: 8px; }
          .qr-card h4 { color: #f37021; margin: 0 0 4px; font-size: 13px; }
          .qr-card p { font-weight: bold; color: #002640; font-size: 11px; line-height: 1.2; }
        </style>
      </head>
      <body>
        <div class="portada">
          <div class="logo-container">
            <img src="/logos/LOGO_INCODACA.png" alt="INCODACA">
            <img src="/logos/LOGO_TECNI.png" alt="Oficina Técnica">
            <img src="/logos/LOGO_UNEFA.png" alt="UNEFA">
          </div>
          <h1>PLAN DE RESTAURACIÓN INTEGRAL<br>CATEDRAL DE MÉRIDA</h1>
          <div class="fase">CATÁLOGO DIGITAL - FASE II</div>
        </div>

        <div class="contenido">
          <h2 class="titulo-seccion">FRENTES DE TRABAJO</h2>
          <div class="qr-grid">
            ${datosFase2.map(frente => `
              <div class="qr-card">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(DOMINIO_OFICIAL + '/fase2/frente/' + frente.id)}" />
                <h4>FRENTE #${frente.id.toString().padStart(2, '0')}</h4>
                <p>${frente.nombre}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <script>
          // Esperar a que los QR de la API carguen antes de imprimir
          Promise.all(Array.from(document.images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
              img.onload = img.onerror = resolve;
            });
          })).then(() => {
            setTimeout(() => window.print(), 500);
          });
        </script>
      </body>
      </html>
    `);
    ventana.document.close();
  };

  // --- FUNCIÓN PARA IMPRIMIR UN QR INDIVIDUAL ---
  const handleImprimirIndividual = (frente) => {
    const ventana = window.open('', '_blank');
    
    ventana.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Frente ${frente.id}</title>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', 'Roboto', Arial, sans-serif; }
          body { display: flex; justify-content: center; align-items: center; height: 100vh; background: white; }
          
          .ficha-qr {
            width: 10cm;
            height: 15cm;
            border: 2px solid #002640;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }
          
          .logos { display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; }
          .logos img { height: 40px; }
          
          h2 { color: #f37021; font-size: 1.5rem; margin-bottom: 5px; }
          h3 { color: #002640; font-size: 1.2rem; margin-bottom: 25px; line-height: 1.2; }
          
          .qr-container {
            border: 4px solid #f37021;
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 20px;
          }
          .qr-container img { width: 200px; height: 200px; }
          
          .footer { font-size: 0.8rem; color: #666; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="ficha-qr">
          <div>
            <div class="logos">
              <img src="/logos/LOGO_INCODACA.png" alt="INCODACA">
              <img src="/logos/LOGO_UNEFA.png" alt="UNEFA">
            </div>
            <h2>FRENTE #${frente.id.toString().padStart(2, '0')}</h2>
            <h3>${frente.nombre}</h3>
          </div>
          
          <div class="qr-container">
             <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(DOMINIO_OFICIAL + '/fase2/frente/' + frente.id)}" />
          </div>
          
          <div class="footer">
            SISTEMA DE INFORMACIÓN TÉCNICA<br>
            CATEDRAL DE MÉRIDA
          </div>
        </div>

        <script>
          // Esperar carga de imagen individual
          const img = document.querySelector('.qr-container img');
          img.onload = () => setTimeout(() => window.print(), 300);
        </script>
      </body>
      </html>
    `);
    ventana.document.close();
  };

  // --- ESTILOS DE INTERFAZ ---
  const containerStyle = {
    background: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url('/logos/FONDO.jpg')`,
    backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
    flex: 1, padding: '30px', boxSizing: 'border-box', minHeight: 'calc(100vh - 80px)'
  };

  const bannerStyle = {
    borderLeft: '5px solid #f37021', paddingLeft: '15px', display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '30px'
  };

  const gridStyle = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px', marginTop: '30px'
  };

  const cardStyle = {
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '15px', textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s'
  };

  const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center',
    alignItems: 'center', zIndex: 2000
  };

  const modalContentStyle = {
    backgroundColor: 'white', padding: '30px', borderRadius: '15px', textAlign: 'center',
    maxWidth: '400px', width: '90%', position: 'relative'
  };

  const btnIndividualStyle = {
    backgroundColor: '#002640', color: 'white', border: 'none', padding: '10px 20px',
    borderRadius: '8px', cursor: 'pointer', marginTop: '20px', fontWeight: 'bold', width: '100%'
  };

  return (
    <div style={containerStyle}>
      <SearchBar />
      
      <div style={bannerStyle}>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: '#002640' }}>Catálogo Digital de QRs - FASE II</h2>
          <p style={{ margin: '5px 0 0', color: '#f37021', fontWeight: 'bold' }}>30 frentes de trabajo</p>
        </div>
        <div>
          <button onClick={handleImprimirCatalogo} style={{ backgroundColor: '#005691', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>
            🖨️ Imprimir Catálogo Completo
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
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(DOMINIO_OFICIAL + '/fase2/frente/' + frente.id)}`}
              alt={`QR Frente ${frente.id}`}
              style={{ width: '120px', height: '120px', marginBottom: '10px' }}
            />
            <h4 style={{ color: '#f37021', margin: '8px 0 4px' }}>FRENTE #{frente.id.toString().padStart(2, '0')}</h4>
            <p style={{ fontWeight: 'bold', color: '#002640', fontSize: '0.8rem' }}>{frente.nombre}</p>
          </div>
        ))}
      </div>

      {qrSeleccionado && (
        <div style={modalOverlayStyle} onClick={(e) => { if(e.target === e.currentTarget) setQrSeleccionado(null) }}>
          <div style={modalContentStyle}>
            <button 
              onClick={() => setQrSeleccionado(null)}
              style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}
            >
              ✕
            </button>
            <h3 style={{ color: '#002640', marginBottom: '5px' }}>FRENTE #{qrSeleccionado.id.toString().padStart(2, '0')}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>{qrSeleccionado.nombreCompleto}</p>
            
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(DOMINIO_OFICIAL + '/fase2/frente/' + qrSeleccionado.id)}`}
              alt="QR ampliado"
              style={{ width: '200px', height: '200px', border: '3px solid #f37021', borderRadius: '10px', padding: '10px' }}
            />
            
            <button style={btnIndividualStyle} onClick={() => handleImprimirIndividual(qrSeleccionado)}>
              🖨️ Imprimir Ficha Individual
            </button>
          </div>
        </div>
      )}
    </div>
  );
}