// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import Fase1 from './pages/fases/Fase1';
import Fase2 from './pages/fases/Fase2';
import Fase3 from './pages/fases/Fase3';
import Fase4 from './pages/fases/Fase4';
import PlanMerida from './pages/PlanMerida';
import Plan3 from './pages/Plan3';
import Plan4 from './pages/Plan4';
import FrenteDetalle from './pages/fases/frente/FrenteDetalle';
import BancoFotos from './pages/BancoFotos';
import PlanFotos from './pages/fotos/PlanFotos';
import FrentesFotos from './pages/fotos/FrentesFotos';
import GaleriaFrenteFotos from './pages/fotos/GaleriaFrenteFotos';
import CatalogoQR from './pages/CatalogoQR';
import CatalogoQRFases from './pages/qr/CatalogoQRFases';
import CatalogoQRFrentes from './pages/qr/CatalogoQRFrentes';
import Especiales from './pages/informes/Especiales';
import Divulgacion from './pages/informes/Divulgacion';
import Avance from './pages/informes/Avance';
import Recorridos from './pages/informes/Recorridos';
import Utilitarios from './pages/informes/Utilitarios';
import { InformesProvider } from './context/InformesProvider';
import GlobalSearchBar from './components/GlobalSearchBar';
import SearchResults from './pages/SearchResults';
import { useIsMobile } from './hooks/useIsMobile';

function AppContent() {
  const location   = useLocation();
  const isMobile   = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // En móvil el header mide ~50px; en escritorio ~80px
  const headerHeight = isMobile ? '50px' : '80px';

  // En móvil el sidebar se superpone (no empuja el contenido)
  const mainMarginLeft = (!isMobile && sidebarOpen) ? '280px' : '0px';
  const mainWidth      = (!isMobile && sidebarOpen) ? 'calc(100% - 280px)' : '100%';

  return (
    <div style={{
      display         : 'flex',
      flexDirection   : 'column',
      minHeight       : '100vh',
      backgroundImage : `linear-gradient(rgba(255,255,255,0.4),rgba(255,255,255,0.4)),url('/logos/banner2.jpg')`,
      backgroundSize  : 'cover',
      backgroundPosition : 'center',
      backgroundAttachment: isMobile ? 'scroll' : 'fixed', // fixed falla en iOS
    }}>
      <Header isOpen={sidebarOpen} />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />

        {/* Overlay oscuro al abrir sidebar en móvil — toca para cerrar */}
        {sidebarOpen && isMobile && (
          <div
            onClick={toggleSidebar}
            style={{
              position       : 'fixed',
              top            : 0,
              left           : 0,
              width          : '100%',
              height         : '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex         : 1050,
            }}
          />
        )}

        <main style={{
          flexGrow       : 1,
          marginTop      : headerHeight,
          marginLeft     : mainMarginLeft,
          transition     : 'margin-left 0.3s ease',
          width          : mainWidth,
          paddingBottom  : '0px',
          display        : 'flex',
          flexDirection  : 'column',
        }}>
          <GlobalSearchBar />
          <Routes>
            <Route path="/"                                   element={<Inicio />} />
            <Route path="/PlanMerida"                         element={<PlanMerida />} />
            <Route path="/Plan3"                              element={<Plan3 />} />
            <Route path="/Plan4"                              element={<Plan4 />} />
            <Route path="/fase1"                              element={<Fase1 />} />
            <Route path="/fase2"                              element={<Fase2 />} />
            <Route path="/fase3"                              element={<Fase3 />} />
            <Route path="/fase4"                              element={<Fase4 />} />
            <Route path="/fase2/frente/:id"                   element={<FrenteDetalle />} />
            <Route path="/catalogo-qr"                        element={<CatalogoQR />} />
            <Route path="/catalogo-qr/:planId"                element={<CatalogoQRFases />} />
            <Route path="/catalogo-qr/plan2/frentes"          element={<CatalogoQRFrentes />} />
            <Route path="/banco-fotos"                        element={<BancoFotos />} />
            <Route path="/banco-fotos/:planId"                element={<PlanFotos />} />
            <Route path="/banco-fotos/plan2/frentes"          element={<FrentesFotos />} />
            <Route path="/banco-fotos/plan2/frente/:frenteId" element={<GaleriaFrenteFotos />} />
            <Route path="/informes/especiales"                element={<Especiales />} />
            <Route path="/informes/divulgacion"               element={<Divulgacion />} />
            <Route path="/informes/avance"                    element={<Avance />} />
            <Route path="/informes/recorridos/:tipo"          element={<Recorridos />} />
            <Route path="/informes/utilitarios/:tipo"         element={<Utilitarios />} />
            <Route path="/buscar"                             element={<SearchResults />} />
            <Route path="*" element={<div style={{ padding: '20px', color: 'white' }}>Página no encontrada</div>} />
          </Routes>
        </main>
      </div>

      <Footer isOpen={sidebarOpen} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <InformesProvider>
        <AppContent />
      </InformesProvider>
    </BrowserRouter>
  );
}

export default App;
