/// Lo que la página necesita saber del teléfono de quien la visita.
/// Solo se usa en el navegador; nada de esto sale del teléfono.

export type Visitor = {
  /// Abierta dentro de Facebook, Instagram, Messenger, TikTok…: ahí no hay
  /// sesión de Google y Play / Grupos piden iniciar sesión (o la bloquean).
  inApp: boolean;
  ios: boolean;
  android: boolean;
};

export function readVisitor(): Visitor {
  if (typeof navigator === "undefined") {
    return { inApp: false, ios: false, android: false };
  }
  const ua = navigator.userAgent || "";
  return {
    inApp: /FBAN|FBAV|FB_IAB|FBIOS|Instagram|Messenger|musical_ly|TikTok|Line\//i.test(ua),
    ios: /iPhone|iPad|iPod/i.test(ua),
    android: /Android/i.test(ua),
  };
}

/// Abre `path` de este mismo sitio en Chrome (Android). Si Chrome no está,
/// Android abre el navegador que tenga.
export function chromeUrl(path: string) {
  const { host, protocol } = window.location;
  const fallback = encodeURIComponent(`${protocol}//${host}${path}`);
  return `intent://${host}${path}#Intent;scheme=${protocol.replace(":", "")};package=com.android.chrome;S.browser_fallback_url=${fallback};end`;
}

/// Origen de la visita (utm_*) para saber qué anuncio funciona.
export function readSource(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const parts = ["utm_source", "utm_campaign", "utm_content"]
    .map((key) => params.get(key))
    .filter(Boolean);
  return parts.length ? parts.join(" / ").slice(0, 100) : null;
}
