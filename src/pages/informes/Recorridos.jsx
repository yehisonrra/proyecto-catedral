import { useParams } from 'react-router-dom';
import ListaInformes from './ListaInformes';

const titulos = {
  academicos: 'Recorridos Académicos',
  institucionales: 'Recorridos Institucionales',
  'tecnico-politico': 'Recorridos Técnico-Políticos'
};
const subtitulos = {
  academicos: 'Informes de recorridos académicos',
  institucionales: 'Informes de recorridos institucionales',
  'tecnico-politico': 'Informes de recorridos técnico-políticos'
};

export default function Recorridos() {
  const { tipo } = useParams();
  const titulo = titulos[tipo];
  const subtitulo = subtitulos[tipo];
  return <ListaInformes titulo={titulo} subtitulo={subtitulo} tipo="recorridos" subtipo={tipo} />;
}