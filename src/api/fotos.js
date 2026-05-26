// src/api/fotos.js
import { API_BASE_URL } from './config';

export async function getFotosPorFrente(frenteId) {
  const res = await fetch(`${API_BASE_URL}/fotos/frente/${frenteId}`);
  if (!res.ok) throw new Error('Error al cargar fotos');
  return res.json();
}

export async function uploadFoto(frenteId, categoria, grupoId, archivo) {
  const formData = new FormData();
  formData.append('foto', archivo);
  formData.append('frenteId', frenteId);
  formData.append('categoria', categoria);
  formData.append('grupoId', grupoId);
  const res = await fetch(`${API_BASE_URL}/fotos/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Error al subir foto');
  return res.json();
}

export async function deleteFoto(id) {
  const res = await fetch(`${API_BASE_URL}/fotos/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al eliminar foto');
  }
  return res.json();
}

export async function crearGrupoVacio(frenteId) {
  const res = await fetch(`${API_BASE_URL}/fotos/grupo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ frenteId }),
  });
  if (!res.ok) throw new Error('Error al crear grupo vacío');
  return res.json();
}

export async function eliminarGrupoCompleto(frenteId, grupoId) {
  const res = await fetch(`${API_BASE_URL}/fotos/grupo/${frenteId}/${grupoId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar grupo');
  return res.json();
}