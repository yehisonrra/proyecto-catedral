// src/pages/galeria/GaleriaCarpetas.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import { getCarpetas, crearCarpeta, eliminarCarpeta, urlImagen, estiloFondoGaleria } from '../../api/carpetas';

// ─── Modal: nueva carpeta ─────────────────────────────────────────────────────
function ModalNuevaCarpeta({ onCerrar, onCrear }) {
  const isMobile = useIsMobile();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState(null);

  const enviar = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) { setErrorModal('El nombre es obligatorio.'); return; }
    setGuardando(true);
    setErrorModal(null);
    try {
      await onCrear({ nombre: nombre.trim(), descripcion: descripcion.trim() });
    } catch (err) {
      setErrorModal(err.message || 'No se pudo crear la carpeta.');
      setGuardando(false);
    }
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px',
    border: '1px solid #ccd', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', color: '#333'
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
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={enviar}
        style={{
          backgroundColor: 'white', borderRadius: '20px', padding: isMobile ? '20px' : '30px',
          width: '100%', maxWidth: '460px', boxShadow: '0 20px 50px rgba(0,0,0,0.35)'
        }}
      >
        <h2 style={{ margin: '0 0 18px', color: '#002640', fontWeight: 800, fontSize: isMobile ? '1.2rem' : '1.4rem', borderLeft: '5px solid #f37021', paddingLeft: '12px' }}>
          Nueva carpeta
        </h2>

        <label style={{ display: 'block', fontWeight: 700, color: '#002640', fontSize: '0.85rem', marginBottom: '6px' }}>Nombre *</label>
        <input
          autoFocus
          type="text"
          value={nombre}
          maxLength={80}
          placeholder="Ej: Fachada principal"
          onChange={(e) => setNombre(e.target.value)}
          style={inputStyle}
        />

        <label style={{ display: 'block', fontWeight: 700, color: '#002640', fontSize: '0.85rem', margin: '14px 0 6px' }}>Descripción (opcional)</label>
        <textarea
          value={descripcion}
          rows={3}
          placeholder="¿Qué fotos van en esta carpeta?"
          onChange={(e) => setDescripcion(e.target.value)}
          style={{ ...inputStyle, resize: 'vertical' }}
        />

        {errorModal && <p style={{ color: '#c0392b', fontSize: '0.85rem', margin: '10px 0 0' }}>{errorModal}</p>}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '22px' }}>
          <button type="button" onClick={onCerrar}
            style={{ backgroundColor: '#eee', color: '#333', border: 'none', padding: '10px 20px', borderRadius: '30px', fontWeight: 700, cursor: 'pointer' }}>
            Cancelar
          </button>
          <button type="submit" disabled={guardando}
            style={{ backgroundColor: '#f37021', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '30px', fontWeight: 700, cursor: guardando ? 'wait' : 'pointer', opacity: guardando ? 0.7 : 1 }}>
            {guardando ? 'Creando...' : 'Crear carpeta'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Vista principal ──────────────────────────────────────────────────────────
export default function GaleriaCarpetas() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [carpetas, setCarpetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCarpetas();
      setCarpetas(data);
    } catch (err) {
      setError('No se pudieron cargar las carpetas. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const crear = async (datos) => {
    await crearCarpeta(datos);
    setModalAbierto(false);
    await cargar();
  };

  const eliminar = async (e, carpeta) => {
    e.stopPropagation();
    const aviso = carpeta.cantidad > 0
      ? `¿Eliminar la carpeta "${carpeta.nombre}" y sus ${carpeta.cantidad} foto(s)? Esta acción no se puede deshacer.`
      : `¿Eliminar la carpeta "${carpeta.nombre}"?`;
    if (!window.confirm(aviso)) return;
    try {
      await eliminarCarpeta(carpeta.id);
      await cargar();
    } catch (err) {
      setError('No se pudo eliminar la carpeta.');
    }
  };

  // ─── Estilos ───────────────────────────────────────────────────────────────
  const tituloStyle = {
    margin: 0, color: '#002640', fontWeight: 800,
    fontSize: isMobile ? '1.5rem' : '2.2rem',
    borderLeft: '5px solid #f37021', paddingLeft: '14px'
  };

  const bannerStyle = {
    background: 'linear-gradient(135deg, #005691, #003a63)', color: 'white',
    border: 'none', borderRadius: '20px', cursor: 'pointer', fontFamily: 'inherit',
    padding: isMobile ? '18px' : '26px 30px',
    display: 'flex', alignItems: 'center', gap: '18px', textAlign: 'left',
    boxShadow: '0 8px 20px rgba(0,38,64,0.25)', transition: 'transform 0.2s, box-shadow 0.2s'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: isMobile ? '15px' : '25px'
  };

  const cardStyle = {
    position: 'relative', backgroundColor: 'white', borderRadius: '18px', overflow: 'hidden',
    boxShadow: '0 4px 14px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s'
  };

  const subir = (e) => { e.currentTarget.style.transform = 'translateY(-4px)'; };
  const bajar = (e) => { e.currentTarget.style.transform = 'translateY(0)'; };

  return (
    <div style={estiloFondoGaleria(isMobile)}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        <div style={{ marginBottom: isMobile ? '18px' : '28px' }}>
          <h1 style={tituloStyle}>GALERÍA POR CARPETAS</h1>
          <p style={{ margin: '8px 0 0 19px', color: '#1e2a3a', fontWeight: 600, fontStyle: 'italic', fontSize: isMobile ? '0.85rem' : '1rem' }}>
            Organiza las fotos en carpetas y encuéntralas por rostro u objeto
          </p>
        </div>

        {/* Accesos rápidos */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '12px' : '25px', marginBottom: isMobile ? '25px' : '40px' }}>
          <button style={bannerStyle} onClick={() => navigate('/galeria-carpetas/rostros')}
            onMouseEnter={subir} onMouseLeave={bajar}>
            <span style={{ fontSize: isMobile ? '2.4rem' : '3.2rem' }}>👤</span>
            <span>
              <span style={{ display: 'block', fontWeight: 800, fontSize: isMobile ? '1.1rem' : '1.4rem' }}>Buscar por Rostro</span>
              <span style={{ display: 'block', opacity: 0.85, fontSize: isMobile ? '0.75rem' : '0.9rem', marginTop: '3px' }}>Todas las fotos de una persona</span>
            </span>
          </button>
          <button style={bannerStyle} onClick={() => navigate('/galeria-carpetas/objetos')}
            onMouseEnter={subir} onMouseLeave={bajar}>
            <span style={{ fontSize: isMobile ? '2.4rem' : '3.2rem' }}>🏛️</span>
            <span>
              <span style={{ display: 'block', fontWeight: 800, fontSize: isMobile ? '1.1rem' : '1.4rem' }}>Buscar por Objeto</span>
              <span style={{ display: 'block', opacity: 0.85, fontSize: isMobile ? '0.75rem' : '0.9rem', marginTop: '3px' }}>Puertas, cúpulas, vitrales y más</span>
            </span>
          </button>
        </div>

        {/* Encabezado de carpetas */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, color: '#002640', fontWeight: 800, fontSize: isMobile ? '1.15rem' : '1.5rem', borderLeft: '5px solid #f37021', paddingLeft: '12px' }}>
            📁 Mis carpetas
          </h2>
          <button onClick={() => setModalAbierto(true)}
            style={{ backgroundColor: '#f37021', color: 'white', border: 'none', borderRadius: '40px', fontWeight: 700, cursor: 'pointer', padding: isMobile ? '8px 16px' : '11px 24px', fontSize: isMobile ? '0.85rem' : '1rem' }}>
            + Nueva carpeta
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderLeft: '5px solid #c0392b', borderRadius: '10px', padding: '14px 18px', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ color: '#c0392b', fontWeight: 600 }}>{error}</span>
            <button onClick={cargar} style={{ backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '30px', padding: '8px 16px', fontWeight: 700, cursor: 'pointer' }}>Reintentar</button>
          </div>
        )}

        {loading && <p style={{ textAlign: 'center', color: '#002640', fontWeight: 600 }}>Cargando carpetas...</p>}

        {!loading && !error && carpetas.length === 0 && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: '18px', padding: '40px 20px', textAlign: 'center', color: '#555' }}>
            <div style={{ fontSize: '3rem' }}>🗂️</div>
            <p style={{ margin: '8px 0 0' }}>Aún no hay carpetas. Crea la primera con «+ Nueva carpeta».</p>
          </div>
        )}

        {!loading && carpetas.length > 0 && (
          <div style={gridStyle}>
            {carpetas.map((c) => (
              <div key={c.id} style={cardStyle}
                onClick={() => navigate(`/galeria-carpetas/carpeta/${c.id}`)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 22px rgba(0,0,0,0.16)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.1)'; }}
              >
                <div style={{
                  height: isMobile ? '150px' : '160px',
                  backgroundColor: '#e8eef3',
                  backgroundImage: c.portada ? `url("${urlImagen(c.portada)}")` : 'none',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.2rem'
                }}>
                  {!c.portada && '🗂️'}
                </div>
                <button title="Eliminar carpeta" onClick={(e) => eliminar(e, c)}
                  style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✕
                </button>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 800, color: '#002640', fontSize: '1rem', wordBreak: 'break-word' }}>📁 {c.nombre}</div>
                  <div style={{ color: '#f37021', fontWeight: 700, fontSize: '0.8rem', marginTop: '4px' }}>
                    {c.cantidad} foto{c.cantidad !== 1 ? 's' : ''}
                  </div>
                  {c.descripcion && (
                    <div style={{ color: '#666', fontSize: '0.78rem', marginTop: '6px', lineHeight: 1.35 }}>{c.descripcion}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalAbierto && <ModalNuevaCarpeta onCerrar={() => setModalAbierto(false)} onCrear={crear} />}
    </div>
  );
}
