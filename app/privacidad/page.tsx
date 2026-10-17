import type { Metadata } from "next";
import Footer from "@/components/Footer";
import LandingNav from "@/components/LandingNav";
import { privacyEmail, privacyOwner } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aviso de privacidad · Lávale",
  description: "Qué datos usa Lávale, la app y este sitio, y para qué.",
  alternates: { canonical: "/privacidad" },
};

const updated = "16 de octubre de 2026";

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

          <h2>1. Registro local y sincronización Pro</h2>
          <p>
            En Básico, los pedidos, nombres y teléfonos de tus clientes, cobros,
            gastos y cortes de caja se guardan en tu dispositivo. Si haces un
            respaldo, el archivo queda donde tú decidas guardarlo o mandarlo.
          </p>
          <p>
            Si activas Pro y conectas tu lavandería, se guardan en Supabase los
            pedidos, datos de clientes (nombre, teléfono y domicilio de recogida
            si lo agregas), prendas, notas, importes, abonos, estado de entrega,
            servicios y precios. Esto permite compartir los cambios entre el
            local y los repartidores que tú vincules. Cada repartidor consulta
            sus propios pedidos; el dueño consulta los del equipo y puede
            desvincular dispositivos. Los cortes, gastos y ventas de mostrador
            siguen siendo locales.
          </p>
          <p>
            Pro identifica cada dispositivo mediante una sesión anónima y un
            identificador, sin pedir correo ni contraseña. También guarda el
            nombre que eliges para el dispositivo o repartidor y quién registró
            cada cobro. Sin señal, los cambios quedan en el dispositivo y se
            envían al recuperar internet.
          </p>
          <p>
            Cuando mandas un ticket o un aviso por WhatsApp, la app solo abre
            WhatsApp con el mensaje listo. Tú decides si lo envías.
          </p>

          <h2>2. Datos que sí salen de tu teléfono</h2>
          <ul>
            <li>
              <strong>Estadísticas anónimas (opcional).</strong> Qué pantallas
              y acciones se usan (por ejemplo, «pedido creado»), la versión de
              la app y el sistema, con un identificador al azar que no se
              relaciona contigo. Sin nombres, teléfonos ni importes. Se usan para
              mejorar la app. En la versión de prueba (testers) vienen
              encendidas; en las demás solo si las activas. Las puedes apagar
              cuando quieras en Ajustes → «Ayudar a mejorar Lávale».
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
              identificador anónimo. Para activar o recuperar el local Pro,
              nuestro servidor verifica el comprobante de la tienda y el estado
              de la suscripción con RevenueCat. Conservamos una referencia de la
              compra para recuperar la misma lavandería. No vemos tu tarjeta ni
              la contraseña de tu cuenta Apple o Google.
            </li>
            <li>
              <strong>Medición de anuncios (Meta).</strong> Anunciamos Lávale en
              Facebook e Instagram. La app le avisa a Meta cuando se abre, cuando
              empiezas la prueba gratis o compras un plan (con su precio) y cuando
              ya recibiste tus primeros pedidos, para saber qué anuncios
              funcionan. Nunca le mandamos tus pedidos, clientes, teléfonos ni
              cobros. En iPhone, el identificador de publicidad solo se usa si
              aceptas el permiso de rastreo de Apple; puedes cambiarlo en Ajustes
              → Privacidad → Rastreo.
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
            Meta, Crisp, Supabase y Vercel, cada uno para lo descrito arriba.
          </p>

          <h2>5. Tus derechos</h2>
          <p>
            Puedes pedir acceso, corrección, cancelación u oposición al uso de
            tus datos (derechos ARCO), o retirar tu consentimiento. Para hacerlo,{" "}
            {contact}. Te respondemos en un máximo de 20 días hábiles.
          </p>

          <h2 id="borrar-datos">6. Cómo borrar tus datos</h2>
          <p>
            Para solicitar que borremos los datos sincronizados de Pro, las
            conversaciones de soporte, tu inscripción a la prueba o los datos
            ligados a tu identificador anónimo, {contact} con el asunto
            «Borrar mis datos». Para Pro, haz la solicitud desde el dispositivo
            del dueño e indica el nombre de tu lavandería para que podamos
            verificar la solicitud. Los borramos en un máximo
            de 20 días hábiles. Las compras quedan registradas en Google Play o
            App Store según sus propias reglas.
          </p>
          <p>
            Desinstalar Lávale o borrar los datos de la app elimina el registro
            local, pero no borra los pedidos que hayas sincronizado con Pro.
            Borrar datos o desvincular un dispositivo tampoco cancela la
            suscripción: se administra desde Google Play o App Store.
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
