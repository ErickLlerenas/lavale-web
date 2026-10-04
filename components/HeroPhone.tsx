/** Demostración ilustrativa: recibir ropa, folio para la bolsa y aviso por WhatsApp. */
export default function HeroPhone() {
  return (
    <div className="phone" aria-hidden="true">
      <div className="phone-notch" />
      <div className="phone-screen">
        <header className="app-top">
          <img src="/logo.svg" alt="" />
          <div>
            <strong>Lavandería La Espuma</strong>
            <span>Pedidos · hoy</span>
          </div>
        </header>

        <div className="demo">
          {/* 1 · Recibir ropa */}
          <div className="demo-stage stage-receive">
            <span className="demo-label">1 · Recibe la ropa</span>
            <div className="field">
              <small>Cliente</small>
              <span>Lupita Hernández</span>
            </div>
            <div className="field-row">
              <div className="field">
                <small>Peso</small>
                <span className="kilos">4.3 kg</span>
              </div>
              <div className="field">
                <small>Por kilo</small>
                <span>$28</span>
              </div>
            </div>
            <div className="chips">
              <span className="chip on">+ Edredón</span>
              <span className="chip">Sin suavizante</span>
            </div>
            <div className="total">
              <span>Total</span>
              <strong>$200</strong>
            </div>
            <div className="mini-row">
              <span>Anticipo</span>
              <b>$100</b>
            </div>
            <div className="btn-app">Guardar pedido</div>
          </div>

          {/* 2 · Folio */}
          <div className="demo-stage stage-folio">
            <span className="demo-label">2 · Escribe el folio en la bolsa</span>
            <div className="folio">
              <small>Folio</small>
              <strong>128</strong>
              <span>Entrega: mañana</span>
            </div>
            <div className="bag">
              <span>128</span>
            </div>
            <div className="btn-app btn-wa">Enviar ticket por WhatsApp</div>
          </div>

          {/* 3 · Aviso */}
          <div className="demo-stage stage-notify">
            <span className="demo-label">3 · Avisa que está lista</span>
            <div className="wa-head">
              <span className="wa-avatar">L</span>
              <div>
                <strong>Lupita</strong>
                <small>WhatsApp</small>
              </div>
            </div>
            <div className="wa-bubble">
              ¡Hola Lupita! Tu ropa ya está lista 🧺
              <br />
              Folio <b>128</b> · Saldo <b>$100</b>
              <span className="wa-time">10:42 ✓✓</span>
            </div>
            <div className="status-row">
              <span className="pill ready">Lista · Estante A2</span>
              <span className="pill sent">Avisado</span>
            </div>
            <div className="btn-app">Cobrar $100 y entregar</div>
          </div>
        </div>
      </div>
    </div>
  );
}
