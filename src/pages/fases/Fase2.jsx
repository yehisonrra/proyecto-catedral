// src/pages/fases/Fase2.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInformes } from '../../api/informes';

export const datosFase2 = [
  { id: 1, nombreCompleto: "Rehabilitación y restauración del sistema de cornisas.", nombre: "CORNISAS", imagen: "/logos/frente1.jpg" },
  { id: 2, nombreCompleto: "Restauración en cúpula central (2/3 fases).", nombre: "CÚPULA CENTRAL", imagen: "/logos/frente2.png" },
  { id: 3, nombreCompleto: "Ampliación de canales nuevas para el proyecto integral.", nombre: "CANALES", imagen: "/logos/frente3.jpg" },
  { id: 4, nombreCompleto: "Instalaciones eléctricas y seguridad - Pai (1era de tres fases).", nombre: "INSTALACIONES ELÉCTRICAS Y SEGURIDAD", imagen: "/logos/frente4.jpg" },
  { id: 5, nombreCompleto: "Consolidación de losas planas posteriores suroeste.", nombre: "LOSAS PLANAS - SUROESTE", imagen: "/logos/frente5.jpg" },
  { id: 6, nombreCompleto: "Consolidación de fachada lat. suroeste.", nombre: "CONSOLIDACIÓN DE FACHADA SO", imagen: "/logos/frente6.jpg" },
  { id: 7, nombreCompleto: "Restauración de las fachadas desde losas planas a tejado de lateral noreste-suroeste y posterior.", nombre: "REST. DE LAS FACHADAS NE-SO Y POST", imagen: "/logos/frente7.jpg" },
  { id: 8, nombreCompleto: "Restauración de la capilla el sagrario 1ra de 2 fases.", nombre: "CAPILLA EL SAGRARIO", imagen: "/logos/frente8.jpg" },
  { id: 9, nombreCompleto: "Rehabilitación de otros espacios internos.", nombre: "ESPACIOS INTERNOS", imagen: "/logos/frente9.jpg" },
  { id: 10, nombreCompleto: "Mejoras puntuales en la calle 22 - anteproyecto.", nombre: "CALLE 22", imagen: "/logos/frente10.jpg" },
  { id: 11, nombreCompleto: "Rehabilitación y mejoras en espacios entre los distintos volúmenes de la catedral.", nombre: "REHAB. Y MEJORAS", imagen: "/logos/frente11.jpg" },
  { id: 12, nombreCompleto: "Restauración externa de torre norte.", nombre: "TORRE NORTE", imagen: "/logos/frente12.jpg" },
  { id: 13, nombreCompleto: "Restauración de cupulines, linternas e interior del cupulino - lateral noreste.", nombre: "CUPULINES, LINTERNAS E INTERIOR - LAT. NO.", imagen: "/logos/frente13.jpg" },
  { id: 14, nombreCompleto: "Restauración de fachada lateral noreste (edificio principal) (1 de 2 fases).", nombre: "REST. FACHADA LATERAL NO.", imagen: "/logos/frente14.jpg" },
  { id: 15, nombreCompleto: "Restauración de 5 vitrales (presbiterio sede y capilla del sagrario).", nombre: "VITRALES", imagen: "/logos/frente15.jpg" },
  { id: 16, nombreCompleto: "Restauración interna de torre oeste.", nombre: "TORRE OESTE (INTERNA)", imagen: "/logos/frente16.jpg" },
  { id: 17, nombreCompleto: "Impermeabilización del sistema de losas de cupulines del lateral suroeste.", nombre: "CUPULINES LAT. SUROESTE", imagen: "/logos/frente17.jpg" },
  { id: 18, nombreCompleto: "Plan de intervención del imaginario religioso (1 de 3 fases).", nombre: "IMAGINARIO RELIGIOSO", imagen: "/logos/frente18.jpg" },
  { id: 19, nombreCompleto: "Plan de intervención de las lámparas de araña (1 de 3 fases).", nombre: "LAMPARAS DE ARAÑA", imagen: "/logos/frente19.jpg" },
  { id: 20, nombreCompleto: "Restauración de fachada lateral noreste (edificio testigo).", nombre: "FACHADA LAT. NORESTE", imagen: "/logos/frente20.jpg" },
  { id: 21, nombreCompleto: "Restauración de fachada principal (2 de 3 fases).", nombre: "FACHADA PRINCIPAL", imagen: "/logos/frente21.jpg" },
  { id: 22, nombreCompleto: "Consolidación de restauración de los cupulines e interior de cupulinos lateral suroeste.", nombre: "CUPULINES E INTERIOR LAT. SO", imagen: "/logos/frente22.jpg" },
  { id: 23, nombreCompleto: "Construcción de bajantes y rehabilitación de bajantes empotrados.", nombre: "BAJANTES", imagen: "/logos/frente23.jpg" },
  { id: 24, nombreCompleto: "Restauración interna de torre norte (1 de 2 fases).", nombre: "TORRE NORTE (INTERNA)", imagen: "/logos/frente24.jpg" },
  { id: 25, nombreCompleto: "Consolidación de espacio museográfico para lapidario - jardín", nombre: "ESPACIO MUSEOGRÁFICO", imagen: "/logos/frente25.jpg" },
  { id: 26, nombreCompleto: "Exposición del imaginario religioso consolidado (custodio).", nombre: "CONS. IMAGINARIO RELIGIOSO", imagen: "/logos/frente26.jpg" },
  { id: 27, nombreCompleto: "Restauración de la fachada externa desde losas planas a tejado lateral suroeste.", nombre: "FACHADA EXTERNA LAT. SO", imagen: "/logos/frente27.jpg" },
  { id: 28, nombreCompleto: "Restauración de fachada posterior suroeste.", nombre: "FACHADA POSTERIOR SO", imagen: "/logos/frente28.jpg" },
  { id: 29, nombreCompleto: "Impermeabilización del sistema de losas de cupulines lateral noreste.", nombre: "LOSAS DE CUPULINES LAT. NORESTE", imagen: "/logos/frente29.jpg" },
  { id: 30, nombreCompleto: "Restauración de la fachada externa desde losas planas a tejado lateral noreste.", nombre: "FACHADA EXTERNA LAT. NO", imagen: "/logos/frente30.png" }
];

export default function Fase2() {
  const navigate = useNavigate();
  const imagenFondo = '/logos/FONDO.jpg';

  const [conteosPorFrente, setConteosPorFrente] = useState({});
  const [totalInformes, setTotalInformes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarConteos = async () => {
    setLoading(true);
    setError(null);
    try {
      const informes = await getInformes({ tipo: 'frente' });
      const nuevosConteos = {};
      let total = 0;
      datosFase2.forEach(frente => {
        const cantidad = informes.filter(inf => inf.frente_id === frente.id).length;
        nuevosConteos[frente.id] = cantidad;
        total += cantidad;
      });
      setConteosPorFrente(nuevosConteos);
      setTotalInformes(total);
    } catch (err) {
      console.error('Error cargando conteos:', err);
      setError('No se pudieron cargar los contadores. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarConteos();
  }, []);

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

  const badgeContadorGlobal = {
    display: 'inline-block',
    backgroundColor: '#f37021',
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    padding: '2px 10px',
    borderRadius: '20px',
    marginLeft: '12px'
  };

  const contadorTarjetaStyle = {
    display: 'inline-block',
    backgroundColor: '#f37021',
    color: 'white',
    fontSize: '0.65rem',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '12px',
    marginBottom: '6px'
  };

  const handleNavigate = (fase) => navigate(`/fase${fase}`);
  const handleVerInformes = (frenteId) => navigate(`/fase2/frente/${frenteId}`);

  if (loading) {
    return (
      <div style={{ ...containerStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#fff' }}>Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...containerStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <p style={{ color: '#ffcccc' }}>{error}</p>
        <button onClick={cargarConteos} style={{ marginTop: '10px', padding: '5px 10px' }}>Reintentar</button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={phaseSelectorStyle}>
          <button style={phaseButtonStyle(false)} onClick={() => handleNavigate(1)}>Fase I</button>
          <button style={phaseButtonStyle(true)} onClick={() => handleNavigate(2)}>Fase II</button>
          <button style={phaseButtonStyle(false)} onClick={() => handleNavigate(3)}>Fase III</button>
          <button style={phaseButtonStyle(false)} onClick={() => handleNavigate(4)}>Fase IV</button>
        </div>
        <p style={subtitleStyle}>
          SELECCIÓN DE FRENTES DE TRABAJO (30 frentes)
          <span style={badgeContadorGlobal}>📊 Total informes: {totalInformes}</span>
        </p>
      </div>

      <div style={qrGridStyle}>
        {datosFase2.map((frente) => (
          <div key={frente.id} style={qrCardStyle}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)'; }}>
            <div style={qrPlaceholder} onClick={() => handleVerInformes(frente.id)} title="Ver informes del frente">
              <img src={frente.imagen} alt={frente.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '10px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: '#f37021', fontWeight: 'bold' }}>FRENTE #{frente.id.toString().padStart(2, '0')}</p>
              <p style={{ margin: '4px 0', fontSize: '0.75rem', fontWeight: '800', color: '#002640', minHeight: '35px', cursor: 'help', lineHeight: '1.3' }} title={frente.nombreCompleto}>{frente.nombre}</p>
              <div>
                <span style={contadorTarjetaStyle}>📄 {conteosPorFrente[frente.id] || 0} informe(s)</span>
              </div>
              <button style={viewButtonStyle} onClick={() => handleVerInformes(frente.id)}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#005691'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#005691'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#005691'; e.currentTarget.style.borderColor = '#005691'; }}>
                Ver Informes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}