// src/pages/fotos/PlanFotos.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';

export default function PlanFotos() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const config = {
    plan1: { 
      titulo: 'PLAN MÉRIDA 465', 
      fondo: '/logos/banner1.jpg', 
      fases: [{ id: 1, nombre: 'FASE I (vinculada a Catedral)' }] 
    },
    plan2: { 
      titulo: 'PLAN DE RESTAURACIÓN INTEGRAL DE LA CATEDRAL', 
      fondo: '/logos/banner2.jpg', 
      fases: [
        { id: 1, nombre: 'FASE I' },
        { id: 2, nombre: 'FASE II' },
        { id: 3, nombre: 'FASE III' },
        { id: 4, nombre: 'FASE IV' }
      ] 
    },
    plan3: { titulo: 'PLAN 3', fondo: '/logos/banner3.jpg', fases: [] },
    plan4: { titulo: 'PLAN 4', fondo: '/logos/banner4.jpg', fases: [] }
  };

  const plan = config[planId];
  if (!plan) return <div style={{ padding: '20px', color: 'white' }}>Plan no encontrado</div>;

  const containerStyle = {
    background: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url('/logos/FONDO.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    flex: 1,
    padding: '30px',
    boxSizing: 'border-box',
    minHeight: 'calc(100vh - 80px)'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#002855',
    textAlign: 'center',
    marginBottom: '10px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '35px',
    marginTop: '40px',
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  const cardStyle = {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: '24px',
    padding: '30px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 12px 25px -10px rgba(0,0,0,0.15)',
    border: '1px solid rgba(243,112,33,0.2)'
  };

  const handleFaseClick = (faseId) => {
    if (planId === 'plan2' && faseId === 2) {
      // Fase II del Plan Catedral → muestra 30 frentes
      navigate(`/banco-fotos/plan2/frentes`);
    } else {
      // Otras fases o planes -> galería genérica (opcional)
      navigate(`/banco-fotos/${planId}/fase/${faseId}`);
    }
  };

  if (plan.fases.length === 0) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>{plan.titulo}</h1>
        <SearchBar />
        <p style={{ textAlign: 'center', marginTop: '60px', fontSize: '1.2rem', color: '#555' }}>
          Próximamente disponible
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{plan.titulo}</h1>
      <SearchBar />
      <div style={{ textAlign: 'center', marginTop: '10px', color: '#000000', fontWeight: '500' }}>
        Selecciona una fase para ver sus fotografías
      </div>
      <div style={gridStyle}>
        {plan.fases.map((fase) => (
          <div
            key={fase.id}
            style={cardStyle}
            onClick={() => handleFaseClick(fase.id)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 35px -12px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 25px -10px rgba(0,0,0,0.15)'; }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>📷</div>
            <h3 style={{ color: '#002640', fontSize: '1.5rem', margin: '10px 0' }}>{fase.nombre}</h3>
            <p style={{ color: '#f37021', fontWeight: 'bold' }}>Ver galería →</p>
          </div>
        ))}
      </div>
    </div>
  );
}