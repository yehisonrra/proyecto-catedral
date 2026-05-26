import { useParams } from 'react-router-dom';
import ListaInformes from './ListaInformes';

const titulos = {
  inicial: 'Utilitarios Inicial',
  'frente-secundario': 'Utilitarios Frente Secundario'
};
const subtitulos = {
  inicial: 'Documentos de utilería inicial',
  'frente-secundario': 'Documentos de frente secundario'
};

export default function Utilitarios() {
  const { tipo } = useParams();
  const titulo = titulos[tipo] || 'Utilitarios';
  const subtitulo = subtitulos[tipo] || 'Informes';
  return <ListaInformes titulo={titulo} subtitulo={subtitulo} tipo="utilitarios" subtipo={tipo} />;
}