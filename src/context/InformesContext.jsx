// src/context/InformesContext.jsx
import { createContext, useContext } from 'react';

// Creamos el contexto
const InformesContext = createContext(null);

// Hook personalizado para consumir el contexto
export const useInformes = () => {
  const context = useContext(InformesContext);
  if (!context) {
    throw new Error('useInformes must be used within an InformesProvider');
  }
  return context;
};

export default InformesContext;