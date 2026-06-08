// src/hooks/useReconocimiento.js
import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Hook para reconocimiento facial.
 * Recibe descriptores de face-api.js y devuelve nombres identificados.
 *
 * Uso:
 *   const { reconocer, cargando, error } = useReconocimiento();
 *   const resultados = await reconocer(detecciones); // detecciones de face-api
 *
 * Retorna array de: [{ nombre, score, reconocido, distancia }, ...]
 */
export function useReconocimiento() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const reconocer = useCallback(async (detecciones) => {
    if (!detecciones || detecciones.length === 0) return [];

    setCargando(true);
    setError(null);

    try {
      // face-api.js devuelve descriptor como Float32Array → convertir a Array normal
      const vectores = detecciones.map(d => {
        const descriptor = d.descriptor ?? d;
        return descriptor instanceof Float32Array
          ? Array.from(descriptor)
          : descriptor;
      });

      const res = await fetch(`${API_URL}/api/reconocer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vectores })
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Error ${res.status}: ${msg}`);
      }

      const data = await res.json();
      return data.identificados || [];

    } catch (err) {
      console.error('[useReconocimiento]', err);
      setError(err.message);
      return [];
    } finally {
      setCargando(false);
    }
  }, []);

  return { reconocer, cargando, error };
}