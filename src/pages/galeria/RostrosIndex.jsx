// src/pages/galeria/RostrosIndex.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import { getRostros, urlImagen, estiloFondoGaleria } from '../../api/carpetas';

export default function RostrosIndex() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [rostros, setRostros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRostros(await getRostros());
    } catch (err) {
      setError('No se pudieron cargar los rostros. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const diametro = isMobile ? 92 : 128;

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
            <h2 style={{ margin: 0, color: '#002640', fontWeight: 800, fontSize: isMobile ? '1.2rem' : '1.7rem' }}>👤 Buscar por Rostro</h2>
            <p style={{ margin: '4px 0 0', color: '#666', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>Toca un rostro para ver todas sus fotos</p>
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

        {loading && <p style={{ textAlign: 'center', color: '#002640', fontWeight: 600 }}>Cargando rostros...</p>}

        {!loading && !error && rostros.length === 0 && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: '18px', padding: '40px 20px', textAlign: 'center', color: '#555' }}>
            <div style={{ fontSize: '3rem' }}>👤</div>
            <p style={{ margin: '8px 0 0' }}>Todavía no hay personas registradas en el sistema de reconocimiento.</p>
          </div>
        )}

        {!loading && rostros.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? 118 : 170}px, 1fr))`,
            gap: isMobile ? '12px' : '22px'
          }}>
            {rostros.map((r) => (
              <div
                key={r.id}
                onClick={() => navigate(`/galeria-carpetas/rostro/${encodeURIComponent(r.id)}`)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 22px rgba(0,0,0,0.16)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.1)'; }}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: '20px', padding: isMobile ? '14px 8px' : '22px 12px',
                  textAlign: 'center', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <div style={{
                  width: `${diametro}px`, height: `${diametro}px`, borderRadius: '50%', margin: '0 auto',
                  backgroundColor: '#dfe7ee',
                  backgroundImage: r.thumbnail ? `url("${urlImagen(r.thumbnail)}")` : 'none',
                  backgroundSize: 'cover', backgroundPosition: 'center top',
                  border: '3px solid #f37021',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? '2.2rem' : '3rem'
                }}>
                  {!r.thumbnail && '👤'}
                </div>
                <div style={{ marginTop: '10px', fontWeight: 800, color: '#002640', fontSize: isMobile ? '0.88rem' : '1.02rem', textTransform: 'capitalize', wordBreak: 'break-word' }}>
                  {r.nombre}
                </div>
                <div style={{ marginTop: '2px', color: '#f37021', fontWeight: 700, fontSize: isMobile ? '0.72rem' : '0.8rem' }}>
                  {r.cantidad > 0 ? `${r.cantidad} foto${r.cantidad !== 1 ? 's' : ''}` : 'Sin fotos aún'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
