import { LogOut, RefreshCw } from "lucide-react";
import css from "./Panel.module.css";

/// Lo que devuelve `admin_dashboard` y usa este panel: un renglón por teléfono.
export type Install = {
  id: string;
  first_seen: string;
  last_seen: string;
  days_active: number;
  orders: number;
  app_version: string;
  platform: string;
  onboarded: boolean;
  plans: boolean;
  /// Tocó comprar (aunque luego cancelara).
  trial: boolean;
  /// La tienda confirmó la compra: empezó la prueba o pagó.
  paid: boolean;
};

export type PanelData = { generated_at: string; installs: Install[] };

export type RcMetric = { id: string; name: string; value: number; unit: string };
/// Pruebas nuevas de un día (UTC) según RevenueCat.
export type TrialDay = { day: string; total: number; ios: number; android: number };
export type Rc =
  | null
  | { connected: false }
  | { connected: true; metrics?: RcMetric[]; error?: string; trials?: TrialDay[] | null };

export type Period = "hoy" | "ayer" | "7" | "30";

export const periods: { id: Period; label: string }[] = [
  { id: "hoy", label: "Hoy" },
  { id: "ayer", label: "Ayer" },
  { id: "7", label: "7 días" },
  { id: "30", label: "30 días" },
];

const tz = "America/Mexico_City";
/// El 3er pedido es el evento con el que optimizan los anuncios
/// (`MetaAds.ordersForActivation` en la app).
const signalOrders = 3;
/// Desde aquí la app manda la bienvenida y los planes; antes eran testers.
const predictorSince = "2026-10-17";

type Store = "ios" | "android";
type Row = Install & { day: string; store: Store | null };

function dayKey(date: Date) {
  return date.toLocaleDateString("en-CA", { timeZone: tz });
}

function addDays(day: string, n: number) {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function fmtDay(day: string) {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("es-MX", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-MX", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
  });
}

function ago(iso: string, now: number) {
  const days = Math.floor((now - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "hoy";
  if (days === 1) return "ayer";
  return `hace ${days} días`;
}

function pct(part: number, total: number) {
  return total > 0 ? `${Math.round((part / total) * 100)}%` : "—";
}

function storeOf(platform: string): Store | null {
  const p = platform.toLowerCase();
  return p === "ios" ? "ios" : p === "android" ? "android" : null;
}

const storeName: Record<Store, string> = { ios: "iPhone", android: "Android" };

const steps: { label: string; done: (r: Row) => boolean }[] = [
  { label: "Descargaron", done: () => true },
  { label: "Terminaron la bienvenida", done: (r) => r.onboarded },
  { label: "Primer pedido", done: (r) => r.orders >= 1 },
  { label: `${signalOrders} pedidos`, done: (r) => r.orders >= signalOrders },
  { label: "Vieron los planes", done: (r) => r.plans },
  { label: "Empezaron prueba", done: (r) => r.paid },
];

export default function Panel({
  data,
  rc,
  period,
  onPeriod,
  email,
  loading,
  error,
  onRefresh,
  onSignOut,
}: {
  data: PanelData | null;
  rc: Rc;
  period: Period;
  onPeriod: (period: Period) => void;
  email: string;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onSignOut: () => void;
}) {
  const now = data ? new Date(data.generated_at).getTime() : Date.now();
  const today = dayKey(new Date(now));
  // Hay teléfonos con la fecha adelantada: no cuentan hasta que llegue su día.
  const rows: Row[] = (data?.installs ?? [])
    .filter((i) => new Date(i.first_seen).getTime() <= now + 3_600_000)
    .map((i) => ({
      ...i,
      day: dayKey(new Date(i.first_seen)),
      store: storeOf(i.platform),
    }));

  const from =
    period === "hoy"
      ? today
      : period === "ayer"
        ? addDays(today, -1)
        : addDays(today, -(Number(period) - 1));
  const to = period === "ayer" ? addDays(today, -1) : today;
  const cohort = rows.filter((r) => r.day >= from && r.day <= to);
  const count = (list: Row[], done: (r: Row) => boolean) => list.filter(done).length;
  const byStore = (list: Row[], store: Store) => list.filter((r) => r.store === store);

  const downloads = cohort.length;
  // Las pruebas que empezaron en el periodo, como las cuenta RevenueCat. Sin
  // su gráfica, se cuenta con la app: solo quienes descargaron en el periodo.
  const rcTrials =
    rc?.connected && !rc.error && rc.trials
      ? rc.trials
          .filter((t) => t.day >= from && t.day <= to)
          .reduce((s, t) => ({ total: s.total + t.total, ios: s.ios + t.ios, android: s.android + t.android }), {
            total: 0,
            ios: 0,
            android: 0,
          })
      : null;
  const stats = [
    {
      label: "Descargas",
      value: downloads,
      detail: `iPhone ${byStore(cohort, "ios").length} · Android ${byStore(cohort, "android").length}`,
    },
    {
      label: "Primer pedido",
      value: count(cohort, (r) => r.orders >= 1),
      detail: `${pct(count(cohort, (r) => r.orders >= 1), downloads)} de las descargas`,
    },
    {
      label: `Llegaron a ${signalOrders} pedidos`,
      value: count(cohort, (r) => r.orders >= signalOrders),
      detail: `${pct(count(cohort, (r) => r.orders >= signalOrders), downloads)} · la señal de pago`,
      signal: true,
    },
    rcTrials
      ? {
          label: "Empezaron prueba",
          value: rcTrials.total,
          detail: `iPhone ${rcTrials.ios} · Android ${rcTrials.android}`,
        }
      : {
          label: "Empezaron prueba",
          value: count(cohort, (r) => r.paid),
          detail: `iPhone ${count(byStore(cohort, "ios"), (r) => r.paid)} · Android ${count(byStore(cohort, "android"), (r) => r.paid)}`,
        },
  ];

  // Últimos 14 días, cada uno con lo que hicieron quienes llegaron ese día.
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13)).map((day) => {
    const list = rows.filter((r) => r.day === day);
    return {
      day,
      ios: byStore(list, "ios").length,
      android: byStore(list, "android").length,
      total: list.length,
      signal: count(list, (r) => r.orders >= signalOrders),
      trials: count(list, (r) => r.paid),
    };
  });
  const maxDay = Math.max(1, ...days.map((d) => d.total));

  const buckets = [
    { label: "Sin pedidos", test: (r: Row) => r.orders === 0 },
    { label: "1 o 2 pedidos", test: (r: Row) => r.orders >= 1 && r.orders < signalOrders },
    { label: `${signalOrders} a 7 pedidos`, test: (r: Row) => r.orders >= signalOrders && r.orders < 8 },
    { label: "8 o más (ya vieron los planes)", test: (r: Row) => r.orders >= 8 },
  ].map((b) => {
    const list = rows.filter((r) => r.day >= predictorSince && b.test(r));
    return { label: b.label, phones: list.length, trials: count(list, (r) => r.paid) };
  });

  const trials = rows
    .filter((r) => r.paid)
    .sort((a, b) => b.first_seen.localeCompare(a.first_seen));

  const periodText =
    period === "hoy"
      ? "hoy"
      : period === "ayer"
        ? "ayer"
        : `del ${fmtDay(from)} al ${fmtDay(to)}`;

  return (
    <main className={css.page}>
      <div className={css.wrap}>
        <header className={css.top}>
          <img className={css.logo} src="/icon.png" alt="" />
          <div className={css.grow}>
            <h1 className={css.title}>Lávale</h1>
            <p className={css.subtitle}>
              {email}
              {data ? ` · actualizado ${fmtTime(data.generated_at)}` : ""}
            </p>
          </div>
          <button className={css.icon} onClick={onRefresh} disabled={loading} aria-label="Actualizar">
            <RefreshCw size={16} className={loading ? css.spin : undefined} />
          </button>
          <button className={css.icon} onClick={onSignOut} aria-label="Salir">
            <LogOut size={16} />
          </button>
        </header>

        <nav className={css.switch} aria-label="Periodo">
          {periods.map((p) => (
            <button
              key={p.id}
              className={p.id === period ? css.switchOn : css.switchOff}
              onClick={() => onPeriod(p.id)}
            >
              {p.label}
            </button>
          ))}
        </nav>

        {error && <p className={css.error}>{error}</p>}

        <section className={css.card}>
          <div className={css.stats}>
            {stats.map((s) => (
              <div className={css.stat} key={s.label}>
                <p className={css.label}>{s.label}</p>
                <p className={s.signal ? `${css.value} ${css.signal}` : css.value}>{s.value}</p>
                <p className={css.detail}>{s.detail}</p>
              </div>
            ))}
          </div>
          <p className={css.foot}>
            Descargas, primer pedido y 3 pedidos: quienes descargaron {periodText} y
            hasta dónde han llegado.{" "}
            {rcTrials
              ? `Prueba: las que empezaron ${periodText}, de RevenueCat (sus días van en hora UTC).`
              : "Prueba: de quienes descargaron en el periodo (desde la 1.0.22)."}
          </p>
        </section>

        <section className={css.card}>
          <h2 className={css.h2}>Dinero</h2>
          <Money rc={rc} />
        </section>

        <section className={css.card}>
          <h2 className={css.h2}>Hasta dónde llegan</h2>
          <p className={css.sub}>Quienes descargaron {periodText}, por tienda.</p>
          <div className={css.funnel}>
            <span />
            {(["ios", "android"] as Store[]).map((store) => (
              <span key={store} className={css.funnelHead}>
                <i className={css[store]} /> {storeName[store]}
              </span>
            ))}
            {steps.map((step) => (
              <FunnelRow key={step.label} label={step.label} step={step} cohort={cohort} />
            ))}
          </div>
        </section>

        <section className={css.card}>
          <h2 className={css.h2}>Últimos 14 días</h2>
          <p className={css.sub}>
            Descargas por día y, de esas, cuántas ya llegaron a {signalOrders} pedidos y
            a la prueba.
          </p>
          <div className={css.chart} role="img" aria-label="Descargas por día">
            {days.map((d) => (
              <div
                key={d.day}
                className={css.col}
                title={`${fmtDay(d.day)}: iPhone ${d.ios}, Android ${d.android}, ${d.signal} con ${signalOrders} pedidos, ${d.trials} en prueba`}
              >
                <span className={css.colTotal}>{d.total || ""}</span>
                <div className={css.colBar}>
                  <div className={css.ios} style={{ height: `${(d.ios / maxDay) * 100}%` }} />
                  <div className={css.android} style={{ height: `${(d.android / maxDay) * 100}%` }} />
                </div>
                <span className={css.colDay}>{Number(d.day.slice(8))}</span>
                <span className={d.signal ? css.colSignal : css.colZero}>{d.signal}</span>
                <span className={d.trials ? css.colTrial : css.colZero}>{d.trials}</span>
              </div>
            ))}
          </div>
          <p className={css.legend}>
            <span><i className={css.ios} /> iPhone</span>
            <span><i className={css.android} /> Android</span>
            <span className={css.legendSignal}>{signalOrders} pedidos</span>
            <span className={css.legendTrial}>Prueba</span>
          </p>
        </section>

        <section className={css.card}>
          <h2 className={css.h2}>¿Qué predice la prueba?</h2>
          <p className={css.sub}>
            Todos los teléfonos desde el {fmtDay(predictorSince)}, según cuántos pedidos
            hicieron. Por eso los anuncios buscan el {signalOrders}er pedido.
          </p>
          <ul className={css.rows}>
            {buckets.map((b) => (
              <li key={b.label}>
                <span>{b.label}</span>
                <span className={css.soft}>{b.phones} teléfonos</span>
                <b className={b.trials ? css.good : undefined}>
                  {b.trials} en prueba · {pct(b.trials, b.phones)}
                </b>
              </li>
            ))}
          </ul>
        </section>

        <section className={css.card}>
          <h2 className={css.h2}>Empezaron prueba</h2>
          <p className={css.sub}>Desde la 1.0.22, el más reciente primero.</p>
          {trials.length === 0 ? (
            <p className={css.sub}>Nadie todavía.</p>
          ) : (
            <ul className={css.list}>
              {trials.map((r) => (
                <li key={r.id}>
                  <div>
                    <b>{r.store ? storeName[r.store] : r.platform}</b>
                    <span className={css.soft}> · llegó el {fmtDay(r.day)}</span>
                  </div>
                  <p className={css.soft}>
                    {r.orders} pedidos · {r.days_active} {r.days_active === 1 ? "día" : "días"}{" "}
                    usándola · última vez {ago(r.last_seen, now)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

function FunnelRow({
  label,
  step,
  cohort,
}: {
  label: string;
  step: (typeof steps)[number];
  cohort: Row[];
}) {
  return (
    <>
      <span className={css.funnelLabel}>{label}</span>
      {(["ios", "android"] as Store[]).map((store) => {
        const list = cohort.filter((r) => r.store === store);
        const n = list.filter(step.done).length;
        const share = list.length ? n / list.length : 0;
        return (
          <span key={store} className={css.funnelCell}>
            <span className={css.track}>
              <span className={css[store]} style={{ width: `${Math.max(share > 0 ? 3 : 0, share * 100)}%` }} />
            </span>
            <b>{n}</b>
            <em>{pct(n, list.length)}</em>
          </span>
        );
      })}
    </>
  );
}

/// Lo que se muestra de RevenueCat y con qué nombre. El resto se ignora.
const rcTiles: { id: string; label: string; hint: string; money?: boolean }[] = [
  { id: "active_subscriptions", label: "Pagando", hint: "suscripciones activas" },
  { id: "active_trials", label: "En prueba", hint: "7 días gratis" },
  { id: "mrr", label: "Ingreso al mes", hint: "MRR", money: true },
  { id: "revenue", label: "Cobrado", hint: "últimos 28 días", money: true },
];

function Money({ rc }: { rc: Rc }) {
  if (rc === null) return <p className={css.sub}>Cargando…</p>;
  if (!rc.connected) {
    return (
      <p className={css.sub}>
        Falta la llave de RevenueCat en Vercel (<code>REVENUECAT_API_KEY</code>, v2 de
        solo lectura).
      </p>
    );
  }
  if (rc.error) return <p className={css.error}>{rc.error}</p>;
  const byId = new Map((rc.metrics ?? []).map((m) => [m.id, m]));
  return (
    <div className={css.money}>
      {rcTiles.map((tile) => {
        const metric = byId.get(tile.id);
        return (
          <div key={tile.id}>
            <p className={css.label}>{tile.label}</p>
            <p className={css.moneyValue}>
              {metric === undefined
                ? "—"
                : tile.money
                  ? `$${Math.round(metric.value).toLocaleString("es-MX")}`
                  : metric.value.toLocaleString("es-MX")}
            </p>
            <p className={css.detail}>{tile.hint}</p>
          </div>
        );
      })}
    </div>
  );
}
