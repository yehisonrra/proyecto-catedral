// src/pages/galeria/ObjetoDetalle.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import { getFotosPorObjeto, iconoObjeto, urlImagen, estiloFondoGaleria } from '../../api/carpetas';

export default function ObjetoDetalle() {
  const { objetoId } = useParams(); // ya viene decodificado (ej. "Cúpulas")
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTiny = useIsMobile(480);

  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setDatos(await getFotosPorObjeto(encodeURIComponent(objetoId)));
    } catch (err) {
      setError('No se pudieron cargar las fotos. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  }, [objetoId]);

  useEffect(() => { cargar(); }, [cargar]);

  const fotos = datos ? datos.fotos : [];
  const nombreMostrar = datos ? datos.nombre : objetoId;

  return (
    <div style={estiloFondoGaleria(isMobile)}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        <div style={{
          borderLeft: '5px solid #f37021', backgroundColor: 'white', borderRadius: '10px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)', padding: isMobile ? '14px' : '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
          marginBottom: isMobile ? '18px' : '30px', flexWrap: 'wrap'
        }}>
          <div>
            <h2 style={{ margin: 0, color: '#002640', fontWeight: 800, fontSize: isMobile ? '1.2rem' : '1.7rem' }}>
              {iconoObjeto(nombreMostrar)} {nombreMostrar}
            </h2>
            <p style={{ margin: '4px 0 0', color: '#f37021', fontWeight: 700, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
              {fotos.length} foto{fotos.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={() => navigate('/galeria-carpetas/objetos')}
            style={{ backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '30px', fontWeight: 700, cursor: 'pointer', padding: isMobile ? '8px 14px' : '10px 20px', fontSize: isMobile ? '0.8rem' : '0.95rem' }}>
            ← Volver
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderLeft: '5px solid #c0392b', borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ color: '#c0392b', fontWeight: 600 }}>{error}</span>
            <button onClick={cargar} style={{ backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '30px', padding: '8px 16px', fontWeight: 700, cursor: 'pointer' }}>Reintentar</button>
          </div>
        )}

        {loading && <p style={{ textAlign: 'center', color: '#002640', fontWeight: 600 }}>Cargando fotos...</p>}

        {!loading && !error && fotos.length === 0 && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: '18px', padding: '40px 20px', textAlign: 'center', color: '#555' }}>
            <div style={{ fontSize: '3rem' }}>📷</div>
            <p style={{ margin: '8px 0 0' }}>No hay fotos con esta etiqueta.</p>
          </div>
        )}

        {!loading && fotos.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isTiny ? '1fr' : `repeat(auto-fill, minmax(${isMobile ? 150 : 240}px, 1fr))`,
            gap: isMobile ? '12px' : '22px'
          }}>
            {fotos.map((f) => (
              <div key={f.id}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}>
                <img
                  src={urlImagen(f.url)}
                  alt={`Foto con ${nombreMostrar}`}
                  onClick={() => window.open(urlImagen(f.url), '_blank')}
                  style={{ width: '100%', height: isMobile ? '170px' : '220px', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
                />
                <div
                  title="Ir a la carpeta"
                  onClick={() => navigate(`/galeria-carpetas/carpeta/${f.carpeta_id}`)}
                  style={{ padding: '9px 12px', fontSize: '0.72rem', fontWeight: 600, color: '#002640', cursor: 'pointer', wordBreak: 'break-word' }}>
                  📁 {f.carpeta_nombre}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
