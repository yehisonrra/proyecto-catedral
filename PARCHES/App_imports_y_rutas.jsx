// ─────────────────────────────────────────────────────────────────────────────
// src/App.jsx
// 1) AÑADIR estos imports junto a los demás (arriba del archivo):
// ─────────────────────────────────────────────────────────────────────────────
import GaleriaCarpetas from './pages/galeria/GaleriaCarpetas';
import CarpetaDetalle  from './pages/galeria/CarpetaDetalle';
import RostrosIndex    from './pages/galeria/RostrosIndex';
import RostroDetalle   from './pages/galeria/RostroDetalle';
import ObjetosIndex    from './pages/galeria/ObjetosIndex';
import ObjetoDetalle   from './pages/galeria/ObjetoDetalle';

// ─────────────────────────────────────────────────────────────────────────────
// 2) AÑADIR estas rutas dentro de <Routes>, ANTES de la ruta comodín path="*":
// ─────────────────────────────────────────────────────────────────────────────
<Route path="/galeria-carpetas"                      element={<GaleriaCarpetas />} />
<Route path="/galeria-carpetas/carpeta/:carpetaId"   element={<CarpetaDetalle />} />
<Route path="/galeria-carpetas/rostros"              element={<RostrosIndex />} />
<Route path="/galeria-carpetas/rostro/:rostroId"     element={<RostroDetalle />} />
<Route path="/galeria-carpetas/objetos"              element={<ObjetosIndex />} />
<Route path="/galeria-carpetas/objeto/:objetoId"     element={<ObjetoDetalle />} />
