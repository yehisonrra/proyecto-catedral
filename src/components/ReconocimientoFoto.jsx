// src/components/ReconocimientoFoto.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useReconocimiento } from '../hooks/useReconocimiento';

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

export default function ReconocimientoFoto({ imagenUrl, estilo = {} }) {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [etiquetas, setEtiquetas] = useState([]);
  const [analizando, setAnalizando] = useState(false);
  const [modelosListos, setModelosListos] = useState(false);
  const [errorModelos, setErrorModelos] = useState(false);
  const { reconocer } = useReconocimiento();

  useEffect(() => {
    cargarModelos()
      .then(() => setModelosListos(true))
      .catch((e) => {
        console.error('[ReconocimientoFoto] Error cargando modelos:', e);
        setErrorModelos(true);
      });
  }, []);

  const analizarImagen = async () => {
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
        setEtiquetas([{ nombre: 'Sin rostros detectados', reconocido: false, score: 0 }]);
        setAnalizando(false);
        return;
      }

      const dims = faceapi.matchDimensions(canvas, img, true);
      const resized = faceapi.resizeResults(detecciones, dims);

      const resultados = await reconocer(detecciones);

      resized.forEach((det, i) => {
        const box = det.detection.box;
        const resultado = resultados[i] || { nombre: '?', score: 0, reconocido: false };
        const color = resultado.reconocido ? '#22c55e' : '#f97316';
        const label = resultado.reconocido
          ? `${resultado.nombre} (${resultado.score}%)`
          : 'Desconocido';

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);

        ctx.font = 'bold 12px Poppins, sans-serif';
        const textWidth = ctx.measureText(label).width + 10;
        ctx.fillStyle = color;
        ctx.fillRect(box.x, box.y - 22, textWidth, 20);
        ctx.fillStyle = 'white';
        ctx.fillText(label, box.x + 5, box.y - 7);
      });

      setEtiquetas(resultados);
    } catch (err) {
      console.error('[ReconocimientoFoto] Error al analizar:', err);
    } finally {
      setAnalizando(false);
    }
  };

  return (
    <div>
      {/* Imagen con canvas superpuesto */}
      <div style={{ position: 'relative', display: 'inline-block', ...estilo }}>
        <img
          ref={imgRef}
          src={imagenUrl}
          alt="Foto"
          crossOrigin="anonymous"
          style={{ display: 'block', width: '100%', height: 'auto', borderRadius: '8px' }}
          onLoad={() => { if (modelosListos) analizarImagen(); }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Botón analizar */}
      {errorModelos ? (
        <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>
          ⚠️ No se encontraron los modelos en /public/models/
        </p>
      ) : (
        <button
          onClick={analizarImagen}
          disabled={analizando || !modelosListos}
          style={{
            marginTop: '8px',
            padding: '6px 14px',
            background: analizando ? '#94a3b8' : '#f37021',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: analizando ? 'not-allowed' : 'pointer',
            fontSize: '0.8rem',
            fontWeight: '600',
            fontFamily: 'Poppins, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {!modelosListos ? '⏳ Cargando modelos...' : analizando ? '⏳ Analizando...' : '🔍 Reconocer personas'}
        </button>
      )}

      {/* Etiquetas resultado */}
      {etiquetas.length > 0 && (
        <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {etiquetas.map((e, i) => (
            <span
              key={i}
              style={{
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: '600',
                fontFamily: 'Poppins, sans-serif',
                background: e.reconocido ? '#dcfce7' : '#fff7ed',
                color: e.reconocido ? '#166534' : '#c2410c',
                border: `1px solid ${e.reconocido ? '#86efac' : '#fed7aa'}`
              }}
            >
              {e.reconocido ? `✓ ${e.nombre} ${e.score}%` : `✗ ${e.nombre}`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
