import { whatsappLink } from "@/lib/site";

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
          <a href={whatsappLink("Hola, tengo una duda sobre Lávale.")} target="_blank" rel="noopener noreferrer">
            Contacto
          </a>
        </nav>
      </div>
    </footer>
  );
}
