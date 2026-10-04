import {
  Archive,
  BellRing,
  Check,
  CloudOff,
  HandCoins,
  MessageCircle,
  NotebookPen,
  Scale,
  Search,
  ShoppingBag,
  StickyNote,
  Tag,
  Users,
  Wallet,
  X,
} from "lucide-react";
import Footer from "@/components/Footer";
import GetApp from "@/components/GetApp";
import HeroPhone from "@/components/HeroPhone";
import LandingNav from "@/components/LandingNav";
import {
  brandName,
  exampleKiloPrice,
  kilosToPay,
  mxn,
  plans,
  siteDescription,
  siteUrl,
  whatsappLink,
} from "@/lib/site";

const beforeAfter = [
  {
    before: "Bolsas sin nombre y ropa que se revuelve",
    after: "Cada bolsa con su folio y su estante",
  },
  {
    before: "Llamar uno por uno para avisar",
    after: "Aviso por WhatsApp en un toque",
  },
  {
    before: "Sumar kilos y anticipos a mano",
    after: "Total y saldo automáticos",
  },
  {
    before: "Una caja que nunca cuadra",
    after: "Corte de caja al peso",
  },
];

const features = [
  {
    icon: Scale,
    title: "Recibe por kilo",
    text: "Escribe el peso y Lávale calcula el total, redondeado al peso. Edredones, cobijas o planchado se suman con un toque.",
  },
  {
    icon: Tag,
    title: "Folio para cada bolsa",
    text: "Al guardar, el folio sale en grande para escribirlo con plumón. Al terminar, anotas el estante: «Está en A2».",
  },
  {
    icon: MessageCircle,
    title: "Ticket y aviso por WhatsApp",
    text: "Mándale su ticket al cliente y avísale cuando su ropa esté lista, con folio y saldo. Sin impresora.",
  },
  {
    icon: HandCoins,
    title: "Anticipos y cobros",
    text: "Efectivo, tarjeta o transferencia. Te sugiere billetes y te dice el cambio. Cobras y entregas en un solo paso.",
  },
  {
    icon: Wallet,
    title: "Corte de caja por turno",
    text: "Cuenta el efectivo, ve la diferencia y comparte el corte con el dueño por WhatsApp.",
  },
  {
    icon: CloudOff,
    title: "Sin internet ni cuenta",
    text: "Todo vive en tu teléfono. Abres la app, pones el nombre de tu negocio y tu precio por kilo, y listo.",
  },
];

const extras = [
  { icon: Users, label: "Clientes frecuentes" },
  { icon: Search, label: "Búsqueda por folio o teléfono" },
  { icon: StickyNote, label: "Notas: sin suavizante, delicada…" },
  { icon: BellRing, label: "Recordatorio de ropa olvidada" },
  { icon: Archive, label: "Respaldo para cambiar de teléfono" },
];

const steps = [
  {
    n: "1",
    title: "Recibe",
    text: "Nombre, kilos y cuándo se entrega. Folio a la bolsa.",
  },
  {
    n: "2",
    title: "Avisa",
    text: "Marca como lista y manda el WhatsApp con su saldo.",
  },
  {
    n: "3",
    title: "Cobra y entrega",
    text: "Cobras lo que falta y entregas en el mismo paso.",
  },
];

const planBenefits = [
  "Avisa por WhatsApp cuando la ropa está lista",
  "Cada bolsa con su folio: nada se revuelve",
  "Corte de caja que cuadra al peso",
  "Sin internet ni cuenta. Tus datos, en tu teléfono",
];

const faqs = [
  {
    q: "¿Necesito internet?",
    a: "No. Recibes, cobras y entregas sin conexión. Solo usas internet si quieres mandar el WhatsApp en ese momento.",
  },
  {
    q: "¿Necesito impresora?",
    a: "No. El ticket le llega al cliente por WhatsApp o PDF, y la bolsa se marca con el folio usando un plumón.",
  },
  {
    q: "¿Dónde quedan mis datos?",
    a: "En tu teléfono. No hay cuenta ni nube. Puedes sacar un respaldo para guardarlo o pasarlo a otro equipo.",
  },
  {
    q: "¿Funciona en Android y iPhone?",
    a: "Sí, en los dos. Por ahora funciona en un solo equipo por lavandería; no sincroniza entre sucursales.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: `Un solo plan con todo: ${mxn(plans.monthly)} al mes con ${plans.trialDays} días gratis, o ${mxn(plans.lifetime)} una sola vez y es tuya para siempre.`,
  },
];

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: brandName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Android, iOS",
    url: siteUrl,
    description: siteDescription,
    offers: [
      { "@type": "Offer", price: plans.monthly, priceCurrency: "MXN" },
      { "@type": "Offer", price: plans.lifetime, priceCurrency: "MXN" },
    ],
  };
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
      <LandingNav />
      <main>
        {/* ---------- Hero ---------- */}
        <section className="hero">
          <div className="bubbles" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className={`bubble b${i}`} />
            ))}
          </div>
          <div className="hero-content">
            <div className="hero-copy">
              <p className="eyebrow">App para lavanderías por kilo</p>
              <h1>
                Recibe, cobra y entrega <em>sin libreta.</em>
              </h1>
              <p className="hero-lead">
                Lávale le pone folio a cada bolsa, avisa por WhatsApp cuando la
                ropa está lista y te cuadra la caja. Sin internet y sin crear
                cuenta.
              </p>
              <GetApp />
            </div>
            <div className="hero-visual">
              <HeroPhone />
            </div>
          </div>
        </section>

        {/* ---------- Antes / después ---------- */}
        <section className="compare-section">
          <div className="container">
            <h2 className="section-title">¿Todavía con libreta y papelitos?</h2>
            <p className="section-sub">
              Lávale está hecha para lavanderías pequeñas que hoy anotan todo a
              mano.
            </p>
            <div className="compare">
              <div className="compare-col before">
                <h3>
                  <NotebookPen size={20} aria-hidden="true" /> Con libreta
                </h3>
                <ul>
                  {beforeAfter.map((r) => (
                    <li key={r.before}>
                      <X size={18} aria-hidden="true" />
                      {r.before}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="compare-col after">
                <h3>
                  <img src="/logo.svg" alt="" width="22" height="22" /> Con
                  Lávale
                </h3>
                <ul>
                  {beforeAfter.map((r) => (
                    <li key={r.after}>
                      <Check size={18} aria-hidden="true" />
                      {r.after}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Funciones ---------- */}
        <section id="funciones" className="features-section">
          <div className="container">
            <h2 className="section-title">Todo lo que pasa en el mostrador</h2>
            <p className="section-sub">
              Botones grandes y pocos pasos, para recibir tu primer pedido en minutos.
            </p>
            <ul className="features">
              {features.map((f) => (
                <li key={f.title} className="feature">
                  <span className="feature-icon" aria-hidden="true">
                    <f.icon size={22} strokeWidth={2.2} />
                  </span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </li>
              ))}
            </ul>
            <div className="extras">
              <p>Y también:</p>
              <ul>
                {extras.map((e) => (
                  <li key={e.label}>
                    <e.icon size={16} strokeWidth={2.2} aria-hidden="true" />
                    {e.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- Pasos ---------- */}
        <section id="como-funciona" className="steps-section">
          <div className="container">
            <h2 className="section-title">Un pedido en 3 pasos</h2>
            <p className="section-sub">
              Del mostrador a las manos del cliente, sin perder una bolsa.
            </p>
            <ol className="steps">
              {steps.map((s) => (
                <li className="step" key={s.n}>
                  <span className="step-num">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
            <div className="no-printer">
              <ShoppingBag size={22} aria-hidden="true" />
              <p>
                <strong>No necesitas impresora.</strong> El ticket va por
                WhatsApp o PDF y la bolsa se marca con el folio.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Precios ---------- */}
        <section id="precios" className="pricing-section">
          <div className="container">
            <h2 className="section-title">
              Lávale se paga con {kilosToPay} kilos al mes
            </h2>
            <p className="section-sub">
              Si cobras {mxn(exampleKiloPrice)} el kilo, con {kilosToPay} kilos
              ya cubriste el mes. Un solo plan, con todo incluido.
            </p>
            <div className="pricing">
              <div className="plan">
                <span className="plan-ribbon">{plans.trialDays} días gratis</span>
                <h3>Mensual</h3>
                <div className="plan-price">
                  <span className="amount">{mxn(plans.monthly)}</span>
                  <span className="period">MXN / mes</span>
                </div>
                <p className="plan-note">Cancela cuando quieras.</p>
                <ul className="plan-list">
                  {planBenefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <a
                  className="btn btn-primary"
                  href={whatsappLink("Hola, quiero probar Lávale gratis en mi lavandería.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Empezar mis {plans.trialDays} días gratis
                </a>
              </div>
              <div className="plan plan-lifetime">
                <h3>De por vida</h3>
                <div className="plan-price">
                  <span className="amount">{mxn(plans.lifetime)}</span>
                  <span className="period">MXN · pago único</span>
                </div>
                <p className="plan-note">Pagas una vez y es tuya.</p>
                <ul className="plan-list">
                  {planBenefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <a
                  className="btn btn-light"
                  href={whatsappLink("Hola, me interesa Lávale de por vida para mi lavandería.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Quiero Lávale de por vida
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Preguntas ---------- */}
        <section id="preguntas" className="faq-section">
          <div className="container narrow">
            <h2 className="section-title">Preguntas frecuentes</h2>
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

        {/* ---------- CTA ---------- */}
        <section className="cta-section">
          <div className="container">
            <div className="cta">
              <div className="bubbles" aria-hidden="true">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} className={`bubble b${i}`} />
                ))}
              </div>
              <img src="/logo.svg" alt="" width="64" height="64" className="cta-logo" />
              <h2>Tu lavandería, en orden desde hoy.</h2>
              <p>
                Lávale está en beta. Escríbenos y te ayudamos a recibir tu
                primer pedido.
              </p>
              <GetApp tone="light" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
