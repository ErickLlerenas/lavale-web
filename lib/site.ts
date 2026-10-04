/// Una sola fuente para marca, contacto, tiendas y precios de la landing.
/// Cuando la app esté publicada, llena `stores` y los botones de descarga
/// aparecen solos en lugar de "Próximamente".

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lavale-web.vercel.app";

export const brandName = "Lávale";
export const brandNamePlain = "Lavale";
export const tagline = "Tickets para lavanderías";

export const siteTitle = "Lávale · Tickets para lavanderías en México";
export const siteDescription =
  "Lávale es la app para lavanderías por kilo: folio para cada bolsa, aviso por WhatsApp cuando la ropa está lista y corte de caja. Funciona sin internet y sin crear cuenta.";

/// WhatsApp para pedir la beta (formato internacional, sin "+").
export const whatsappNumber = "523331041584";

export function whatsappLink(
  message = "Hola, tengo una lavandería y quiero probar Lávale.",
) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/// `null` mientras la app no esté publicada en esa tienda.
export const stores: { google: string | null; apple: string | null } = {
  google: null,
  apple: null,
};

export const isPublished = Boolean(stores.google || stores.apple);

/// Mismos valores que `lib/core/billing/plan_catalog.dart` en la app.
export const plans = {
  monthly: 149,
  lifetime: 2499,
  trialDays: 7,
} as const;

/// Precio por kilo de ejemplo para el cálculo "se paga con N kilos".
export const exampleKiloPrice = 28;

export const kilosToPay = Math.ceil(plans.monthly / exampleKiloPrice);

export function mxn(value: number) {
  return `$${value.toLocaleString("es-MX")}`;
}
