import type { Metadata } from "next";
import Footer from "@/components/Footer";
import LandingNav from "@/components/LandingNav";
import { privacyEmail, privacyOwner } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aviso de privacidad · Lávale",
  description: "Qué datos usa Lávale, la app y este sitio, y para qué.",
  alternates: { canonical: "/privacidad" },
};

const updated = "29 de octubre de 2026";

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

          <h2>1. Registro local</h2>
          <p>
            Los pedidos, nombres, teléfonos y domicilios de tus clientes,
            servicios, cobros, gastos y cortes se guardan en tu dispositivo.
            No se sincronizan entre equipos. Los archivos PDF que exportas quedan
            donde tú decidas guardarlos o compartirlos.
          </p>
          <p>
            Cuando mandas un ticket o un aviso por WhatsApp, la app solo abre
            WhatsApp con el mensaje listo. Tú decides si lo envías.
          </p>

          <h2>2. Datos que sí salen de tu teléfono</h2>
          <ul>
            <li>
              <strong>Estadísticas anónimas.</strong> Qué pantallas
              y acciones se usan (por ejemplo, «pedido creado»), la versión de
              la app y el sistema, con un identificador al azar que no se
              relaciona contigo. Sin nombres, teléfonos ni importes. Se usan para
              mejorar la app. Vienen activadas y las puedes apagar cuando quieras
              en Ajustes → «Compartir uso anónimo».
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
              identificador anónimo. La tienda y RevenueCat verifican las compras
              y renovaciones. No vemos tu tarjeta ni
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

          <h2>3. Inscripciones anteriores</h2>
          <p>
            Este sitio ya no recibe inscripciones al programa de prueba. Si te
            inscribiste antes y tienes una solicitud sobre tus datos o tu
            inscripción, puedes escribir al contacto de este aviso.
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
            Para solicitar que borremos las conversaciones de soporte, tu
            inscripción a la prueba o los datos ligados a tu identificador
            anónimo, {contact} con el asunto «Borrar mis datos».
            Si usaste funciones conectadas de una versión anterior, también
            puedes solicitar la eliminación de esos registros. Los borramos en
            un máximo de 20 días hábiles. Las compras quedan registradas en
            Google Play o App Store según sus propias reglas.
          </p>
          <p>
            Desinstalar Lávale o borrar los datos de la app elimina el registro
            local. Esto no cancela la suscripción: se administra desde Google
            Play o App Store.
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
