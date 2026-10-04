import type { Metadata } from "next";
import Footer from "@/components/Footer";
import LandingNav from "@/components/LandingNav";
import { privacyEmail, privacyOwner } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aviso de privacidad · Lávale",
  description: "Qué datos usa Lávale, la app y este sitio, y para qué.",
  alternates: { canonical: "/privacidad" },
};

const updated = "4 de octubre de 2026";

export default function Privacidad() {
  const contact = privacyEmail ? (
    <>
      escríbenos a <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>
    </>
  ) : (
    <>escríbenos desde «Escríbenos» en Ajustes de la app</>
  );

  return (
    <>
      <LandingNav />
      <main className="legal">
        <div className="container narrow">
          <h1>Aviso de privacidad</h1>
          <p className="legal-updated">Última actualización: {updated}</p>

          <p>
            {privacyOwner} es responsable de los datos personales que se tratan
            con la app Lávale y con este sitio. Aquí explicamos qué datos usamos,
            para qué y cómo puedes ejercer tus derechos.
          </p>

          <h2>1. Lo que guardas en la app se queda en tu teléfono</h2>
          <p>
            Los pedidos, nombres y teléfonos de tus clientes, cobros, gastos y
            cortes de caja se guardan solo en tu dispositivo. No tenemos una
            copia ni una cuenta tuya. Si haces un respaldo, el archivo queda donde
            tú decidas guardarlo o mandarlo.
          </p>
          <p>
            Cuando mandas un ticket o un aviso por WhatsApp, la app solo abre
            WhatsApp con el mensaje listo. Tú decides si lo envías.
          </p>

          <h2>2. Datos que sí salen de tu teléfono</h2>
          <ul>
            <li>
              <strong>Estadísticas anónimas (opcional).</strong> Solo si lo
              activas en Ajustes: qué pantallas y acciones se usan (por ejemplo,
              «pedido creado»), la versión de la app y el sistema. Sin nombres,
              teléfonos ni importes. Se usan para mejorar la app.
            </li>
            <li>
              <strong>Chat de soporte.</strong> Si nos escribes desde la app, el
              chat lo procesa Crisp (crisp.chat). Se envía lo que escribas, el
              nombre de tu negocio y datos técnicos del equipo para poder
              contestarte.
            </li>
            <li>
              <strong>Compras.</strong> Los pagos los procesan Google Play o App
              Store. Usamos RevenueCat para saber qué plan tienes, con un
              identificador anónimo. No vemos tu tarjeta.
            </li>
          </ul>

          <h2>3. Inscripción a la prueba (este sitio)</h2>
          <p>
            Si te inscribes en lavaleapp.vercel.app/probar guardamos tu correo y,
            si los escribes, el nombre de tu lavandería, tu ciudad y de qué
            anuncio llegaste. Los usamos para darte acceso a la prueba de Google
            Play, mandarte tu código de regalo y pedirte comentarios sobre la
            app. Se guardan en Supabase y los borramos cuando termina el
            programa de prueba, salvo que nos pidas lo contrario antes.
          </p>

          <h2>4. Con quién compartimos datos</h2>
          <p>
            No vendemos ni rentamos datos. Solo los manejan los proveedores que
            hacen funcionar el servicio: Google (Play y Grupos), Apple, RevenueCat,
            Crisp, Supabase y Vercel, cada uno para lo descrito arriba.
          </p>

          <h2>5. Tus derechos</h2>
          <p>
            Puedes pedir acceso, corrección, cancelación u oposición al uso de
            tus datos (derechos ARCO), o retirar tu consentimiento. Para hacerlo,{" "}
            {contact}. Te respondemos en un máximo de 20 días hábiles.
          </p>

          <h2 id="borrar-datos">6. Cómo borrar tus datos</h2>
          <p>
            Lávale no tiene cuentas. Para pedir que borremos los datos que sí
            salen de tu teléfono (conversaciones del chat de soporte, tu
            inscripción a la prueba e historial de compras ligado a tu
            identificador anónimo), {contact} con el asunto «Borrar mis datos» e
            indica el nombre de tu negocio o tu correo. Los borramos en un máximo
            de 20 días hábiles. Las compras quedan registradas en Google Play o
            App Store según sus propias reglas.
          </p>
          <p>
            Lo que guardas en la app (pedidos, clientes, cobros) se borra al
            desinstalar Lávale o al borrar los datos de la app en los ajustes de
            tu teléfono.
          </p>

          <h2>7. Cambios a este aviso</h2>
          <p>
            Si cambia algo importante, actualizaremos esta página y la fecha de
            arriba.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
