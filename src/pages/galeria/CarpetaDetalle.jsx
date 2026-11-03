// src/pages/galeria/CarpetaDetalle.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useReconocimiento } from '../../hooks/useReconocimiento';
import {
  getFotosPorCarpeta, subirFotoACarpeta, eliminarFotoCarpeta,
  actualizarObjetosFoto, reemplazarRostrosFoto, quitarRostroFoto,
  OBJETOS_PREDEFINIDOS, iconoObjeto, urlImagen, estiloFondoGaleria, SERVER_URL
} from '../../api/carpetas';

// ─── Modelos face-api.js (carga global UNA sola vez) ─────────────────────────
const MODELS_URL = '/models';

// ─── Ajustes de precisión del reconocimiento (galería por carpetas) ──────────
// Si se pierden personas que SÍ salen: sube DISTANCIA_MAX (ej. 0.48).
// Si aún etiqueta personas que NO salen: baja DISTANCIA_MAX (ej. 0.40).
const CONFIANZA_DETECCION = 0.5;  // como estaba al principio
const TAMANO_MIN_ROSTRO   = 40;   // acepta caras más pequeñas
const DISTANCIA_MAX       = 0.50; // igual que el servidor
let modelosCargados = false;
let promesaModelos = null;

async function cargarModelos() {
  if (modelosCargados) return;
  if (!promesaModelos) {
    promesaModelos = Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URL),
    ]).then(() => { modelosCargados = true; })
      .catch((err) => { promesaModelos = null; throw err; });
  }
  await promesaModelos;
}

// ─── Memoria local de fotos ya analizadas (evita re-analizar en cada visita) ──
// Se identifica la foto por su URL (el nombre de archivo es único).
const CLAVE_ANALIZADAS = 'galeria_carpetas_fotos_analizadas_v2'; // v2: fuerza re-análisis con las reglas nuevas

function leerAnalizadas() {
  try { return new Set(JSON.parse(localStorage.getItem(CLAVE_ANALIZADAS) || '[]')); }
  catch (e) { return new Set(); }
}
function yaAnalizada(url) { return leerAnalizadas().has(url); }
function marcarAnalizada(url) {
  try {
    const s = leerAnalizadas();
    s.add(url);
    localStorage.setItem(CLAVE_ANALIZADAS, JSON.stringify(Array.from(s)));
  } catch (e) { /* sin almacenamiento: se re-analizará la próxima vez */ }
}
function olvidarAnalizadas(urls) {
  try {
    const s = leerAnalizadas();
    urls.forEach(u => s.delete(u));
    localStorage.setItem(CLAVE_ANALIZADAS, JSON.stringify(Array.from(s)));
  } catch (e) { /* nada */ }
}

// ─── Cola de análisis: una foto a la vez (evita congelar el navegador) ───────
let colaAnalisis = Promise.resolve();
function encolar(tarea) {
  const p = colaAnalisis.then(tarea);
  colaAnalisis = p.catch(() => {});
  return p;
}

// ─── Modal de objetos (chips seleccionables) ─────────────────────────────────
function ModalObjetos({ foto, onCerrar, onGuardar }) {
  const isMobile = useIsMobile();
  const [seleccion, setSeleccion] = useState(foto.objetos || []);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState(null);

  // Predefinidos + cualquier objeto personalizado que la foto ya tenga
  const opciones = [
    ...OBJETOS_PREDEFINIDOS,
    ...(foto.objetos || []).filter(o => !OBJETOS_PREDEFINIDOS.includes(o))
  ];

  const alternar = (nombre) => {
    setSeleccion(prev => prev.includes(nombre) ? prev.filter(o => o !== nombre) : [...prev, nombre]);
  };

  const guardar = async () => {
    setGuardando(true);
    setErrorModal(null);
    try {
      await onGuardar(foto.id, seleccion);
    } catch (err) {
      setErrorModal(err.message || 'No se pudieron guardar los objetos.');
      setGuardando(false);
    }
  };

  return (
    <div
      onClick={onCerrar}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,38,64,0.55)', backdropFilter: 'blur(4px)',
        zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px', boxSizing: 'border-box'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white', borderRadius: '20px', padding: isMobile ? '18px' : '28px',
          width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(0,0,0,0.35)'
        }}
      >
        <h2 style={{ margin: '0 0 6px', color: '#002640', fontWeight: 800, fontSize: isMobile ? '1.15rem' : '1.35rem', borderLeft: '5px solid #f37021', paddingLeft: '12px' }}>
          🏛️ Objetos en esta foto
        </h2>
        <p style={{ margin: '0 0 16px 17px', color: '#666', fontSize: '0.82rem' }}>Marca todo lo que aparezca en la foto.</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {opciones.map((nombre) => {
            const activo = seleccion.includes(nombre);
            return (
              <button
                key={nombre}
                type="button"
                role="checkbox"
                aria-checked={activo}
                onClick={() => alternar(nombre)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: isMobile ? '7px 12px' : '8px 14px', borderRadius: '30px',
                  border: activo ? '2px solid #f37021' : '2px solid transparent',
                  backgroundColor: activo ? '#f37021' : '#eee',
                  color: activo ? 'white' : '#333',
                  fontWeight: 700, fontSize: isMobile ? '0.8rem' : '0.88rem',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s'
                }}
              >
                <span>{activo ? '✓' : iconoObjeto(nombre)}</span>
                <span>{nombre}</span>
              </button>
            );
          })}
        </div>

        {errorModal && <p style={{ color: '#c0392b', fontSize: '0.85rem', margin: '12px 0 0' }}>{errorModal}</p>}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '22px' }}>
          <button type="button" onClick={onCerrar}
            style={{ backgroundColor: '#eee', color: '#333', border: 'none', padding: '10px 20px', borderRadius: '30px', fontWeight: 700, cursor: 'pointer' }}>
            Cancelar
          </button>
          <button type="button" onClick={guardar} disabled={guardando}
            style={{ backgroundColor: '#f37021', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '30px', fontWeight: 700, cursor: guardando ? 'wait' : 'pointer', opacity: guardando ? 0.7 : 1 }}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Foto con reconocimiento facial silencioso ───────────────────────────────
function CeldaFoto({ foto, modelosListos, onEliminar, onObjetos }) {
  const isMobile = useIsMobile();
  const imgRef = useRef(null);
  const analizando = useRef(false);
  const [estado, setEstado] = useState(null); // { tipo, texto } → se muestra bajo la foto
  const [rostros, setRostros] = useState(foto.rostros || []); // [{ nombre, score }]
  const { reconocer, error: errorReconocer } = useReconocimiento();

  const analizar = useCallback(async () => {
    if (analizando.current || !modelosListos || !imgRef.current) return;
    if (yaAnalizada(foto.url)) return;
    analizando.current = true;
    setEstado({ tipo: 'espera', texto: '⏳ En cola para analizar...' });

    try {
      await encolar(async () => {
        setEstado({ tipo: 'espera', texto: '🔍 Analizando rostros...' });

        const todas = await faceapi
          .detectAllFaces(imgRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: CONFIANZA_DETECCION }))
          .withFaceLandmarks()
          .withFaceDescriptors();

        // Solo caras nítidas y de tamaño razonable
        const detecciones = todas.filter(d => d.detection.box.width >= TAMANO_MIN_ROSTRO);

        if (detecciones.length === 0) {
          const r = await reemplazarRostrosFoto(foto.id, []); // limpia etiquetas viejas erróneas
          setRostros(r.etiquetas || []);
          marcarAnalizada(foto.url);
          setEstado({ tipo: 'info', texto: 'Sin rostros claros detectados' });
          return;
        }

        const resultados = await reconocer(detecciones);

        // El servidor debe responder una vez por cada rostro
        if (resultados.length !== detecciones.length) {
          setEstado({ tipo: 'error', texto: 'No se pudo identificar: revisa el backend y la carpeta personas' });
          return;
        }

        // Filtro propio, más estricto que el del servidor
        const reconocidas = resultados
          .filter(r => r.reconocido && r.nombre && r.nombre !== 'Desconocido' && r.distancia <= DISTANCIA_MAX)
          .map(r => ({ nombre: r.nombre.toLowerCase(), score: r.score, distancia: r.distancia }));

        // Reemplaza lo anterior: si antes había una etiqueta errónea, desaparece
        const resp = await reemplazarRostrosFoto(foto.id, reconocidas);
        if (reconocidas.length > 0 && !resp.guardadas) {
          console.warn('[CarpetaDetalle] Etiquetas rechazadas por el servidor', foto.id);
          setEstado({ tipo: 'error', texto: 'El servidor no guardó las etiquetas de esta foto' });
          return;
        }
        setRostros(resp.etiquetas || []);

        if (reconocidas.length > 0) {
          marcarAnalizada(foto.url);
          setEstado({ tipo: 'ok', texto: '✓ ' + reconocidas.map(r => `${r.nombre} (dist. ${r.distancia})`).join(', ') });
        } else {
          // Rostros vistos pero sin coincidencia: NO se marca como analizada (se reintenta en la próxima visita)
          const mejor = Math.min(...resultados.map(r => r.distancia));
          setEstado({ tipo: 'info', texto: `${detecciones.length} rostro(s) sin coincidencia (mejor distancia ${mejor})` });
        }
      });
    } catch (err) {
      console.error('[CarpetaDetalle] Reconocimiento silencioso:', err);
      setEstado({ tipo: 'error', texto: 'Error: ' + (err.message || 'no se pudo analizar') });
    } finally {
      analizando.current = false;
    }
  }, [modelosListos, foto.id, foto.url, reconocer]);

  const quitarRostro = async (nombre) => {
    try {
      await quitarRostroFoto(foto.id, nombre);
      setRostros(prev => prev.filter(r => r.nombre !== nombre));
    } catch (err) {
      setEstado({ tipo: 'error', texto: 'No se pudo quitar la etiqueta' });
    }
  };

  // Caso: los modelos terminan de cargar DESPUÉS de que la imagen ya cargó
  useEffect(() => {
    const img = imgRef.current;
    if (modelosListos && img && img.complete && img.naturalWidth > 0) analizar();
  }, [modelosListos, analizar]);

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <img
          ref={imgRef}
          src={urlImagen(foto.url)}
          alt="Foto de la carpeta"
          crossOrigin="anonymous"
          onLoad={analizar}
          onClick={() => window.open(urlImagen(foto.url), '_blank')}
          style={{ width: '100%', height: isMobile ? '170px' : '220px', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
        />
        {errorReconocer && (
          <div style={{
            position: 'absolute', bottom: '8px', left: '8px',
            backgroundColor: 'rgba(220,38,38,0.85)', color: 'white',
            fontSize: '0.68rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px'
          }}>
            ⚠️ No se pudo analizar esta foto
          </div>
        )}
      </div>

      <button title="Etiquetar objetos" onClick={() => onObjetos(foto)}
        style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(0,38,64,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: isMobile ? '30px' : '34px', height: isMobile ? '30px' : '34px', cursor: 'pointer', fontSize: isMobile ? '14px' : '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        🏛️
      </button>
      <button title="Eliminar foto" onClick={() => onEliminar(foto.id)}
        style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: isMobile ? '26px' : '30px', height: isMobile ? '26px' : '30px', cursor: 'pointer', fontSize: isMobile ? '12px' : '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        ✕
      </button>

      {estado && !(estado.tipo === 'error' && errorReconocer) && (
        <div style={{
          padding: '6px 10px', fontSize: '0.7rem', fontWeight: 600, wordBreak: 'break-word',
          color: estado.tipo === 'ok' ? '#166534' : estado.tipo === 'error' ? '#b91c1c' : '#555',
          backgroundColor: estado.tipo === 'ok' ? '#dcfce7' : estado.tipo === 'error' ? '#fee2e2' : '#f3f4f6'
        }}>
          {estado.texto}
        </div>
      )}

      {rostros.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', padding: '8px 10px 0' }}>
          {rostros.map(r => (
            <span key={r.nombre} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: '0.7rem', padding: '3px 6px 3px 9px', borderRadius: '20px' }}>
              👤 <span style={{ textTransform: 'capitalize' }}>{r.nombre}</span>
              <button title="Quitar esta etiqueta (no es esta persona)" onClick={() => quitarRostro(r.nombre)}
                style={{ border: 'none', background: 'rgba(22,101,52,0.15)', color: '#166534', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', lineHeight: 1, cursor: 'pointer', padding: 0 }}>✕</button>
            </span>
          ))}
        </div>
      )}

      {foto.objetos && foto.objetos.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', padding: '8px 10px' }}>
          {foto.objetos.map(o => (
            <span key={o} style={{ backgroundColor: 'rgba(243,112,33,0.12)', color: '#c4570f', fontWeight: 700, fontSize: '0.7rem', padding: '3px 9px', borderRadius: '20px' }}>
              {iconoObjeto(o)} {o}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Vista principal ──────────────────────────────────────────────────────────
export default function CarpetaDetalle() {
  const { carpetaId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTiny = useIsMobile(480);
  const inputRef = useRef(null);

  const [carpeta, setCarpeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [modelosListos, setModelosListos] = useState(false);
  const [modalFoto, setModalFoto] = useState(null);
  const [claveAnalisis, setClaveAnalisis] = useState(0);
  const [backendCaido, setBackendCaido] = useState(false);

  // Healthcheck: ¿responde el endpoint de reconocimiento? (400 = existe; 404/red = problema)
  useEffect(() => {
    fetch(`${SERVER_URL}/api/reconocer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vectores: [] })
    }).then((res) => {
      if (res.status === 404) setBackendCaido(true);
    }).catch(() => setBackendCaido(true));
  }, []);

  useEffect(() => {
    cargarModelos()
      .then(() => setModelosListos(true))
      .catch((e) => console.error('[CarpetaDetalle] Los modelos no cargaron:', e));
  }, []);

  const cargar = useCallback(async (silencioso = false) => {
    if (!silencioso) setLoading(true);
    setError(null);
    try {
      const data = await getFotosPorCarpeta(carpetaId);
      setCarpeta(data);
    } catch (err) {
      setError(err.message || 'No se pudo cargar la carpeta. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  }, [carpetaId]);

  useEffect(() => { cargar(); }, [cargar]);

  const subirArchivos = async (e) => {
    const archivos = Array.from(e.target.files || []);
    e.target.value = '';
    if (archivos.length === 0) return;

    setSubiendo(true);
    setAviso(null);
    try {
      // El servidor acepta hasta 20 por envío
      for (let i = 0; i < archivos.length; i += 20) {
        await subirFotoACarpeta(carpetaId, archivos.slice(i, i + 20));
      }
      await cargar(true);
    } catch (err) {
      setAviso(err.message || 'Ocurrió un error al subir las fotos. Inténtalo de nuevo.');
      await cargar(true);
    } finally {
      setSubiendo(false);
    }
  };

  const eliminarFoto = useCallback(async (fotoId) => {
    if (!window.confirm('¿Eliminar esta foto?')) return;
    try {
      await eliminarFotoCarpeta(fotoId);
      await cargar(true);
    } catch (err) {
      setAviso('Error al eliminar la foto.');
    }
  }, [cargar]);

  const guardarObjetos = async (fotoId, objetos) => {
    await actualizarObjetosFoto(fotoId, objetos);
    setCarpeta(prev => ({
      ...prev,
      fotos: prev.fotos.map(f => f.id === fotoId ? { ...f, objetos } : f)
    }));
    setModalFoto(null);
  };

  const reanalizar = () => {
    if (!carpeta) return;
    olvidarAnalizadas(carpeta.fotos.map(f => f.url));
    setClaveAnalisis(k => k + 1); // remonta las celdas y vuelve a analizar
  };

  // ─── Estados de carga / error ───────────────────────────────────────────────
  if (loading) {
    return <div style={{ ...estiloFondoGaleria(isMobile), color: '#002640', fontWeight: 600 }}>Cargando...</div>;
  }

  if (error || !carpeta) {
    return (
      <div style={{ ...estiloFondoGaleria(isMobile), textAlign: 'center' }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '16px', padding: '30px', maxWidth: '500px', margin: '40px auto' }}>
          <h2 style={{ color: '#002640', marginTop: 0 }}>No se pudo abrir la carpeta</h2>
          <p style={{ color: '#c0392b' }}>{error}</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => navigate('/galeria-carpetas')} style={{ backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '30px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>← Volver</button>
            <button onClick={() => cargar()} style={{ backgroundColor: '#f37021', color: 'white', border: 'none', borderRadius: '30px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>Reintentar</button>
          </div>
        </div>
      </div>
    );
  }

  const fotos = carpeta.fotos || [];

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isTiny ? '1fr' : `repeat(auto-fill, minmax(${isMobile ? 150 : 240}px, 1fr))`,
    gap: isMobile ? '12px' : '22px'
  };

  return (
    <div style={estiloFondoGaleria(isMobile)}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* Banner */}
        <div style={{
          borderLeft: '5px solid #f37021', backgroundColor: 'white', borderRadius: '10px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)', padding: isMobile ? '14px' : '20px 24px',
          display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center',
          justifyContent: 'space-between', gap: '12px', marginBottom: isMobile ? '15px' : '28px',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, color: '#002640', fontWeight: 800, fontSize: isMobile ? '1.15rem' : '1.6rem', wordBreak: 'break-word' }}>
              📁 {carpeta.nombre}
            </h2>
            <p style={{ margin: '4px 0 0', color: '#f37021', fontWeight: 700, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
              {fotos.length} foto{fotos.length !== 1 ? 's' : ''}
            </p>
            {carpeta.descripcion && (
              <p style={{ margin: '4px 0 0', color: '#666', fontSize: '0.82rem' }}>{carpeta.descripcion}</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={subirArchivos} />
            <button onClick={() => inputRef.current && inputRef.current.click()} disabled={subiendo}
              style={{ backgroundColor: '#f37021', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 700, cursor: subiendo ? 'wait' : 'pointer', padding: isMobile ? '8px 14px' : '10px 20px', fontSize: isMobile ? '0.8rem' : '0.95rem', opacity: subiendo ? 0.7 : 1 }}>
              {subiendo ? 'Subiendo...' : '+ Subir fotos'}
            </button>
            {fotos.length > 0 && (
              <button onClick={reanalizar} title="Vuelve a buscar rostros conocidos en todas las fotos de esta carpeta"
                style={{ backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '30px', fontWeight: 700, cursor: 'pointer', padding: isMobile ? '8px 14px' : '10px 20px', fontSize: isMobile ? '0.8rem' : '0.95rem' }}>
                🔄 Re-analizar rostros
              </button>
            )}
            <button onClick={() => navigate('/galeria-carpetas')}
              style={{ backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '30px', fontWeight: 700, cursor: 'pointer', padding: isMobile ? '8px 14px' : '10px 20px', fontSize: isMobile ? '0.8rem' : '0.95rem' }}>
              ← Volver
            </button>
          </div>
        </div>

        {backendCaido && (
          <div style={{ backgroundColor: '#fee2e2', border: '2px solid #dc2626', borderRadius: '12px', padding: isMobile ? '12px 14px' : '16px 20px', marginBottom: '16px', color: '#991b1b', fontWeight: 700, fontSize: isMobile ? '0.85rem' : '1rem', lineHeight: 1.4 }}>
            ⚠️ El servidor de reconocimiento no responde en {SERVER_URL}/api/reconocer.
            <div style={{ fontWeight: 500, fontSize: '0.85rem', marginTop: '4px' }}>
              Revisa que el backend esté corriendo y que VITE_API_URL sea correcta.
            </div>
          </div>
        )}

        {aviso && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderLeft: '5px solid #c0392b', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <span style={{ color: '#c0392b', fontWeight: 600 }}>{aviso}</span>
            <button onClick={() => setAviso(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 700 }}>✕</button>
          </div>
        )}

        {fotos.length === 0 ? (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: '18px', padding: '40px 20px', textAlign: 'center', color: '#555' }}>
            <div style={{ fontSize: '3rem' }}>📷</div>
            <p style={{ margin: '8px 0 0' }}>Esta carpeta está vacía. Usa «+ Subir fotos» para agregar imágenes.</p>
          </div>
        ) : (
          <div style={gridStyle}>
            {fotos.map((foto) => (
              <CeldaFoto
                key={`${foto.id}-${claveAnalisis}`}
                foto={foto}
                modelosListos={modelosListos}
                onEliminar={eliminarFoto}
                onObjetos={setModalFoto}
              />
            ))}
          </div>
        )}
      </div>

      {modalFoto && (
        <ModalObjetos foto={modalFoto} onCerrar={() => setModalFoto(null)} onGuardar={guardarObjetos} />
      )}
    </div>
  );
}
