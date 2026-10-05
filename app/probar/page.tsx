import type { Metadata } from "next";
import { BellRing, CalendarCheck, Check, Gift, Mail, ReceiptText, Tag } from "lucide-react";
import Footer from "@/components/Footer";
import HeroPhone from "@/components/HeroPhone";
import LandingNav from "@/components/LandingNav";
import SpotsLeft from "@/components/SpotsLeft";
import TesterForm from "@/components/TesterForm";
import { mxn, plans, testerProgram } from "@/lib/site";

const { days, spots } = testerProgram;

export const metadata: Metadata = {
  title: `Lávale gratis de por vida para las primeras ${spots} lavanderías`,
  description: `La app para el mostrador de tu lavandería: folio para cada bolsa, aviso por WhatsApp y corte de caja. Úsala ${days} días y quédatela gratis para siempre.`,
  alternates: { canonical: "/probar" },
};

const perks = ["Sin tarjeta", "Funciona sin internet", "Para Android"];

const features = [
  {
    icon: Tag,
    title: "Folio para cada bolsa",
    text: "Pesas, cobras o dejas anticipo, y la bolsa sale con su número.",
  },
  {
    icon: BellRing,
    title: "Aviso por WhatsApp",
    text: "Un toque y el cliente sabe que su ropa está lista y cuánto debe.",
  },
  {
    icon: ReceiptText,
    title: "Corte de caja",
    text: "Al cerrar ves cuánto entró, qué se debe y qué falta entregar.",
  },
];

const steps = [
  {
    icon: Mail,
    title: "Aparta tu lugar",
    text: "Déjanos tu Gmail y en unas horas te mandamos el enlace para descargarla.",
  },
  {
    icon: CalendarCheck,
    title: `Úsala ${days} días`,
    text: "Recibe, avisa y cobra en tu mostrador. Si algo falla, nos escribes desde la app.",
  },
  {
    icon: Gift,
    title: "Es tuya para siempre",
    text: `Te mandamos un código y el plan de por vida (vale ${mxn(plans.lifetime)}) te sale gratis.`,
  },
];

const faqs = [
  {
    q: "¿Cuál es el truco?",
    a: `Ninguno. Lávale es nueva y antes de lanzarla queremos que la usen lavanderías de verdad y nos digan qué mejorar. A cambio, a las primeras ${spots} se la regalamos para siempre.`,
  },
  {
    q: "¿Me van a cobrar algo?",
    a: `No. No pedimos tarjeta. Al terminar los ${days} días te mandamos un código y el plan de por vida queda pagado.`,
  },
  {
    q: "¿Es difícil de usar?",
    a: "Si usas WhatsApp, puedes usar Lávale. No tienes que crear cuenta ni contraseña: la abres y empiezas a recibir ropa.",
  },
  {
    q: "¿Qué tengo que hacer para quedármela?",
    a: `Descargarla y no desinstalarla en ${days} días. Si la usas en tu mostrador y nos cuentas qué le falta, todavía mejor.`,
  },
  {
    q: "¿Por qué Google Play dice que es una prueba?",
    a: "Porque todavía no está publicada para todos. Es la app completa; cuando salga oficialmente se actualiza sola y no pierdes nada.",
  },
  {
    q: "¿Funciona en iPhone?",
    a: "Por ahora solo en Android. Si tienes iPhone, deja tu correo y te avisamos cuando salga.",
  },
  {
    q: "¿Qué pasa con mis datos?",
    a: "Tus pedidos y cobros se guardan en tu teléfono, no en nuestros servidores. De ti solo guardamos tu correo.",
  },
];

export default function Probar() {
  return (
    <>
      <LandingNav />
      <main>
        <section className="hero tester-hero" id="apartar">
          <div className="bubbles" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className={`bubble b${i}`} />
            ))}
          </div>
          <div className="hero-content tester-hero-content">
            <div className="hero-copy">
              <p className="eyebrow">🎁 Acceso anticipado · solo {spots} lugares</p>
              <h1>
                Llévate Lávale <em>gratis de por vida.</em>
              </h1>
              <p className="hero-lead">
                Folio para cada bolsa, aviso por WhatsApp en un toque y corte de
                caja sin calculadora. Despídete de la libreta.
              </p>
              <p className="price-tag">
                Plan de por vida <s>{mxn(plans.lifetime)}</s> <b>$0</b>
              </p>
              <ul className="perks">
                {perks.map((p) => (
                  <li key={p}>
                    <Check size={16} strokeWidth={3} aria-hidden="true" /> {p}
                  </li>
                ))}
              </ul>
              <SpotsLeft />
            </div>
            <div className="tester-form-wrap">
              {testerProgram.open ? (
                <TesterForm />
              ) : (
                <div className="tester-card">
                  <h2>Los lugares ya se llenaron</h2>
                  <p>Gracias. Muy pronto podrás descargar Lávale en Google Play.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="tester-demo">
          <div className="container tester-demo-grid">
            <div>
              <h2 className="section-title">Así se ve en tu mostrador</h2>
              <ul className="tester-features">
                {features.map((f) => (
                  <li key={f.title}>
                    <span className="feature-icon" aria-hidden="true">
                      <f.icon size={20} strokeWidth={2.2} />
                    </span>
                    <span>
                      <strong>{f.title}</strong>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="tester-demo-phone">
              <HeroPhone />
            </div>
          </div>
        </section>

        <section className="tester-how">
          <div className="container narrow">
            <h2 className="section-title">Cómo te la quedas gratis</h2>
            <ol className="tester-steps">
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
            </ol>
            <a className="btn btn-primary tester-again" href="#apartar">
              Apartar mi lugar
            </a>
          </div>
        </section>

        <section className="faq-section">
          <div className="container narrow">
            <h2 className="section-title">Preguntas</h2>
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
