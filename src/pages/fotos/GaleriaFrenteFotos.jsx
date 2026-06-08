// src/pages/fotos/GaleriaFrenteFotos.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import { datosFase2 } from '../fases/Fase2';
import { getFotosPorFrente, uploadFoto, deleteFoto, crearGrupoVacio, eliminarGrupoCompleto } from '../../api/fotos';
import * as faceapi from 'face-api.js';

// ─── Carga de modelos (una sola vez global) ───────────────────────────────────
const MODELS_URL = '/models';
let modelosCargados = false;

async function cargarModelos() {
  if (modelosCargados) return;
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URL),
  ]);
  modelosCargados = true;
}

const API_URL = 'http://localhost:3001';

// ─── Subcomponente: foto con reconocimiento facial integrado ──────────────────
function CeldaConFoto({ foto, onEliminar, modelosListos }) {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [etiquetas, setEtiquetas] = useState([]);
  const [analizando, setAnalizando] = useState(false);

  const analizarImagen = useCallback(async () => {
    if (!modelosListos || !imgRef.current) return;
    setAnalizando(true);
    setEtiquetas([]);

    try {
      const img = imgRef.current;

      const detecciones = await faceapi
        .detectAllFaces(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptors();

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detecciones.length === 0) {
        setAnalizando(false);
        return;
      }

      // Convertir Float32Array → Array normal para enviar al backend
      const vectores = detecciones.map(d => Array.from(d.descriptor));

      const res = await fetch(`${API_URL}/api/reconocer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vectores })
      });

      const data = await res.json();
      const resultados = data.identificados || [];

      // Dibujar cajas y nombres sobre el canvas
      const dims = faceapi.matchDimensions(canvas, img, true);
      const resized = faceapi.resizeResults(detecciones, dims);

      resized.forEach((det, i) => {
        const box = det.detection.box;
        const r = resultados[i] || { nombre: '?', score: 0, reconocido: false };
        const color = r.reconocido ? '#22c55e' : '#f97316';
        const label = r.reconocido ? `${r.nombre} (${r.score}%)` : 'Desconocido';

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);

        ctx.font = 'bold 12px Poppins, sans-serif';
        const tw = ctx.measureText(label).width + 10;
        ctx.fillStyle = color;
        ctx.fillRect(box.x, box.y - 22, tw, 20);
        ctx.fillStyle = 'white';
        ctx.fillText(label, box.x + 5, box.y - 7);
      });

      setEtiquetas(resultados);
    } catch (err) {
      console.error('[Reconocimiento] Error:', err);
    } finally {
      setAnalizando(false);
    }
  }, [modelosListos]);

  return (
    <div style={{ width: '100%' }}>
      {/* Imagen + canvas superpuesto */}
      <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <img
          ref={imgRef}
          src={`${API_URL}${foto.url}`}
          alt="foto"
          crossOrigin="anonymous"
          style={{ width: '100%', height: 'auto', maxHeight: '350px', objectFit: 'cover', display: 'block' }}
          onClick={() => window.open(`${API_URL}${foto.url}`, '_blank')}
          onLoad={() => { if (modelosListos) analizarImagen(); }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        />
        {/* Botón eliminar */}
        <button
          style={{
            position: 'absolute', top: '8px', right: '8px',
            backgroundColor: 'rgba(0,0,0,0.6)', color: 'white',
            border: 'none', borderRadius: '50%', width: '28px', height: '28px',
            cursor: 'pointer', fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => onEliminar(foto.id)}
        >✕</button>
      </div>

      {/* Botón reconocer */}
      <button
        onClick={analizarImagen}
        disabled={analizando || !modelosListos}
        style={{
          marginTop: '8px',
          width: '100%',
          padding: '7px 0',
          background: analizando ? '#94a3b8' : '#f37021',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          cursor: analizando ? 'not-allowed' : 'pointer',
          fontSize: '0.78rem',
          fontWeight: '600',
          fontFamily: 'Poppins, sans-serif',
          transition: 'background 0.2s'
        }}
      >
        {!modelosListos ? '⏳ Cargando IA...' : analizando ? '⏳ Analizando...' : '🔍 Reconocer personas'}
      </button>

      {/* Etiquetas resultado */}
      {etiquetas.length > 0 && (
        <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {etiquetas.map((e, i) => (
            <span key={i} style={{
              padding: '3px 9px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600',
              fontFamily: 'Poppins, sans-serif',
              background: e.reconocido ? '#dcfce7' : '#fff7ed',
              color: e.reconocido ? '#166534' : '#c2410c',
              border: `1px solid ${e.reconocido ? '#86efac' : '#fed7aa'}`
            }}>
              {e.reconocido ? `✓ ${e.nombre} ${e.score}%` : '✗ Desconocido'}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function GaleriaFrenteFotos() {
  const { frenteId } = useParams();
  const navigate = useNavigate();
  const [frente, setFrente] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modelosListos, setModelosListos] = useState(false);

  // Cargar modelos face-api.js al montar
  useEffect(() => {
    cargarModelos()
      .then(() => setModelosListos(true))
      .catch(e => console.error('[GaleriaFrenteFotos] Modelos no cargaron:', e));
  }, []);

  useEffect(() => {
    const id = parseInt(frenteId);
    const encontrado = datosFase2.find(f => f.id === id);
    if (encontrado) {
      setFrente(encontrado);
      cargarGrupos(id);
    } else {
      navigate('/banco-fotos/plan2/frentes');
    }
  }, [frenteId, navigate]);

  const cargarGrupos = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFotosPorFrente(id);
      setGrupos(data);
    } catch (err) {
      console.error('Error al cargar fotos:', err);
      setError('No se pudieron cargar las fotos. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const subirFotoAGrupo = useCallback(async (groupId, categoria, archivo) => {
    if (!archivo || !frente) return;
    try {
      await uploadFoto(frente.id, categoria, groupId, archivo);
      await cargarGrupos(frente.id);
    } catch (err) {
      console.error('Error al subir foto:', err);
      setError('Ocurrió un error al guardar la foto. Inténtalo de nuevo.');
    }
  }, [frente]);

  const eliminarFoto = useCallback(async (fotoId) => {
    if (window.confirm('¿Eliminar esta foto?')) {
      try {
        await deleteFoto(fotoId);
        await cargarGrupos(frente.id);
      } catch (err) {
        console.error('Error al eliminar foto:', err);
        setError('Error al eliminar la foto.');
      }
    }
  }, [frente]);

  const eliminarGrupo = useCallback(async (groupId) => {
    if (window.confirm('¿Eliminar todo este set de fotos (antes, durante, después)? Esta acción no se puede deshacer.')) {
      try {
        await eliminarGrupoCompleto(frente.id, groupId);
        await cargarGrupos(frente.id);
      } catch (err) {
        console.error('Error al eliminar grupo:', err);
        setError('Error al eliminar el grupo.');
      }
    }
  }, [frente, cargarGrupos]);

  const agregarNuevoSet = async () => {
    try {
      await crearGrupoVacio(frente.id);
      await cargarGrupos(frente.id);
    } catch (err) {
      console.error('Error al crear nuevo set:', err);
      setError('No se pudo crear el nuevo set. Verifica el servidor.');
    }
  };

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#fff', background: '#000000aa' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} style={{ padding: '8px 16px', background: '#f37021', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Recargar página
        </button>
      </div>
    );
  }

  if (!frente || loading) return <div style={{ padding: '20px', color: 'white' }}>Cargando...</div>;

  // ─── Estilos (sin cambios respecto al original) ───────────────────────────
  const containerStyle = {
    background: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url('/logos/FONDO.jpg')`,
    backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
    flex: 1, padding: '30px', boxSizing: 'border-box', minHeight: 'calc(100vh - 80px)'
  };
  const bannerStyle = {
    borderLeft: '5px solid #f37021', paddingLeft: '15px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'white', padding: '20px', borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '30px'
  };
  const grupoContainerStyle = { position: 'relative', marginBottom: '40px' };
  const grupoRowStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' };
  const celdaStyle = {
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '20px', padding: '20px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', minHeight: '300px'
  };
  const emptyFrameStyle = { textAlign: 'center', width: '100%', padding: '20px' };
  const emptyButtonStyle = {
    backgroundColor: '#f37021', color: 'white', border: 'none', padding: '12px 20px',
    borderRadius: '40px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginTop: '15px'
  };
  const categoriaTituloStyle = {
    fontSize: '1.5rem', fontWeight: 'bold', color: '#002640', marginBottom: '10px', textAlign: 'center'
  };
  const deleteGroupButtonStyle = {
    position: 'absolute', top: '-15px', right: '-10px', backgroundColor: '#ff4444', color: 'white',
    border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer',
    fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)', transition: 'transform 0.2s', zIndex: 2
  };

  const MarcoVacio = ({ groupId, categoria, onSubir }) => {
    const inputRef = useRef(null);
    const handleFileChange = (e) => {
      if (e.target.files[0]) {
        onSubir(groupId, categoria, e.target.files[0]);
        e.target.value = '';
      }
    };
    return (
      <div style={emptyFrameStyle}>
        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📷</div>
        <button style={emptyButtonStyle} onClick={() => inputRef.current.click()}>+ Subir foto</button>
        <input type="file" ref={inputRef} accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <SearchBar />

      {/* Indicador estado modelos IA */}
      {!modelosListos && (
        <div style={{
          background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px',
          padding: '10px 16px', marginBottom: '16px', fontSize: '0.85rem',
          color: '#856404', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          ⏳ Cargando modelos de reconocimiento facial...
        </div>
      )}
      {modelosListos && (
        <div style={{
          background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '8px',
          padding: '10px 16px', marginBottom: '16px', fontSize: '0.85rem',
          color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          ✅ Reconocimiento facial listo
        </div>
      )}

      <div style={bannerStyle}>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: '#002640', fontSize: '1.4rem' }}>{frente.nombreCompleto}</h2>
          <p style={{ margin: '5px 0 0', color: '#f37021', fontWeight: 'bold' }}>FRENTE #{frente.id.toString().padStart(2, '0')}</p>
        </div>
        <button onClick={() => navigate('/banco-fotos/plan2/frentes')} style={{ backgroundColor: '#ddd', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>
          ← Volver
        </button>
      </div>

      {grupos.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '60px', color: '#fff', textShadow: '1px 1px 2px black' }}>
          <p>No hay grupos de fotos. Agrega tu primera foto en cualquier columna.</p>
        </div>
      )}

      {grupos.map((grupo) => (
        <div key={grupo.id} style={grupoContainerStyle}>
          <button style={deleteGroupButtonStyle} onClick={() => eliminarGrupo(grupo.id)}>🗑️</button>
          <div style={grupoRowStyle}>
            {/* ANTES */}
            <div style={celdaStyle}>
              <div style={categoriaTituloStyle}>📸 ANTES</div>
              {grupo.antes
                ? <CeldaConFoto foto={grupo.antes} onEliminar={eliminarFoto} modelosListos={modelosListos} />
                : <MarcoVacio groupId={grupo.id} categoria="antes" onSubir={subirFotoAGrupo} />}
            </div>
            {/* DURANTE */}
            <div style={celdaStyle}>
              <div style={categoriaTituloStyle}>🛠️ DURANTE</div>
              {grupo.durante
                ? <CeldaConFoto foto={grupo.durante} onEliminar={eliminarFoto} modelosListos={modelosListos} />
                : <MarcoVacio groupId={grupo.id} categoria="durante" onSubir={subirFotoAGrupo} />}
            </div>
            {/* DESPUÉS */}
            <div style={celdaStyle}>
              <div style={categoriaTituloStyle}>✨ DESPUÉS</div>
              {grupo.despues
                ? <CeldaConFoto foto={grupo.despues} onEliminar={eliminarFoto} modelosListos={modelosListos} />
                : <MarcoVacio groupId={grupo.id} categoria="despues" onSubir={subirFotoAGrupo} />}
            </div>
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={agregarNuevoSet}
          style={{
            backgroundColor: 'rgba(0,86,145,0.8)', color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '40px', fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          + Agregar nuevo set de fotos
        </button>
      </div>
    </div>
  );
}
