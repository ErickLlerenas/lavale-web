/// Una sola fuente para marca, tiendas y precios de la landing.
/// Cuando la app esté publicada, llena `stores` y los botones de descarga
/// aparecen solos en lugar de "Próximamente".

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lavaleapp.vercel.app";

export const brandName = "Lávale";
export const brandNamePlain = "Lavale";
export const tagline = "Control para lavanderías";

export const siteTitle = "Lávale · Control para lavanderías en México";
export const siteDescription =
  "Lávale es la app para lavanderías por kilo: folio para cada bolsa, aviso por WhatsApp cuando la ropa está lista y corte de caja. Funciona sin internet y sin crear cuenta.";

/// `null` mientras la app no esté publicada en esa tienda.
export const stores: { google: string | null; apple: string | null } = {
  google: null,
  apple: null,
};

export const isPublished = Boolean(stores.google || stores.apple);

/// Prueba cerrada de Google Play (12 testers × 14 días). Los enlaces vienen de
/// variables de entorno en Vercel para cambiarlos sin tocar código.
export const testerProgram = {
  open: process.env.NEXT_PUBLIC_TESTER_PROGRAM !== "closed",
  days: 14,
  /// Grupo de Google que está dado de alta como lista de testers en Play.
  groupUrl: process.env.NEXT_PUBLIC_TESTER_GROUP_URL || null,
  /// Enlace de inscripción de la prueba cerrada (play.google.com/apps/testing/…).
  playTestUrl: process.env.NEXT_PUBLIC_PLAY_TEST_URL || null,
};

/// Proyecto de Supabase donde la web solo puede insertar inscripciones.
export const signupApi = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null,
};

/// Correo para temas de privacidad. `null` = solo el chat dentro de la app.
export const privacyEmail: string | null =
  process.env.NEXT_PUBLIC_PRIVACY_EMAIL || null;

/// Mismos valores que `lib/core/billing/plan_catalog.dart` en la app.
export const plans = {
  monthly: 99,
  lifetime: 1999,
  trialDays: 7,
} as const;

/// Precio por kilo de ejemplo para el cálculo "se paga con N kilos".
export const exampleKiloPrice = 28;

export const kilosToPay = Math.ceil(plans.monthly / exampleKiloPrice);

export function mxn(value: number) {
  return `$${value.toLocaleString("es-MX")}`;
}

/// Responsable del aviso de privacidad (la LFPDPPP pide nombre). Llénalo en
/// Vercel con `NEXT_PUBLIC_PRIVACY_OWNER`.
export const privacyOwner =
  process.env.NEXT_PUBLIC_PRIVACY_OWNER || "El equipo de Lávale";
