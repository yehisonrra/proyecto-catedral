// src/api/carpetas.js
// Cliente de la sección "Galería por Carpetas".
// Estas rutas viven en la RAÍZ del servidor (/carpetas, /fotos, /rostros, /objetos),
// no bajo /api, por eso aquí se quita un posible "/api" final de VITE_API_URL.

export const SERVER_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001')
  .replace(/\/+api\/?$/, '')   // quita "/api" o "/api/" del final
  .replace(/\/+$/, '');         // quita barras sobrantes

export const OBJETOS_PREDEFINIDOS = [
  'Puertas', 'Cúpulas', 'Ventanas', 'Columnas', 'Cornisas',
  'Esculturas', 'Vitrales', 'Fachadas', 'Techos', 'Pisos',
  'Arcadas', 'Torres', 'Campanarios', 'Altares', 'Retablos'
];

export const ICONOS_OBJETOS = {
  Puertas: '🚪', Cúpulas: '🏛️', Ventanas: '🪟', Columnas: '🧱', Cornisas: '📐',
  Esculturas: '🗿', Vitrales: '🎨', Fachadas: '🏢', Techos: '🏠', Pisos: '🔲',
  Arcadas: '🌉', Torres: '🗼', Campanarios: '🔔', Altares: '🕯️', Retablos: '🖼️'
};

export function iconoObjeto(nombre) {
  return ICONOS_OBJETOS[nombre] || '🏷️';
}

// Convierte "/uploads/carpetas/x.jpg" en una URL completa del servidor
export function urlImagen(ruta) {
  if (!ruta) return null;
  return /^https?:\/\//i.test(ruta) ? ruta : `${SERVER_URL}${ruta}`;
}

// Fondo general de la sección (mismo patrón visual que el resto de la app)
export function estiloFondoGaleria(isMobile) {
  return {
    backgroundImage: `linear-gradient(rgba(255,255,255,0.45),rgba(255,255,255,0.45)), url('/logos/FONDO.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: isMobile ? 'scroll' : 'fixed', // "fixed" falla en iOS
    flex: 1,
    padding: isMobile ? '15px' : '30px',
    boxSizing: 'border-box',
    minHeight: 'calc(100vh - 80px)'
  };
}

// ─── Petición genérica con manejo de errores ─────────────────────────────────
async function pedir(ruta, opciones) {
  const res = await fetch(`${SERVER_URL}${ruta}`, opciones);
  if (!res.ok) {
    const cuerpo = await res.json().catch(() => ({}));
    throw new Error(cuerpo.error || `Error ${res.status}`);
  }
  return res.json();
}

const JSON_HEADERS = { 'Content-Type': 'application/json' };

// ─── Carpetas ─────────────────────────────────────────────────────────────────
export function getCarpetas() {
  return pedir('/carpetas');
}

export function crearCarpeta({ nombre, descripcion }) {
  return pedir('/carpetas', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ nombre, descripcion })
  });
}

export function eliminarCarpeta(id) {
  return pedir(`/carpetas/${id}`, { method: 'DELETE' });
}

export function getFotosPorCarpeta(id) {
  return pedir(`/carpetas/${id}/fotos`);
}

// `archivo` puede ser un File o un arreglo de File (el servidor acepta hasta 20 por envío)
export function subirFotoACarpeta(id, archivo) {
  const formData = new FormData();
  const lista = Array.isArray(archivo) ? archivo : [archivo];
  lista.forEach(a => formData.append('foto', a));
  return pedir(`/carpetas/${id}/fotos`, { method: 'POST', body: formData });
}

// ─── Fotos de carpeta ─────────────────────────────────────────────────────────
export function eliminarFotoCarpeta(fotoId) {
  return pedir(`/fotos/${fotoId}`, { method: 'DELETE' });
}

export function actualizarObjetosFoto(fotoId, objetos) {
  return pedir(`/fotos/${fotoId}/objetos`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify({ objetos })
  });
}

// etiquetas: [{ nombre, score }]  (rostros reconocidos)
export function guardarEtiquetasFoto(fotoId, etiquetas) {
  return pedir(`/fotos/${fotoId}/etiquetas`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ etiquetas })
  });
}

// Reemplaza TODOS los rostros de la foto (lista vacía = sin rostros)
export function reemplazarRostrosFoto(fotoId, etiquetas) {
  return pedir(`/fotos/${fotoId}/rostros`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify({ etiquetas })
  });
}

// Quita un rostro mal etiquetado
export function quitarRostroFoto(fotoId, nombre) {
  return pedir(`/fotos/${fotoId}/etiquetas/${encodeURIComponent(nombre)}`, { method: 'DELETE' });
}

// ─── Rostros ──────────────────────────────────────────────────────────────────
export function getRostros() {
  return pedir('/rostros');
}

// nombreEncoded = encodeURIComponent(nombre)
export function getFotosPorRostro(nombreEncoded) {
  return pedir(`/rostros/${nombreEncoded}/fotos`);
}

export function renombrarRostro(nombreEncoded, nuevoNombre) {
  return pedir(`/rostros/${nombreEncoded}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify({ nombre: nuevoNombre })
  });
}

// ─── Objetos ──────────────────────────────────────────────────────────────────
export function getObjetos() {
  return pedir('/objetos');
}

export function getFotosPorObjeto(nombreEncoded) {
  return pedir(`/objetos/${nombreEncoded}/fotos`);
}

// Buscador inteligente: busca por rostro, objeto o nombre de carpeta
export function buscarEnGaleria(texto) {
  return pedir(`/galeria-buscar?q=${encodeURIComponent(texto)}`);
}