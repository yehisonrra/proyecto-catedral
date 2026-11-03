{/* ─────────────────────────────────────────────────────────────────────────
   src/components/Sidebar.jsx
   INSERTAR este bloque justo DESPUÉS del div de "🖼️ Banco de Fotos"
   y ANTES del div de "📱 Catálogo de QRs".
   ───────────────────────────────────────────────────────────────────────── */}

<div style={{ ...menuItemWrapper, marginTop: '10px',
  backgroundColor: location.pathname.startsWith('/galeria-carpetas') ? '#005691' : 'transparent' }}>
  <Link to="/galeria-carpetas" style={linkStyle} onClick={handleLinkClick}>
    🗂️ Galería por Carpetas
  </Link>
</div>

{/* Nota: se usa startsWith para que el item siga resaltado dentro de las subpáginas.
    Si prefieres exactamente tu versión: isActive('/galeria-carpetas') ? '#005691' : 'transparent' */}
