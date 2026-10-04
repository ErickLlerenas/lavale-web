import type { Metadata } from "next";
import { CalendarCheck, Gift, Smartphone } from "lucide-react";
import Footer from "@/components/Footer";
import LandingNav from "@/components/LandingNav";
import TesterForm from "@/components/TesterForm";
import { mxn, plans, testerProgram } from "@/lib/site";

export const metadata: Metadata = {
  title: "Prueba Lávale gratis y quédatela de por vida",
  description: `Buscamos lavanderías que prueben Lávale en Android durante ${testerProgram.days} días. Al terminar, te la regalamos de por vida.`,
  alternates: { canonical: "/probar" },
};

const steps = [
  {
    icon: Smartphone,
    title: "Inscríbete con tu Gmail",
    text: "El mismo de tu Play Store. Lávale es para Android en esta prueba.",
  },
  {
    icon: CalendarCheck,
    title: `Úsala ${testerProgram.days} días`,
    text: "Recibe, avisa y cobra en tu mostrador. Si algo falla, nos escribes desde la app.",
  },
  {
    icon: Gift,
    title: "Quédatela gratis de por vida",
    text: `Te mandamos un código para el plan de por vida (vale ${mxn(plans.lifetime)}).`,
  },
];

const faqs = [
  {
    q: "¿Por qué la regalan?",
    a: `Google Play pide que una app nueva tenga testers durante ${testerProgram.days} días antes de publicarla. Preferimos que sean lavanderías de verdad y que nos digan qué mejorar.`,
  },
  {
    q: "¿Qué tengo que hacer para ganarla?",
    a: `Inscribirte, instalar la prueba y no salirte de ella en ${testerProgram.days} días. Usarla en tu mostrador nos ayuda mucho, y tus comentarios todavía más.`,
  },
  {
    q: "¿Funciona en iPhone?",
    a: "Esta prueba es solo para Android. La versión para iPhone viene después.",
  },
  {
    q: "¿Me van a cobrar algo?",
    a: "No. Durante la prueba la app está completa y no pide tarjeta. Al terminar, el código te da el plan de por vida sin pagar.",
  },
  {
    q: "¿Qué pasa con mis datos?",
    a: "Tus pedidos y cobros viven en tu teléfono, no en nuestros servidores. De ti solo guardamos el correo y lo que pongas en este formulario.",
  },
];

export default function Probar() {
  return (
    <>
      <LandingNav />
      <main>
        <section className="hero tester-hero">
          <div className="bubbles" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className={`bubble b${i}`} />
            ))}
          </div>
          <div className="hero-content tester-hero-content">
            <div className="hero-copy">
              <p className="eyebrow">Para lavanderías · Android</p>
              <h1>
                Pruébala {testerProgram.days} días y{" "}
                <em>quédatela gratis de por vida.</em>
              </h1>
              <p className="hero-lead">
                Buscamos lavanderías que usen Lávale antes que nadie y nos digan
                qué mejorar. Si sigues en la prueba al día {testerProgram.days},
                te regalamos el plan de por vida.
              </p>
              <ul className="tester-steps">
                {steps.map((s) => (
                  <li key={s.title}>
                    <span className="feature-icon" aria-hidden="true">
                      <s.icon size={20} strokeWidth={2.2} />
                    </span>
                    <span>
                      <strong>{s.title}</strong>
                      {s.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="tester-form-wrap">
              {testerProgram.open ? (
                <TesterForm />
              ) : (
                <div className="tester-card">
                  <h2>La prueba ya cerró</h2>
                  <p>Gracias. Muy pronto podrás descargar Lávale en Google Play.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="container narrow">
            <h2 className="section-title">Preguntas sobre la prueba</h2>
            <div className="faq">
              {faqs.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
