// src/pages/galeria/RostroDetalle.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import { getFotosPorRostro, renombrarRostro, urlImagen, estiloFondoGaleria } from '../../api/carpetas';

export default function RostroDetalle() {
  const { rostroId } = useParams(); // ya viene decodificado (ej. "delia pérez")
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTiny = useIsMobile(480);

  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editando, setEditando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorRenombrar, setErrorRenombrar] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFotosPorRostro(encodeURIComponent(rostroId));
      setDatos(data);
    } catch (err) {
      setError('No se pudieron cargar las fotos. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  }, [rostroId]);

  useEffect(() => { cargar(); }, [cargar]);

  const iniciarEdicion = () => {
    setNuevoNombre(datos ? datos.nombre : rostroId);
    setErrorRenombrar(null);
    setEditando(true);
  };

  const guardarNombre = async (e) => {
    if (e) e.preventDefault();
    const limpio = nuevoNombre.trim();
    if (!limpio) { setErrorRenombrar('El nombre no puede estar vacío.'); return; }
    if (limpio === (datos && datos.nombre)) { setEditando(false); return; }

    setGuardando(true);
    setErrorRenombrar(null);
    try {
      const res = await renombrarRostro(encodeURIComponent(rostroId), limpio);
      setEditando(false);
      if (res.id !== rostroId) {
        // La ruta cambia con el nombre: se recarga solo la vista con el nuevo id
        navigate(`/galeria-carpetas/rostro/${encodeURIComponent(res.id)}`, { replace: true });
      } else {
        await cargar();
      }
    } catch (err) {
      setErrorRenombrar(err.message || 'No se pudo renombrar.');
    } finally {
      setGuardando(false);
    }
  };

  const fotos = datos ? datos.fotos : [];
  const nombreMostrar = datos ? datos.nombre : rostroId;
  const avatar = fotos.length > 0 ? urlImagen(fotos[0].url) : null;
  const diametro = isMobile ? 64 : 88;

  return (
    <div style={estiloFondoGaleria(isMobile)}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* Encabezado */}
        <div style={{
          borderLeft: '5px solid #f37021', backgroundColor: 'white', borderRadius: '10px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)', padding: isMobile ? '14px' : '20px 24px',
          display: 'flex', flexDirection: isTiny ? 'column' : 'row', alignItems: 'center',
          justifyContent: 'space-between', gap: '14px', marginBottom: isMobile ? '18px' : '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0, flexDirection: isTiny ? 'column' : 'row', textAlign: isTiny ? 'center' : 'left' }}>
            <div style={{
              width: `${diametro}px`, height: `${diametro}px`, borderRadius: '50%', flexShrink: 0,
              backgroundColor: '#dfe7ee', border: '3px solid #f37021',
              backgroundImage: avatar ? `url("${avatar}")` : 'none',
              backgroundSize: 'cover', backgroundPosition: 'center top',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? '1.8rem' : '2.4rem'
            }}>
              {!avatar && '👤'}
            </div>

            <div style={{ minWidth: 0 }}>
              {editando ? (
                <form onSubmit={guardarNombre} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: isTiny ? 'center' : 'flex-start' }}>
                  <input
                    autoFocus
                    type="text"
                    value={nuevoNombre}
                    maxLength={60}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    style={{ padding: '8px 14px', borderRadius: '30px', border: '2px solid #f37021', fontSize: isMobile ? '0.95rem' : '1.1rem', fontFamily: 'inherit', outline: 'none', color: '#002640', fontWeight: 700, minWidth: isMobile ? '150px' : '220px' }}
                  />
                  <button type="submit" disabled={guardando}
                    style={{ backgroundColor: '#f37021', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 700, cursor: guardando ? 'wait' : 'pointer', padding: '8px 18px', opacity: guardando ? 0.7 : 1 }}>
                    {guardando ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button type="button" onClick={() => setEditando(false)}
                    style={{ backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '30px', fontWeight: 700, cursor: 'pointer', padding: '8px 18px' }}>
                    Cancelar
                  </button>
                </form>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: isTiny ? 'center' : 'flex-start' }}>
                  <h2 style={{ margin: 0, color: '#002640', fontWeight: 800, fontSize: isMobile ? '1.25rem' : '1.8rem', textTransform: 'capitalize', wordBreak: 'break-word' }}>
                    {nombreMostrar}
                  </h2>
                  {datos && (
                    <button title="Renombrar rostro" onClick={iniciarEdicion}
                      style={{ backgroundColor: '#eee', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '15px', flexShrink: 0 }}>
                      ✏️
                    </button>
                  )}
                </div>
              )}
              {errorRenombrar && <p style={{ color: '#c0392b', fontSize: '0.82rem', margin: '6px 0 0' }}>{errorRenombrar}</p>}
              <p style={{ margin: '4px 0 0', color: '#f37021', fontWeight: 700, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                {fotos.length} foto{fotos.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <button onClick={() => navigate('/galeria-carpetas/rostros')}
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
            <p style={{ margin: '8px 0 0' }}>Aún no hay fotos de esta persona. Aparecerán cuando subas fotos a una carpeta y el sistema la reconozca.</p>
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
                  alt={`Foto de ${nombreMostrar}`}
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
