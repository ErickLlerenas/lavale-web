export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/logo.svg" alt="" width="28" height="28" />
          <span>© {year} Lávale · Hecho en México 🇲🇽</span>
        </div>
        <nav aria-label="Pie de página">
          <a href="#funciones">Funciones</a>
          <a href="#precios">Precios</a>
          <a href="#preguntas">Preguntas</a>
        </nav>
      </div>
    </footer>
  );
}
