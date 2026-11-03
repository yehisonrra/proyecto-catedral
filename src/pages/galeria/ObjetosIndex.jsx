// src/pages/galeria/ObjetosIndex.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import { getObjetos, iconoObjeto, estiloFondoGaleria } from '../../api/carpetas';

export default function ObjetosIndex() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [objetos, setObjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setObjetos(await getObjetos());
    } catch (err) {
      setError('No se pudieron cargar los objetos. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

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
            <h2 style={{ margin: 0, color: '#002640', fontWeight: 800, fontSize: isMobile ? '1.2rem' : '1.7rem' }}>🏛️ Buscar por Objeto</h2>
            <p style={{ margin: '4px 0 0', color: '#666', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>Elige una categoría para ver sus fotos</p>
          </div>
          <button onClick={() => navigate('/galeria-carpetas')}
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

        {loading && <p style={{ textAlign: 'center', color: '#002640', fontWeight: 600 }}>Cargando objetos...</p>}

        {!loading && !error && objetos.length === 0 && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: '18px', padding: '40px 20px', textAlign: 'center', color: '#555' }}>
            <div style={{ fontSize: '3rem' }}>🏷️</div>
            <p style={{ margin: '8px 0 0' }}>Aún no hay fotos etiquetadas con objetos. Entra a una carpeta y usa el botón 🏛️ de cada foto.</p>
          </div>
        )}

        {!loading && objetos.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: isMobile ? '12px' : '22px'
          }}>
            {objetos.map((o) => (
              <div
                key={o.id}
                onClick={() => navigate(`/galeria-carpetas/objeto/${encodeURIComponent(o.id)}`)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 22px rgba(0,0,0,0.16)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.1)'; }}
                style={{
                  backgroundColor: 'white', borderRadius: '18px', cursor: 'pointer',
                  padding: isMobile ? '16px 18px' : '26px 18px',
                  display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: 'center',
                  gap: isMobile ? '16px' : '8px', textAlign: isMobile ? 'left' : 'center',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)', transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <div style={{ fontSize: isMobile ? '2.2rem' : '3rem', lineHeight: 1 }}>{iconoObjeto(o.nombre)}</div>
                <div>
                  <div style={{ fontWeight: 800, color: '#002640', fontSize: isMobile ? '1rem' : '1.15rem' }}>{o.nombre}</div>
                  <div style={{ color: '#f37021', fontWeight: 700, fontSize: '0.82rem', marginTop: '2px' }}>
                    {o.cantidad} foto{o.cantidad !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
