import { MessageCircle } from "lucide-react";
import { isPublished, stores, whatsappLink } from "@/lib/site";

/// Botón principal + disponibilidad. Mientras no haya tiendas, invita a la
/// beta por WhatsApp; cuando existan, muestra los enlaces de descarga.
export default function GetApp({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <div className={`get-app get-app-${tone}`}>
      <a
        className="btn btn-main"
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle size={20} strokeWidth={2.4} aria-hidden="true" />
        Quiero probarla gratis
      </a>
      {isPublished ? (
        <div className="store-links">
          {stores.google && (
            <a href={stores.google} target="_blank" rel="noopener noreferrer">
              Google Play
            </a>
          )}
          {stores.apple && (
            <a href={stores.apple} target="_blank" rel="noopener noreferrer">
              App Store
            </a>
          )}
        </div>
      ) : (
        <p className="soon">
          Próximamente en <b>Google Play</b> y <b>App Store</b>
        </p>
      )}
    </div>
  );
}
