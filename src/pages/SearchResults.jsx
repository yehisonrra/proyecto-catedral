// src/pages/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getInformes } from '../api/informes';
import { datosFase2 } from './fases/Fase2';

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [resultados, setResultados] = useState({
    informes: [],
    frentes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setLoading(false);
      return;
    }
    const buscar = async () => {
      setLoading(true);
      setError(null);
      try {
        // Obtener todos los informes (sin filtros)
        const informes = await getInformes({});
        const term = query.toLowerCase();

        // Filtrar informes por nombre o número
        const informesFiltrados = informes.filter(inf =>
          inf.nombre.toLowerCase().includes(term) ||
          inf.numero.toLowerCase().includes(term)
        );

        // Filtrar frentes por nombre, id o descripción
        const frentesFiltrados = datosFase2.filter(frente =>
          frente.nombre.toLowerCase().includes(term) ||
          frente.id.toString().includes(term) ||
          frente.nombreCompleto.toLowerCase().includes(term)
        ).map(frente => ({
          ...frente,
          tipo: 'frente',
          link: `/fase2/frente/${frente.id}`
        }));

        setResultados({
          informes: informesFiltrados,
          frentes: frentesFiltrados
        });
      } catch (err) {
        console.error(err);
        setError('Error al realizar la búsqueda');
      } finally {
        setLoading(false);
      }
    };
    buscar();
  }, [query]);

  const fondoStyle = {
    background: `linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)), url('/logos/FONDO.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    flex: 1,
    padding: '30px',
    boxSizing: 'border-box',
    minHeight: 'calc(100vh - 80px)'
  };

  const tituloStyle = {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#002640',
    textAlign: 'center',
    marginBottom: '20px'
  };

  const seccionStyle = {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '30px'
  };

  const subtituloStyle = {
    fontSize: '1.3rem',
    color: '#f37021',
    borderBottom: '2px solid #f37021',
    paddingBottom: '5px',
    marginBottom: '15px'
  };

  const cardStyle = {
    borderBottom: '1px solid #eee',
    padding: '10px 0',
    cursor: 'pointer',
    transition: 'background 0.2s'
  };

  const renderInformes = () => {
    const informes = resultados.informes;
    if (informes.length === 0) return <p>No se encontraron informes.</p>;
    return informes.map(inf => (
      <div
        key={inf.id}
        style={cardStyle}
        onClick={() => {
          if (inf.tipo === 'frente') {
            navigate(`/fase2/frente/${inf.frente_id}`);
          } else if (inf.tipo === 'especiales') {
            navigate('/informes/especiales');
          } else if (inf.tipo === 'divulgacion') {
            navigate('/informes/divulgacion');
          } else if (inf.tipo === 'avance') {
            navigate('/informes/avance');
          } else if (inf.tipo === 'recorridos') {
            navigate(`/informes/recorridos/${inf.subtipo}`);
          } else if (inf.tipo === 'utilitarios') {
            navigate(`/informes/utilitarios/${inf.subtipo}`);
          } else {
            navigate(`/fase2/frente/${inf.frente_id}`);
          }
        }}
      >
        <div><strong>{inf.nombre}</strong> (N° {inf.numero})</div>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>
          📅 {inf.fecha} | Tipo: {inf.tipo} {inf.subtipo && `- ${inf.subtipo}`}
        </div>
      </div>
    ));
  };

  const renderFrentes = () => {
    const frentes = resultados.frentes;
    if (frentes.length === 0) return <p>No se encontraron frentes.</p>;
    return frentes.map(frente => (
      <div
        key={frente.id}
        style={cardStyle}
        onClick={() => navigate(`/fase2/frente/${frente.id}`)}
      >
        <div><strong>FRENTE #{frente.id}</strong> - {frente.nombre}</div>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>{frente.nombreCompleto}</div>
      </div>
    ));
  };

  return (
    <div style={fondoStyle}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={tituloStyle}>
          Resultados para: <span style={{ color: '#f37021' }}>"{query}"</span>
        </h1>
        {loading && <p style={{ textAlign: 'center' }}>Buscando...</p>}
        {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <>
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
        {!loading && !error && resultados.informes.length === 0 && resultados.frentes.length === 0 && (
          <p style={{ textAlign: 'center' }}>No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
}