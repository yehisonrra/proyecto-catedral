// src/components/NuevoInformeModal.jsx
import React, { useState } from 'react';

const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0,
  width: '100%', height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 2000,
  backdropFilter: 'blur(4px)'
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '40px',
  borderRadius: '15px',
  width: '500px',
  boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
  display: 'flex', flexDirection: 'column', gap: '20px'
};

const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '1rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box'
};

const saveBtnStyle = {
  backgroundColor: '#005691',
  color: 'white',
  border: 'none',
  padding: '12px 25px',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  flex: 1
};

const cancelBtnStyle = {
  backgroundColor: '#f1f1f1',
  color: '#666',
  border: 'none',
  padding: '12px 25px',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  flex: 1
};

export default function NuevoInformeModal({ onClose, onSave, vistaActual = 'FASE II', frenteId }) {
  const [formData, setFormData] = useState({
    nombre: '',
    numero: '',
    fecha: new Date().toISOString().split('T')[0],
    enlaceCanva: ''
  });

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const guardarInforme = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.numero || !formData.fecha || !formData.enlaceCanva) {
      alert('Por favor complete todos los campos (nombre, número, fecha y enlace)');
      return;
    }
    // Se pasa el objeto completo al callback onSave
    onSave(formData);
    onClose();
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3 style={{ margin: 0, color: '#002640', borderBottom: '2px solid #f37021', paddingBottom: '10px' }}>
          📝 Nuevo Registro: {vistaActual.toUpperCase()}
        </h3>

        <form onSubmit={guardarInforme} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            name="nombre"
            placeholder="Nombre del Informe"
            value={formData.nombre}
            onChange={manejarCambio}
            required
            style={inputStyle}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              name="numero"
              placeholder="N° de Informe"
              value={formData.numero}
              onChange={manejarCambio}
              required
              style={{ ...inputStyle, width: '50%' }}
            />
            <input
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={manejarCambio}
              required
              style={{ ...inputStyle, width: '50%' }}
            />
          </div>

          <input
            name="enlaceCanva"
            placeholder="Enlace (Canva)"
            value={formData.enlaceCanva}
            onChange={manejarCambio}
            required
            style={inputStyle}
          />

          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <button type="submit" style={saveBtnStyle}>Guardar en Sistema</button>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}