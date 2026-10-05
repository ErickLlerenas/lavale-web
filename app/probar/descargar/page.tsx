import type { Metadata } from "next";
import DownloadSteps from "@/components/DownloadSteps";
import Footer from "@/components/Footer";
import LandingNav from "@/components/LandingNav";
import { testerProgram } from "@/lib/site";

export const metadata: Metadata = {
  title: "Descarga Lávale",
  robots: { index: false },
};

/// A donde llega quien abre los pasos en Chrome desde Facebook
/// (el estado del formulario no viaja entre navegadores).
export default function Descargar() {
  return (
    <>
      <LandingNav />
      <main>
        <section className="hero tester-hero">
          <div className="hero-content tester-hero-content tester-solo">
            <div className="tester-card tester-done">
              <h2>Descarga Lávale</h2>
              <p>Son 2 pasos y tardas un minuto:</p>
              <DownloadSteps />
              <p className="tester-fine">
                ¿Todavía no apartas tu lugar? <a href="/probar">Hazlo aquí</a>.
                Úsala {testerProgram.days} días sin desinstalarla y te mandamos
                el código para tenerla gratis de por vida.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
