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
    // Pruebas por día y tienda: si falla (p. ej. la llave no tiene permiso de
    // gráficas), el resto de Dinero sigue y el panel cuenta con la app.
    const trials = await trialsByDay().catch(() => null);
    return NextResponse.json({ connected: true, metrics, trials });
  } catch {
    return NextResponse.json({
      connected: true,
      error: "RevenueCat no respondió. Intenta otra vez.",
    });
  }
}

type TrialDay = { day: string; total: number; ios: number; android: number };

/// Gráfica «New Trials» de los últimos 35 días, por tienda (permiso
/// charts_metrics:charts:read). Los días de RevenueCat van en UTC, igual que
/// su panel, así que «hoy» cuadra con lo que Erick ve allá.
async function trialsByDay(): Promise<TrialDay[] | null> {
  const day = (d: Date) => d.toISOString().slice(0, 10);
  const end = new Date();
  const start = new Date(end.getTime() - 34 * 86_400_000);
  const params = new URLSearchParams({
    realtime: "true",
    start_date: day(start),
    end_date: day(end),
    resolution: "0",
    segment: "store",
  });
  const response = await fetch(
    `https://api.revenuecat.com/v2/projects/${rcProject}/charts/trials_new?${params}`,
    { headers: { Authorization: `Bearer ${rcKey}` }, cache: "no-store" },
  );
  if (!response.ok) return null;
  const body = (await response.json()) as {
    values?: { cohort: number; segment?: number; value: number }[];
    segments?: { display_name: string; is_total?: boolean }[];
  };
  const segments = body.segments ?? [];
  const byDay = new Map<string, TrialDay>();
  for (const point of body.values ?? []) {
    if (typeof point?.cohort !== "number") return null;
    const key = day(new Date(point.cohort * 1000));
    const row = byDay.get(key) ?? { day: key, total: 0, ios: 0, android: 0 };
    const segment = segments[point.segment ?? 0];
    if (segment?.is_total) row.total = point.value;
    else if (segment?.display_name === "App Store") row.ios = point.value;
    else if (segment?.display_name === "Play Store") row.android = point.value;
    byDay.set(key, row);
  }
  return [...byDay.values()].sort((a, b) => a.day.localeCompare(b.day));
}
