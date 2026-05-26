// src/pages/fases/Fase1.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const datosFase1 = [
  { id: 1, nombreCompleto: "Restauración de Losas y Cubiertas de Tejas.", nombre: "LOSAS Y TEJAS", enlace: "?frente=1" },
  { id: 2, nombreCompleto: "Sustitución de Tragaluces de Protección de los Vitrales.", nombre: "TRAGALUCES DE VITRALES", enlace: "?frente=2" },
  { id: 3, nombreCompleto: "Restauración de 3 Vitrales Centrales.", nombre: "VITRALES CENTRALES", enlace: "?frente=3" },
  { id: 4, nombreCompleto: "Sustitución de Canales de Drenaje, Limahoyas y Goteros.", nombre: "CANALES Y LIMAHOYAS", enlace: "?frente=4" },
  { id: 5, nombreCompleto: "Restauración de Sistemas de Drenaje en Cúpula Central.", nombre: "DRENAJE DE CÚPULA CENTRAL", enlace: "?frente=5" },
  { id: 6, nombreCompleto: "Restauración de los 3 Cupulines del Lateral Suroeste (s/linternas).", nombre: "CUPULINES SUROESTE", enlace: "?frente=6" },
  { id: 7, nombreCompleto: "Restauración Externa de la Torre Suroeste.", nombre: "TORRE SUROESTE", enlace: "?frente=7" },
  { id: 8, nombreCompleto: "Reforzamiento de Elementos Decorativos en Nave Central.", nombre: "REFUERZO DECORATIVO NAVE", enlace: "?frente=8" },
  { id: 9, nombreCompleto: "Reconstrucción de Frisos en Paredes entre Techos.", nombre: "FRISOS ENTRE TECHOS", enlace: "?frente=9" },
  { id: 10, nombreCompleto: "Rehabilitación de Cruz Arzobispal.", nombre: "CRUZ ARZOBISPAL", enlace: "?frente=10" },
  { id: 11, nombreCompleto: "Rehabilitación de Fachada Principal (1ra de 3 Fases).", nombre: "FACHADA PRINCIPAL (FASE 1)", enlace: "?frente=11" },
  { id: 12, nombreCompleto: "Impermeabilización de Losas Planas de Áreas Operativas.", nombre: "IMPERMEABILIZACIÓN DE LOSAS", enlace: "?frente=12" },
  { id: 13, nombreCompleto: "Restauración de 8 Vitrales en la Cúpula Central.", nombre: "VITRALES DE CÚPULA CENTRAL", enlace: "?frente=13" },
  { id: 14, nombreCompleto: "Rehabilitación de Espacios Internos Operativos.", nombre: "ESPACIOS INTERNOS", enlace: "?frente=14" },
  { id: 15, nombreCompleto: "Restauración de Fachada Lateral Suroeste.", nombre: "FACHADA LATERAL SUROESTE", enlace: "?frente=15" }
];

export default function Fase1() {
  const navigate = useNavigate();
 const imagenFondo = '/logos/FONDO.jpg';
  const imagenGenerica = '/Fases/fase1/grua.png';  // ← imagen provisional para todos

  const containerStyle = {
    background: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url(${imagenFondo})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    flex: 1,
    padding: '30px',
    boxSizing: 'border-box'
  };

  const headerStyle = { textAlign: 'center', marginBottom: '30px' };
  const phaseSelectorStyle = { display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' };
  const phaseButtonStyle = (isActive) => ({
    backgroundColor: isActive ? '#f37021' : 'rgba(0, 86, 145, 0.85)',
    color: 'white',
    border: 'none',
    padding: '10px 30px',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  });
  const subtitleStyle = {
    fontSize: '1rem',
    color: '#002640',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255,0.9)',
    display: 'inline-block',
    padding: '8px 25px',
    borderRadius: '30px',
    marginTop: '10px'
  };
  const qrGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px', marginTop: '35px' };
  const qrCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    border: '1px solid rgba(0, 86, 145, 0.3)',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  };
  const qrPlaceholder = { height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee', cursor: 'pointer' };
  const viewButtonStyle = {
    backgroundColor: '#fff',
    color: '#005691',
    border: '1px solid #005691',
    borderRadius: '6px',
    fontSize: '0.7rem',
    width: '100%',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: '6px 0',
    marginTop: '8px',
    transition: 'all 0.2s'
  };

  const handleNavigate = (fase) => navigate(`/fase${fase}`);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={phaseSelectorStyle}>
          <button style={phaseButtonStyle(true)} onClick={() => handleNavigate(1)}>Fase I</button>
          <button style={phaseButtonStyle(false)} onClick={() => handleNavigate(2)}>Fase II</button>
          <button style={phaseButtonStyle(false)} onClick={() => handleNavigate(3)}>Fase III</button>
          <button style={phaseButtonStyle(false)} onClick={() => handleNavigate(4)}>Fase IV</button>
        </div>
        <p style={subtitleStyle}>SELECCIÓN DE FRENTES DE TRABAJO (15 frentes)</p>
      </div>

      <div style={qrGridStyle}>
        {datosFase1.map((frente) => (
          <div key={frente.id} style={qrCardStyle}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)'; }}>
            <div style={qrPlaceholder} onClick={() => window.open(frente.enlace, '_blank')} title={frente.nombreCompleto}>
              <img src={imagenGenerica} alt="Imagen provisional" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '10px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: '#f37021', fontWeight: 'bold' }}>FRENTE #{frente.id.toString().padStart(2, '0')}</p>
              <p style={{ margin: '4px 0', fontSize: '0.75rem', fontWeight: '800', color: '#002640', minHeight: '35px', cursor: 'help', lineHeight: '1.3' }} title={frente.nombreCompleto}>{frente.nombre}</p>
              <button style={viewButtonStyle} onClick={() => window.open(frente.enlace, '_blank')}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#005691'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#005691'; }}>Ver Informes</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}