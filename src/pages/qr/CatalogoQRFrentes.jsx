// src/pages/qr/CatalogoQRFrentes.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import { datosFase2 } from '../fases/Fase2';

export default function CatalogoQRFrentes() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [qrSeleccionado, setQrSeleccionado] = useState(null);

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
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', 'Roboto', Arial, sans-serif; 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page { size: letter; margin: 0; } 
          
          /* --- Diseño de la Portada --- */
          .portada { 
            page-break-after: always; 
            /* Condición: 95vh para móviles, 100vh para computadoras */
            height: ${isMobile ? '95vh' : '100vh'}; 
            ${isMobile ? 'max-height: 95vh; overflow: hidden;' : ''}
            box-sizing: border-box;
            display: flex; 
            flex-direction: column; 
            justify-content: space-between; 
            align-items: center; 
            text-align: center; 
            background: linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)), url('/logos/FONDO.jpg');
            background-size: cover;
            background-position: center;
          }

          /* --- Banner Superior --- */
          .banner-impresion {
            width: 100%;
            background-color: rgba(255, 255, 255, 0.7);
            padding: 15px 25px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 4px solid #005691;
          }
          .banner-logos {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .banner-logos img { height: 45px; }
          .banner-titulo {
            flex: 1;
            padding: 0 15px;
            text-align: center;
          }
          .banner-titulo h2 {
            color: #000;
            margin: 0;
            font-size: 0.85rem;
            font-weight: 800;
            text-transform: uppercase;
            line-height: 1.3;
          }

          /* --- Centro de la portada --- */
          .portada-body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 0 40px;
          }
          .portada-body h3 {
            font-size: 1rem;
            color: #444;
            margin-bottom: 15px;
            text-transform: uppercase;
          }
          .portada-body h1 { 
            font-size: 1.6rem; 
            color: #002640; 
            margin-bottom: 15px; 
            line-height: 1.3;
            font-family: 'Times New Roman', Times, serif;
          }
          .portada-body .fase { 
            margin-top: 15px; 
            font-size: 1.3rem; 
            font-weight: bold; 
            color: #f37021; 
            letter-spacing: 2px;
          }

          /* --- Footer --- */
          .footer-impresion {
            width: 100%;
            background-color: rgba(255, 255, 255, 0.7);
            padding: 15px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 6px solid #f37021;
          }
          .footer-izq {
            display: flex;
            align-items: center;
            gap: 20px;
          }
          .footer-izq img { height: 40px; }
          .linea-divisoria {
            height: 30px; 
            width: 2px; 
            background-color: rgba(0,0,0,0.2);
          }
          .footer-der {
            display: flex;
            align-items: center;
            gap: 15px;
            text-align: right;
          }
          .footer-der p {
            margin: 0;
            line-height: 1.2;
          }
          .footer-der-texto1 { color: #555; font-size: 0.75rem; font-weight: bold; }
          .footer-der-texto2 { color: #002640; font-size: 0.8rem; font-weight: 800; }
          .footer-der img { height: 45px; filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.1)); }
          
          /* --- Configuraciones de Tabla para impresión (El truco para repetir el H2) --- */
          .tabla-impresion { width: 100%; border-collapse: collapse; }
          .tabla-impresion thead { display: table-header-group; } /* Esto hace que el thead se repita */
          .tabla-impresion tbody { display: table-row-group; }
          .tabla-impresion td { padding: 0; border: none; }

          .contenido { padding: 0 40px 40px 40px; }
          .titulo-seccion { text-align: center; margin: 30px 0 20px 0; font-size: 1.5rem; color: #002640; border-bottom: 2px solid #f37021; padding-bottom: 5px; }
          
          .qr-grid { 
            display: flex; 
            flex-wrap: wrap; 
            justify-content: center; 
            gap: 15px; 
          }
          
          .qr-card { 
            width: 160px;
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
        
        <!-- INICIO DE LA PORTADA -->
        <div class="portada">
          
          <!-- Banner Superior -->
          <header class="banner-impresion">
            <div class="banner-logos">
              <img src="/logos/LOGO_NM.png" alt="NM">
              <img src="/logos/LOGO_GOBER.png" alt="Gobernación">
              <img src="/logos/LOGO_ULA.png" alt="ULA">
              <img src="/logos/LOGO.png" alt="Proyecto">
            </div>
            <div class="banner-titulo">
              <h2>PLAN DE RESTAURACIÓN INTEGRAL DEL MONUMENTO NACIONAL CATEDRAL DE MÉRIDA<br>BASILICA MENOR DE LA INMACULADA CONCEPCIÓN</h2>
            </div>
            <div class="banner-logos">
              <img src="/logos/LOGO_CATEDRAL.png" alt="Catedral">
            </div>
          </header>

          <!-- Cuerpo Central -->
          <div class="portada-body">
            <h3>PLAN DE GESTIÓN PATRIMONIAL DEL CENTRO HISTÓRICO DE MÉRIDA</h3>
            <h1>PLAN DE RESTAURACIÓN INTEGRAL DEL MONUMENTO NACIONAL CATEDRAL DE MÉRIDA BASILICA MENOR DE LA INMACULADA CONCEPCIÓN</h1>
            <div class="fase">CATÁLOGO DIGITAL - FASE II</div>
          </div>

          <!-- Footer Inferior -->
          <footer class="footer-impresion">
            <div class="footer-izq">
              <img src="/logos/LOGO_INCODACA.png" alt="INCODACA">
              <div class="linea-divisoria"></div>
              <img src="/logos/LOGO_TECNI.png" alt="OFICINA TÉCNICA">
            </div>
            <div class="footer-der">
              <div>
                <p class="footer-der-texto1">© 2026 SERVICIO COMUNITARIO UNEFA</p>
                <p class="footer-der-texto2">MÉRIDA, VENEZUELA</p>
              </div>
              <img src="/logos/LOGO_UNEFA.png" alt="UNEFA">
            </div>
          </footer>

        </div>
        <!-- FIN DE LA PORTADA -->

        <!-- CONTENIDO DE LOS QR CON TABLA PARA REPETIR ENCABEZADO -->
        <div class="contenido">
          <table class="tabla-impresion">
            <thead>
              <tr>
                <td>
                  <h2 class="titulo-seccion">FRENTES DE TRABAJO</h2>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="qr-grid">
                    ${datosFase2.map(frente => `
                      <div class="qr-card">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(DOMINIO_OFICIAL + '/fase2/frente/' + frente.id)}" />
                        <h4>FRENTE #${frente.id.toString().padStart(2, '0')}</h4>
                        <p>${frente.nombre}</p>
                      </div>
                    `).join('')}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <script>
          Promise.all(Array.from(document.images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
              img.onload = img.onerror = resolve;
            });
          })).then(() => {
            setTimeout(() => window.print(), 800);
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
          
          /* Elimina los márgenes predeterminados del navegador al imprimir */
          @page { margin: 0; } 
          
          /* Condición para el alto dependiendo del dispositivo */
          body { 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: ${isMobile ? '95vh' : '100vh'}; 
            overflow: hidden; /* Esto es clave para cortar cualquier desbordamiento a la página 2 */
            background: white; 
          }
          
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
    flex: 1, padding: isMobile ? '15px' : '30px', boxSizing: 'border-box', minHeight: 'calc(100vh - 80px)'
  };

  const bannerStyle = {
    borderLeft: '5px solid #f37021', 
    paddingLeft: '15px', 
    display: 'flex', 
    flexDirection: isMobile ? 'column' : 'row', // En móvil se apila
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'center', 
    backgroundColor: 'white', 
    padding: '20px', 
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', 
    marginBottom: '30px',
    gap: isMobile ? '15px' : '0'
  };

  const botonesBannerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    width: isMobile ? '100%' : 'auto'
  };

  const gridStyle = {
    display: 'grid', 
    gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(140px, 1fr))' : 'repeat(auto-fill, minmax(220px, 1fr))', 
    gap: isMobile ? '15px' : '25px', 
    marginTop: '30px'
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
      {/* Buscador eliminado */}
      
      <div style={bannerStyle}>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: '#002640', fontSize: isMobile ? '1.2rem' : '1.5rem' }}>Catálogo Digital de QRs - FASE II</h2>
          <p style={{ margin: '5px 0 0', color: '#f37021', fontWeight: 'bold' }}>30 frentes de trabajo</p>
        </div>
        <div style={botonesBannerStyle}>
          <button onClick={handleImprimirCatalogo} style={{ backgroundColor: '#005691', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', flex: isMobile ? '1' : 'none' }}>
            🖨️ Imprimir
          </button>
          <button onClick={() => navigate('/catalogo-qr/plan2')} style={{ backgroundColor: '#ddd', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', flex: isMobile ? '1' : 'none' }}>
            ← Volver
          </button>
        </div>
      </div>

      <div style={gridStyle}>
        {datosFase2.map((frente) => (
          <div
            key={frente.id}
            style={cardStyle}
            onMouseEnter={e => { if(!isMobile) e.currentTarget.style.transform = 'translateY(-5px)' }}
            onMouseLeave={e => { if(!isMobile) e.currentTarget.style.transform = 'translateY(0)' }}
            onClick={() => setQrSeleccionado(frente)}
          >
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(DOMINIO_OFICIAL + '/fase2/frente/' + frente.id)}`}
              alt={`QR Frente ${frente.id}`}
              style={{ width: isMobile ? '100px' : '120px', height: isMobile ? '100px' : '120px', marginBottom: '10px' }}
            />
            <h4 style={{ color: '#f37021', margin: '8px 0 4px', fontSize: isMobile ? '0.9rem' : '1rem' }}>FRENTE #{frente.id.toString().padStart(2, '0')}</h4>
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