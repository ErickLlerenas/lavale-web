import { signupApi } from "@/lib/site";

/// Pasos del embudo de /probar. Deben coincidir con la lista permitida de
/// `record_web_event` (migración 005 en el repo de la app).
export type WebEvent =
  | "probar_view"
  | "download_view"
  | "group_click"
  | "play_click"
  | "chrome_open";

/// Cuenta un paso del embudo. Sin datos personales: solo el nombre del paso
/// y el anuncio de origen. Si falla, no pasa nada.
export function track(name: WebEvent, source?: string | null) {
  if (!signupApi.url || !signupApi.anonKey) return;
  try {
    fetch(`${signupApi.url}/rest/v1/rpc/record_web_event`, {
      method: "POST",
      keepalive: true,
      headers: {
        apikey: signupApi.anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_name: name, p_source: source ?? null }),
    }).catch(() => {});
  } catch {
    /* sin estadísticas no se rompe nada */
  }
}

/// Cuántas lavanderías ya apartaron lugar (sin contar las de iPhone).
export async function fetchSignupCount(): Promise<number | null> {
  if (!signupApi.url || !signupApi.anonKey) return null;
  try {
    const response = await fetch(`${signupApi.url}/rest/v1/rpc/tester_signup_count`, {
      method: "POST",
      headers: {
        apikey: signupApi.anonKey,
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    if (!response.ok) return null;
    const value = await response.json();
    return typeof value === "number" ? value : null;
  } catch {
    return null;
  }
}
