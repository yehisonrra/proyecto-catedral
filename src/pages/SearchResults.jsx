// src/pages/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getInformes } from '../api/informes';
import { datosFase2 } from './fases/Fase2';

const API_URL = 'http://localhost:3001';

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q') || '';

  const [resultados, setResultados] = useState({ informes: [], frentes: [], fotos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) { setLoading(false); return; }

    const buscar = async () => {
      setLoading(true);
      setError(null);
      try {
        const term = query.toLowerCase();

        // ── Informes ──────────────────────────────────────────────────────────
        const informes = await getInformes({});
        const informesFiltrados = informes.filter(inf =>
          inf.nombre.toLowerCase().includes(term) ||
          inf.numero.toLowerCase().includes(term)
        );

        // ── Frentes ───────────────────────────────────────────────────────────
        const frentesFiltrados = datosFase2.filter(frente =>
          frente.nombre.toLowerCase().includes(term) ||
          frente.id.toString().includes(term) ||
          frente.nombreCompleto.toLowerCase().includes(term)
        ).map(frente => ({ ...frente, tipo: 'frente', link: `/fase2/frente/${frente.id}` }));

        // ── Fotos por persona reconocida ──────────────────────────────────────
        let fotosFiltradas = [];
        try {
          const res = await fetch(`${API_URL}/api/fotos/buscar-personas?q=${encodeURIComponent(query.trim())}`);
          if (res.ok) {
            const data = await res.json();
            fotosFiltradas = data.fotos || [];
          }
        } catch (e) {
          console.warn('[SearchResults] No se pudo buscar fotos por persona:', e);
        }

        setResultados({ informes: informesFiltrados, frentes: frentesFiltrados, fotos: fotosFiltradas });
      } catch (err) {
        console.error(err);
        setError('Error al realizar la búsqueda');
      } finally {
        setLoading(false);
      }
    };

    buscar();
  }, [query]);

  // ── Estilos ────────────────────────────────────────────────────────────────
  const fondoStyle = {
    background: `linear-gradient(rgba(255,255,255,0.4),rgba(255,255,255,0.4)),url('/logos/FONDO.jpg')`,
    backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
    flex: 1, padding: '30px', boxSizing: 'border-box', minHeight: 'calc(100vh - 80px)'
  };
  const tituloStyle = { fontSize: '1.8rem', fontWeight: 'bold', color: '#002640', textAlign: 'center', marginBottom: '20px' };
  const seccionStyle = { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '16px', padding: '20px', marginBottom: '30px' };
  const subtituloStyle = { fontSize: '1.3rem', color: '#f37021', borderBottom: '2px solid #f37021', paddingBottom: '5px', marginBottom: '15px' };
  const cardStyle = { borderBottom: '1px solid #eee', padding: '10px 0', cursor: 'pointer', transition: 'background 0.2s' };

  const renderInformes = () => {
    if (resultados.informes.length === 0) return <p style={{ color: '#666' }}>No se encontraron informes.</p>;
    return resultados.informes.map(inf => (
      <div key={inf.id} style={cardStyle}
        onClick={() => {
          if (inf.tipo === 'frente') navigate(`/fase2/frente/${inf.frente_id}`);
          else if (inf.tipo === 'especiales') navigate('/informes/especiales');
          else if (inf.tipo === 'divulgacion') navigate('/informes/divulgacion');
          else if (inf.tipo === 'avance') navigate('/informes/avance');
          else if (inf.tipo === 'recorridos') navigate(`/informes/recorridos/${inf.subtipo}`);
          else if (inf.tipo === 'utilitarios') navigate(`/informes/utilitarios/${inf.subtipo}`);
          else navigate(`/fase2/frente/${inf.frente_id}`);
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div><strong>{inf.nombre}</strong> (N° {inf.numero})</div>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>📅 {inf.fecha} | Tipo: {inf.tipo} {inf.subtipo && `- ${inf.subtipo}`}</div>
      </div>
    ));
  };

  const renderFrentes = () => {
    if (resultados.frentes.length === 0) return <p style={{ color: '#666' }}>No se encontraron frentes.</p>;
    return resultados.frentes.map(frente => (
      <div key={frente.id} style={cardStyle}
        onClick={() => navigate(`/fase2/frente/${frente.id}`)}
        onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div><strong>FRENTE #{frente.id}</strong> - {frente.nombre}</div>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>{frente.nombreCompleto}</div>
      </div>
    ));
  };

  const renderFotos = () => {
    const fotos = resultados.fotos;
    if (fotos.length === 0) return <p style={{ color: '#666' }}>No se encontraron fotos con esa persona.</p>;

    return (
      <>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '12px' }}>
          {fotos.length} foto{fotos.length !== 1 ? 's' : ''} donde aparece <strong style={{ color: '#f37021' }}>{query}</strong>
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {fotos.map((foto, i) => (
            <div
              key={i}
              onClick={() => navigate(foto.linkGaleria)}
              style={{
                cursor: 'pointer', borderRadius: '10px', overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                background: 'white'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)'; }}
            >
              <img
                src={`${API_URL}${foto.url}`}
                alt={`Foto frente ${foto.frenteId}`}
                style={{ width: '100%', height: '110px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '8px 10px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#002640' }}>
                  Frente #{foto.frenteId}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#666', marginTop: '2px' }}>
                  {foto.categoria.charAt(0).toUpperCase() + foto.categoria.slice(1)}
                </div>
                <div style={{
                  marginTop: '5px', display: 'inline-block',
                  padding: '2px 7px', borderRadius: '20px',
                  fontSize: '0.7rem', fontWeight: '600',
                  background: '#dcfce7', color: '#166534',
                  border: '1px solid #86efac'
                }}>
                  ✓ {foto.persona} {foto.score}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const totalResultados = resultados.informes.length + resultados.frentes.length + resultados.fotos.length;

  return (
    <div style={fondoStyle}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={tituloStyle}>
          Resultados para: <span style={{ color: '#f37021' }}>"{query}"</span>
        </h1>

        {loading && <p style={{ textAlign: 'center', color: '#fff' }}>Buscando...</p>}
        {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <>
            {/* Sección fotos por persona — aparece primero si hay resultados */}
            {resultados.fotos.length > 0 && (
              <div style={seccionStyle}>
                <h2 style={subtituloStyle}>👤 Fotos con "{query}"</h2>
                {renderFotos()}
              </div>
            )}

            <div style={seccionStyle}>
              <h2 style={subtituloStyle}>📄 Informes</h2>
              {renderInformes()}
            </div>

            <div style={seccionStyle}>
              <h2 style={subtituloStyle}>🏗️ Frentes de trabajo</h2>
              {renderFrentes()}
            </div>
          </>
        )}

        {!loading && !error && totalResultados === 0 && (
          <div style={{ ...seccionStyle, textAlign: 'center', color: '#555' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔍</div>
            <p>No se encontraron resultados para <strong>"{query}"</strong>.</p>
            <p style={{ fontSize: '0.9rem', color: '#888' }}>
              Si buscas una persona, asegúrate de haber abierto la galería para que el sistema la reconozca primero.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
