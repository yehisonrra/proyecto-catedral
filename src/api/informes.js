// src/api/informes.js
import { API_BASE_URL } from './config';

export async function getInformes(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/informes${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error('Error al cargar informes');
  return res.json();
}

export async function createInforme(data) {
  const res = await fetch(`${API_BASE_URL}/informes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear informe');
  return res.json();
}

export async function deleteInforme(id) {
  const res = await fetch(`${API_BASE_URL}/informes/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar informe');
  return res.json();
}