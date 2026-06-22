// src/context/InformesProvider.jsx
import React, { useState, useEffect, useCallback } from 'react';
import InformesContext from './InformesContext';
import { getInformes } from '../api/informes';

export const InformesProvider = ({ children }) => {
  const [conteos, setConteos] = useState({
    especiales: 0,
    divulgacion: 0,
    avance: 0,
    recorridos: { total: 0, academicos: 0, institucionales: 0, tecnicoPolitico: 0 },
    utilitarios: 0, // Ahora es un solo número
    totalGeneral: 0
  });

  const cargarConteos = useCallback(async () => {
    try {
      const [especiales, divulgacion, avance, recorAcademicos, recorInstitucionales, recorTecnico, utilitarios] = await Promise.all([
        getInformes({ tipo: 'especiales' }).then(res => res.length),
        getInformes({ tipo: 'divulgacion' }).then(res => res.length),
        getInformes({ tipo: 'avance' }).then(res => res.length),
        getInformes({ tipo: 'recorridos', subtipo: 'academicos' }).then(res => res.length),
        getInformes({ tipo: 'recorridos', subtipo: 'institucionales' }).then(res => res.length),
        getInformes({ tipo: 'recorridos', subtipo: 'tecnico-politico' }).then(res => res.length),
        getInformes({ tipo: 'utilitarios' }).then(res => res.length), // Solicitud general
      ]);
      setConteos({
        especiales,
        divulgacion,
        avance,
        recorridos: {
          academicos: recorAcademicos,
          institucionales: recorInstitucionales,
          tecnicoPolitico: recorTecnico,
          total: recorAcademicos + recorInstitucionales + recorTecnico
        },
        utilitarios,
        totalGeneral: especiales + divulgacion + avance + (recorAcademicos + recorInstitucionales + recorTecnico) + utilitarios
      });
    } catch (err) {
      console.error('Error cargando conteos', err);
    }
  }, []);

  const actualizarConteo = useCallback(() => {
    cargarConteos();
  }, [cargarConteos]);

  useEffect(() => {
    cargarConteos();
  }, [cargarConteos]);

  return (
    <InformesContext.Provider value={{ conteos, actualizarConteo }}>
      {children}
    </InformesContext.Provider>
  );
};