// src/pages/fases/frente/FrenteDetalle.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { datosFase2 } from '../Fase2';
import { getInformes, createInforme, deleteInforme } from '../../../api/informes';
import { useIsMobile } from '../../../hooks/useIsMobile';

export default function FrenteDetalle() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const isMobile   = useIsMobile();
  const [frente,      setFrente]      = useState(null);
  const [informes,    setInformes]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [showModal,   setShowModal]   = useState(false);
  const [nuevoInforme, setNuevoInforme] = useState({
    nombre: '', numero: '',
    fecha: new Date().toISOString().split('T')[0],
    enlaceCanva: ''
  });

  useEffect(() => {
    const frenteId  = parseInt(id);
    const encontrado = datosFase2.find(f => f.id === frenteId);
    if (encontrado) { setFrente(encontrado); cargarInformes(frenteId); }
    else navigate('/fase2');
  }, [id, navigate]);

  const cargarInformes = async (frenteId) => {
    setLoading(true); setError(null);
    try {
      const data = await getInformes({ tipo: 'frente', frente_id: frenteId });
      setInformes(data);
    } catch { setError('No se pudieron cargar los informes. Verifica que el servidor esté corriendo.'); }
    finally  { setLoading(false); }
  };

  const manejarCambio = (e) => setNuevoInforme({ ...nuevoInforme, [e.target.name]: e.target.value });

  const guardarRegistro = async (e) => {
    e.preventDefault();
    if (!nuevoInforme.enlaceCanva) { alert('El enlace es obligatorio.'); return; }
    const urlFinal = nuevoInforme.enlaceCanva.startsWith('http')
      ? nuevoInforme.enlaceCanva : `https://${nuevoInforme.enlaceCanva}`;
    try {
      await createInforme({ tipo: 'frente', frente_id: frente.id, ...nuevoInforme, enlaceCanva: urlFinal });
      setShowModal(false);
      setNuevoInforme({ nombre: '', numero: '', fecha: '', enlaceCanva: '' });
      await cargarInformes(frente.id);
    } catch { alert('Error al guardar el informe'); }
  };

  const eliminarInforme = async (idInforme) => {
    if (window.confirm('¿Desea eliminar el informe?')) {
      try { await deleteInforme(idInforme); await cargarInformes(frente.id); }
      catch { alert('Error al eliminar el informe'); }
    }
  };

  if (!frente)  return <div style={{ padding: '20px', color: 'white' }}>Cargando...</div>;
  if (loading)  return <div style={{ padding: '20px', color: 'white' }}>Cargando informes...</div>;
  if (error)    return (
    <div style={{ padding: '20px', color: '#ffcccc', textAlign: 'center' }}>
      {error}
      <button onClick={() => cargarInformes(frente.id)} style={{ marginLeft: '10px', padding: '5px 10px' }}>Reintentar</button>
    </div>
  );

  const fondoStyle = {
    background          : `linear-gradient(rgba(255,255,255,0.4),rgba(255,255,255,0.4)),url('/logos/FONDO.jpg')`,
    backgroundSize      : 'cover',
    backgroundPosition  : 'center',
    backgroundAttachment: isMobile ? 'scroll' : 'fixed',
    flex                : 1,
    padding             : isMobile ? '15px' : '30px',
    boxSizing           : 'border-box',
    minHeight           : 'calc(100vh - 80px)',
  };

  const inputStyle = {
    padding: '10px', borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '0.9rem', width: '100%', boxSizing: 'border-box', marginBottom: '12px',
  };

  return (
    <div style={fondoStyle}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Encabezado del frente */}
        <div className="frente-header" style={{
          borderLeft     : '5px solid #f37021',
          display        : 'flex',
          justifyContent : 'space-between',
          alignItems     : isMobile ? 'flex-start' : 'center',
          flexDirection  : isMobile ? 'column' : 'row',
          backgroundColor: 'white',
          padding        : isMobile ? '15px' : '20px',
          borderRadius   : '8px',
          boxShadow      : '0 2px 4px rgba(0,0,0,0.05)',
          marginBottom   : '20px',
          gap            : isMobile ? '12px' : '0',
        }}>
          <div style={{ flex: 1, marginRight: isMobile ? 0 : '20px' }}>
            <h2 style={{ margin: 0, color: '#002640', fontSize: isMobile ? '1rem' : '1.4rem', lineHeight: '1.2' }}>
              {frente.nombreCompleto}
            </h2>
            <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#666', fontWeight: 'bold' }}>
              FRENTE #{frente.id.toString().padStart(2, '0')}
            </p>
          </div>
          <button
            onClick={() => { setNuevoInforme(p => ({ ...p, fecha: new Date().toISOString().split('T')[0] })); setShowModal(true); }}
            style={{
              backgroundColor: '#005691', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: '5px', cursor: 'pointer',
              fontWeight: 'bold', fontSize: '0.9rem',
              width: isMobile ? '100%' : 'auto',
            }}>
            + Agregar Informe
          </button>
        </div>

        {/* Lista de informes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {informes.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#242424', marginTop: '50px' }}>No hay registros en este frente.</p>
          ) : informes.map((inf) => (
            <div key={inf.id} className="report-card" style={{
              backgroundColor: 'rgba(255,255,255,0.85)',
              backdropFilter : 'blur(5px)',
              padding        : '15px 20px',
              borderRadius   : '8px',
              border         : '1px solid rgba(0,0,0,0.1)',
              display        : 'flex',
              flexDirection  : isMobile ? 'column' : 'row',
              justifyContent : 'space-between',
              alignItems     : isMobile ? 'flex-start' : 'center',
              boxShadow      : '0 2px 5px rgba(0,0,0,0.05)',
              gap            : isMobile ? '10px' : '0',
              position       : 'relative',
            }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#005691', margin: '0 0 5px 0', fontSize: isMobile ? '0.95rem' : '1rem' }}>{inf.nombre}</h3>
                <div className="report-card-meta" style={{
                  display      : 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap          : isMobile ? '4px' : '20px',
                  fontSize     : '0.85rem',
                  color        : '#555',
                }}>
                  <span><strong>📅 Fecha:</strong> {inf.fecha}</span>
                  <span><strong># N° de Informe:</strong> {inf.numero}</span>
                </div>
              </div>
              <div className="report-card-actions" style={{
                display   : 'flex',
                alignItems: 'center',
                gap       : '10px',
                alignSelf : isMobile ? 'flex-end' : 'center',
              }}>
                <button
                  style={{ backgroundColor: '#00c4cc', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                  onClick={() => window.open(inf.enlaceCanva, '_blank')}>
                  🎨 Abrir enlace
                </button>
                <button
                  style={{ background: 'transparent', border: 'none', fontSize: '1rem', color: '#ff4444', cursor: 'pointer', padding: '0 4px' }}
                  onClick={() => eliminarInforme(inf.id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal agregar informe */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(4px)',
          padding: isMobile ? '15px' : '0',
          boxSizing: 'border-box',
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white', padding: isMobile ? '20px' : '30px',
            borderRadius: '15px', width: isMobile ? '100%' : '500px',
            maxWidth: '100%', boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#002640', borderBottom: '2px solid #f37021', paddingBottom: '8px' }}>
              📝 Nuevo Registro — Frente #{frente.id.toString().padStart(2, '0')}
            </h3>
            <form onSubmit={guardarRegistro} style={{ display: 'flex', flexDirection: 'column' }}>
              <input name="nombre" placeholder="Nombre del Informe" value={nuevoInforme.nombre} onChange={manejarCambio} required style={inputStyle} />
              <div className="modal-row" style={{ display: 'flex', gap: '10px', flexDirection: isMobile ? 'column' : 'row' }}>
                <input name="numero" placeholder="N° de Informe" value={nuevoInforme.numero} onChange={manejarCambio} required style={{ ...inputStyle, width: isMobile ? '100%' : '50%' }} />
                <input name="fecha" type="date" value={nuevoInforme.fecha} onChange={manejarCambio} required style={{ ...inputStyle, width: isMobile ? '100%' : '50%' }} />
              </div>
              <input name="enlaceCanva" placeholder="Enlace (Canva, Drive...)" value={nuevoInforme.enlaceCanva} onChange={manejarCambio} required style={inputStyle} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ backgroundColor: '#005691', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Guardar
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={{ backgroundColor: '#f1f1f1', color: '#666', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
