import type { Metadata } from "next";
import Footer from "@/components/Footer";
import LandingNav from "@/components/LandingNav";
import { privacyEmail, privacyOwner } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aviso de privacidad · Lávale",
  description: "Qué datos usa Lávale, la app y este sitio, y para qué.",
  alternates: { canonical: "/privacidad" },
};

const updated = "22 de noviembre de 2026";

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
            No salen de ahí, a menos que tú enciendas el respaldo en la nube
            o «Varios celulares» (ver el punto 2). Los archivos PDF que
            exportas quedan donde tú decidas guardarlos o compartirlos.
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
              <strong>Respaldo en la nube (opcional).</strong> Viene apagado.
              Si lo enciendes en Ajustes → «Respaldo en la nube», una copia de
              tu registro (pedidos, nombres, teléfonos y domicilios de tus
              clientes, servicios, precios, cobros, gastos y cortes) se guarda
              en nuestros servidores, alojados con Supabase en Canadá, para que
              la recuperes si cambias o pierdes tu teléfono. La copia se liga a
              tu compra con el identificador anónimo de RevenueCat; no te
              pedimos correo ni contraseña. Las fotos de «Cómo llegó» no se
              suben. Los datos de tus clientes son tuyos: nosotros solo los
              guardamos por encargo tuyo, no los usamos para otra cosa y no los
              compartimos. Guardamos la copia más reciente y algunas de los
              últimos 7 días. Puedes apagarlo cuando quieras: deja de subir
              cambios y la copia se conserva hasta que nos pidas borrarla.
            </li>
            <li>
              <strong>Varios celulares (opcional).</strong> Viene apagado. Si
              lo enciendes en Ajustes → «Varios celulares», tu registro se
              guarda en la nube, igual que el respaldo, y además se copia en
              los celulares que tú unas con un código: tus empleados ven y
              capturan los mismos pedidos, clientes y cobros desde su teléfono.
              Guardamos el nombre que cada quien escribe al unirse, para que
              sepas de quién es cada celular, y cuándo se conectó por última
              vez. Tú decides quién entra y lo puedes quitar cuando quieras: al
              quitarlo, o si dejas de compartir, la copia de ese celular se
              borra la siguiente vez que abre la app con internet.
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
            Para borrar tu respaldo en la nube, escríbenos desde «Escríbenos»
            en Ajustes de la app con el mensaje «Borrar mi respaldo»: así
            sabemos de qué lavandería es, porque no tenemos tu correo ni tu
            nombre. Lo borramos en un máximo de 20 días hábiles.
          </p>
          <p>
            Desinstalar Lávale o borrar los datos de la app elimina el registro
            local, pero no el respaldo en la nube si lo habías encendido. Tampoco
            cancela la suscripción: se administra desde Google Play o App Store.
          </p>
          <p>
            Si tu celular está unido a la lavandería de otra persona, «Salir de
            esta lavandería» en Ajustes → «Varios celulares» borra la copia de
            tu celular. Los datos de la lavandería son de su dueño: para
            cualquier solicitud sobre ellos, acude a él.
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
