/// Una sola fuente para marca, tiendas y precios de la landing.

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lavaleapp.vercel.app";

export const brandName = "Lávale";
export const brandNamePlain = "Lavale";
export const tagline = "Control para lavanderías";

export const siteTitle = "Lávale · Control para lavanderías en México";
export const siteDescription =
  "Lávale es la app para lavanderías: folio para cada bolsa, aviso por WhatsApp cuando la ropa está lista y corte de caja. Funciona sin internet y sin crear cuenta.";

/// Fichas públicas de la app en cada tienda.
export const stores = {
  google: "https://play.google.com/store/apps/details?id=mx.ejele.lavale",
  apple: "https://apps.apple.com/mx/app/id6819459731",
} as const;

/// Public backend configuration used by the private administration page.
export const publicApi = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null,
};

/// Correo para temas de privacidad. `null` = solo el chat dentro de la app.
export const privacyEmail: string | null =
  process.env.NEXT_PUBLIC_PRIVACY_EMAIL || null;

/// Mismos valores que `lib/core/billing/plan_catalog.dart` en la app.
export const plans = {
  monthly: 99,
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
