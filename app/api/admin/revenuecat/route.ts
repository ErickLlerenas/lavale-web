import { NextResponse } from "next/server";

/// Ventas de RevenueCat para el panel. La llave secreta vive solo en Vercel
/// (REVENUECAT_API_KEY, v2 de solo lectura); el navegador nunca la ve.
/// Solo contesta a quien la base reconoce como admin (misma regla del panel).
export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const rcKey = process.env.REVENUECAT_API_KEY;
/// Id del proyecto Lávale en RevenueCat (la URL del panel dice 8802b1fc).
const rcProject = process.env.REVENUECAT_PROJECT_ID || "proj8802b1fc";

type Metric = { id: string; name: string; value: number; unit: string };

async function isAdmin(token: string) {
  if (!supabaseUrl || !anonKey) return false;
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/is_admin`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: "{}",
    cache: "no-store",
  });
  return response.ok && (await response.json()) === true;
}

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!token || !(await isAdmin(token))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!rcKey) return NextResponse.json({ connected: false });
  try {
    const response = await fetch(
      `https://api.revenuecat.com/v2/projects/${rcProject}/metrics/overview?currency=MXN`,
      { headers: { Authorization: `Bearer ${rcKey}` }, cache: "no-store" },
    );
    if (!response.ok) {
      return NextResponse.json({
        connected: true,
        error:
          response.status === 401 || response.status === 403
            ? "RevenueCat rechazó la llave. Revisa que tenga permiso de lectura de métricas."
            : response.status === 404
              ? "RevenueCat no encontró el proyecto. Revisa REVENUECAT_PROJECT_ID."
              : "RevenueCat no respondió. Intenta otra vez.",
      });
    }
    const body = (await response.json()) as { metrics?: Metric[] };
    const metrics = (body.metrics ?? []).map(({ id, name, value, unit }) => ({
      id,
      name,
      value,
      unit,
    }));
    return NextResponse.json({ connected: true, metrics });
  } catch {
    return NextResponse.json({
      connected: true,
      error: "RevenueCat no respondió. Intenta otra vez.",
    });
  }
}
