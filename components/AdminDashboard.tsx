"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  Copy,
  ExternalLink,
  Filter,
  LogOut,
  RefreshCw,
  Smartphone,
  Users,
  Wallet,
} from "lucide-react";
import { signupApi } from "@/lib/site";
import css from "./AdminPanel.module.css";

/// Pedidos gratis antes de los planes (PlanCatalog.freeOrders en la app).
const freeOrders = 7;

/// Sesión de Supabase Auth guardada en este navegador.
type Session = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // segundos epoch
  email: string;
};

type Daily = {
  day: string;
  active: number;
  /// Teléfonos que crearon al menos un pedido ese día.
  selling?: number;
  opens: number;
  orders: number;
  payments: number;
  deliveries: number;
  notified: number;
  counter_sales: number;
  signups: number;
};

type Install = {
  id: string;
  first_seen: string;
  last_seen: string;
  days_active: number;
  orders: number;
  deliveries: number;
  app_version: string;
  platform: string;
  onboarded: boolean;
  plans: boolean;
  trial: boolean;
  paid: boolean;
};

type Signup = {
  email: string;
  laundry_name: string | null;
  city: string | null;
  source: string | null;
  created_at: string;
};

type Dashboard = {
  generated_at: string;
  /// Inicio del periodo elegido (medianoche de México).
  since?: string;
  /// Teléfonos que llegaron en el periodo y hasta dónde avanzaron.
  app_funnel?: {
    installed: number;
    onboarded: number;
    first_order: number;
    orders3: number;
    orders7: number;
    plans: number;
    trial: number;
    paid: number;
  };
  summary: {
    installs: number;
    active_today: number;
    active_7d: number;
    events: number;
    orders: number;
    deliveries: number;
    notified: number;
    signups: number;
  };
  daily: Daily[];
  installs: Install[];
  events: Record<string, number>;
  /// Embudo de /probar en el periodo elegido (migración 005).
  funnel?: {
    views: number;
    signups: number;
    chrome_opens: number;
    download_views: number;
    group_clicks: number;
    play_clicks: number;
    installs: number;
  };
  spots_taken?: number;
  signups: Signup[];
};

const storageKey = "lavale_admin_session_v1";
const tz = "America/Mexico_City";

function readSession(): Session | null {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function writeSession(session: Session | null) {
  try {
    if (session) window.localStorage.setItem(storageKey, JSON.stringify(session));
    else window.localStorage.removeItem(storageKey);
  } catch {
    // Sin almacenamiento la sesión dura lo que dure la pestaña.
  }
}

function emailFromJwt(token: string): string {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return (JSON.parse(atob(payload)).email as string) ?? "";
  } catch {
    return "";
  }
}

function fmtDay(day: string) {
  return new Date(`${day}T12:00:00`).toLocaleDateString("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("es-MX", {
    timeZone: tz,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    timeZone: tz,
    day: "numeric",
    month: "short",
  });
}

function shortDay(day: string) {
  return String(new Date(`${day}T12:00:00`).getDate());
}

/// "hoy", "ayer" o "hace N días": lo que importa es si sigue usándola.
function ago(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "hoy";
  if (days === 1) return "ayer";
  return `hace ${days} días`;
}

export default function AdminDashboard() {
  const api = signupApi;
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(14);
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rc, setRc] = useState<Rc>(null);
  const [tab, setTab] = useState<"serious" | "new" | "all">("serious");

  // 1) Al volver del enlace mágico, Supabase deja la sesión en el #hash.
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const access = hash.get("access_token");
    const refresh = hash.get("refresh_token");
    const hashError = hash.get("error_description");
    if (access && refresh) {
      const expiresIn = Number(hash.get("expires_in") ?? 3600);
      const next: Session = {
        accessToken: access,
        refreshToken: refresh,
        expiresAt: Number(hash.get("expires_at")) || Date.now() / 1000 + expiresIn,
        email: emailFromJwt(access),
      };
      writeSession(next);
      setSession(next);
    } else {
      setSession(readSession());
      if (hashError) {
        setError(
          /expired|invalid/i.test(hashError)
            ? "El enlace ya caducó o ya se usó. Pide uno nuevo."
            : hashError,
        );
      }
    }
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname);
    }
    setReady(true);
  }, []);

  const signOut = useCallback(() => {
    writeSession(null);
    setSession(null);
    setData(null);
  }, []);

  // 2) Renueva el token si ya venció (dura 1 hora).
  const validSession = useCallback(async (): Promise<Session | null> => {
    if (!session || !api.url || !api.anonKey) return null;
    if (session.expiresAt - 60 > Date.now() / 1000) return session;
    const response = await fetch(
      `${api.url}/auth/v1/token?grant_type=refresh_token`,
      {
        method: "POST",
        headers: { apikey: api.anonKey, "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: session.refreshToken }),
      },
    );
    if (!response.ok) {
      signOut();
      setError("Tu sesión terminó. Entra de nuevo.");
      return null;
    }
    const body = await response.json();
    const next: Session = {
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      expiresAt: body.expires_at ?? Date.now() / 1000 + (body.expires_in ?? 3600),
      email: body.user?.email ?? session.email,
    };
    writeSession(next);
    setSession(next);
    return next;
  }, [session, api.url, api.anonKey, signOut]);

  // 3) Pide las métricas. La base solo responde si el correo es admin.
  const load = useCallback(async () => {
    if (!api.url || !api.anonKey) return;
    setLoading(true);
    setError(null);
    try {
      const current = await validSession();
      if (!current) return;
      const response = await fetch(`${api.url}/rest/v1/rpc/admin_dashboard`, {
        method: "POST",
        headers: {
          apikey: api.anonKey,
          Authorization: `Bearer ${current.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ days }),
      });
      if (response.status === 401) {
        signOut();
        setError("Tu sesión terminó. Entra de nuevo.");
        return;
      }
      if (!response.ok) {
        const text = await response.text();
        setError(
          /forbidden/.test(text)
            ? `${current.email || "Este correo"} no tiene acceso al panel.`
            : "No se pudieron cargar las métricas. Intenta otra vez.",
        );
        setData(null);
        return;
      }
      setData((await response.json()) as Dashboard);
      // Ventas aparte: si RevenueCat falla, el resto del panel sigue.
      fetch("/api/admin/revenuecat", {
        headers: { Authorization: `Bearer ${current.accessToken}` },
        cache: "no-store",
      })
        .then((r) => (r.ok ? r.json() : { connected: true, error: "No se pudieron leer las ventas." }))
        .then((body) => setRc(body as Rc))
        .catch(() => setRc({ connected: true, error: "No se pudieron leer las ventas." }));
    } catch {
      setError("Sin conexión. Intenta otra vez.");
    } finally {
      setLoading(false);
    }
  }, [api.url, api.anonKey, days, validSession, signOut]);

  useEffect(() => {
    if (session) void load();
    // Solo al entrar o al cambiar el periodo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(session), days]);

  async function sendLink(event: FormEvent) {
    event.preventDefault();
    if (!api.url || !api.anonKey || sending) return;
    const address = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(address)) {
      setError("Escribe tu correo completo.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      const redirect = `${window.location.origin}/admin`;
      const response = await fetch(
        `${api.url}/auth/v1/otp?redirect_to=${encodeURIComponent(redirect)}`,
        {
          method: "POST",
          headers: { apikey: api.anonKey, "Content-Type": "application/json" },
          // Nunca crea cuentas: solo entran usuarios ya invitados.
          body: JSON.stringify({ email: address, create_user: false }),
        },
      );
      if (response.status === 429) {
        setError("Ya pediste varios enlaces. Espera un minuto y vuelve a intentar.");
      } else {
        // Mismo mensaje exista o no la cuenta, para no revelar quién es admin.
        setSent(true);
      }
    } catch {
      setError("Sin conexión. Intenta otra vez.");
    } finally {
      setSending(false);
    }
  }

  async function copyEmails() {
    if (!data) return;
    const list = data.signups.map((s) => s.email).join(", ");
    try {
      await navigator.clipboard.writeText(list);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copia los correos:", list);
    }
  }

  if (!ready) return <main className="adm adm-center" />;

  if (!api.url || !api.anonKey) {
    return (
      <main className="adm adm-center">
        <p>Falta configurar Supabase en Vercel.</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="adm adm-center">
        <form className="adm-login" onSubmit={sendLink}>
          <h1>Panel de Lávale</h1>
          {sent ? (
            <p className="adm-muted">
              Si <strong>{email.trim()}</strong> tiene acceso, te llegó un
              correo con un enlace para entrar. Ábrelo en este mismo navegador.
            </p>
          ) : (
            <>
              <p className="adm-muted">
                Te mandamos un enlace a tu correo. Sin contraseñas.
              </p>
              <label className="t-field">
                <span>Correo</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                />
              </label>
              <button className="btn btn-primary btn-block" disabled={sending}>
                {sending ? "Enviando…" : "Enviarme el enlace"}
              </button>
            </>
          )}
          {error && <p className="t-field-error">{error}</p>}
        </form>
      </main>
    );
  }

  const s = data?.summary;
  const installs = data?.installs ?? [];
  const since = data?.since ? new Date(data.since).getTime() : 0;
  const isNew = (i: Install) => new Date(i.first_seen).getTime() >= since;
  const serious = (i: Install) => i.orders >= 5 && i.days_active >= 3;
  const weekAgo = Date.now() - 7 * 86_400_000;
  const groups = {
    serious: installs.filter(serious),
    tried: installs.filter((i) => i.orders >= 1 && !serious(i)),
    opened: installs.filter((i) => i.orders === 0),
    activeWeek: installs.filter(
      (i) => i.orders >= 1 && new Date(i.last_seen).getTime() >= weekAgo,
    ),
  };
  const shown =
    tab === "serious"
      ? groups.serious
      : tab === "new"
        ? installs.filter(isNew)
        : installs;

  const af = data?.app_funnel;
  const appFunnel = af
    ? [
        { label: "Instalaron y abrieron", value: af.installed },
        { label: "Terminaron la bienvenida", value: af.onboarded },
        { label: "Hicieron su primer pedido", value: af.first_order },
        { label: "Llegaron a 3 pedidos", value: af.orders3 },
        { label: `Usaron sus ${freeOrders} pedidos gratis`, value: af.orders7 },
        { label: "Vieron los planes", value: af.plans },
        { label: "Empezaron la prueba", value: af.trial },
        { label: "Pagaron", value: af.paid },
      ]
    : [];
  const funnelTop = Math.max(1, appFunnel[0]?.value ?? 1);

  const daily = data?.daily ?? [];
  const maxOrders = Math.max(1, ...daily.map((d) => d.orders));
  const finished = daily.slice(0, -1); // hoy va a medias
  const avgOrders = finished.length
    ? finished.reduce((t, d) => t + d.orders, 0) / finished.length
    : 0;
  const avgSelling = finished.length
    ? finished.reduce((t, d) => t + (d.selling ?? 0), 0) / finished.length
    : 0;

  const f = data?.funnel;
  const webFunnel = f
    ? [
        { label: "Visitaron /probar", value: f.views },
        { label: "Apartaron lugar", value: f.signups },
        { label: "Teléfonos con la app", value: f.installs },
      ]
    : [];

  return (
    <main className="adm">
      <header className="adm-head">
        <div>
          <h1>Panel de Lávale</h1>
          <p className="adm-muted">
            {session.email}
            {data ? ` · actualizado ${fmtDateTime(data.generated_at)}` : ""}
          </p>
        </div>
        <div className="adm-actions">
          <div className="adm-seg" role="group" aria-label="Periodo">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                className={days === d ? "on" : ""}
                onClick={() => setDays(d)}
              >
                {d} días
              </button>
            ))}
          </div>
          <button
            className="adm-icon"
            onClick={() => void load()}
            disabled={loading}
            aria-label="Actualizar"
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
          </button>
          <button className="adm-icon" onClick={signOut} aria-label="Salir">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {error && <p className="adm-error">{error}</p>}

      {/* Ventas: lo único que dice si el negocio funciona. */}
      <section className="adm-card">
        <h2>
          <Wallet size={18} /> Ventas
        </h2>
        <p className="adm-muted">
          De RevenueCat: iPhone y Android juntos, en pesos.
        </p>
        <Sales rc={rc} />
      </section>

      <div className={css.two}>
        <section className="adm-card">
          <h2>
            <Filter size={18} /> Hasta dónde llegan
          </h2>
          <p className="adm-muted">
            Teléfonos que instalaron en los últimos {days} días. El % es
            cuántos pasaron del paso anterior.
          </p>
          {appFunnel.length > 0 && (
            <ol className={css.funnel}>
              {appFunnel.map((step, index) => {
                const prev = index === 0 ? step.value : appFunnel[index - 1].value;
                const pct = prev > 0 ? Math.round((step.value / prev) * 100) : 0;
                const loss = index === 0 ? 0 : 100 - pct;
                return (
                  <li key={step.label}>
                    <span className={css.funnelLabel}>{step.label}</span>
                    <div className={css.funnelTrack}>
                      <div
                        className={css.funnelBar}
                        style={{
                          width: `${Math.max(2, (step.value / funnelTop) * 100)}%`,
                          background: `color-mix(in srgb, #dc2626 ${loss}%, #2ec4b6)`,
                        }}
                      />
                    </div>
                    <span className={css.funnelNum}>
                      <strong>{step.value}</strong>
                      {index > 0 && <em>{prev > 0 ? `${pct}%` : "—"}</em>}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
          <p className={css.note}>
            Solo Android: en iPhone la app no manda estadísticas. Sus pruebas
            y pagos sí salen en Ventas.
          </p>
        </section>

        <section className="adm-card">
          <h2>
            <Users size={18} /> ¿Quién la usa?
          </h2>
          <p className="adm-muted">Todos los teléfonos desde el inicio.</p>
          <div className={css.groups}>
            <Group
              tone="good"
              value={groups.serious.length}
              label="La usan en serio"
              hint="5 pedidos o más, en 3 días distintos"
            />
            <Group
              tone="mid"
              value={groups.tried.length}
              label="Solo la probaron"
              hint="hicieron algún pedido"
            />
            <Group
              tone="low"
              value={groups.opened.length}
              label="Solo abrieron"
              hint="ningún pedido (incluye tus pruebas)"
            />
            <Group
              tone="good"
              value={groups.activeWeek.length}
              label="Vendieron esta semana"
              hint="con pedidos en los últimos 7 días"
            />
          </div>
        </section>
      </div>

      <section className="adm-card">
        <h2>
          <BarChart3 size={18} /> Pedidos por día
        </h2>
        <p className="adm-muted">
          Promedio: {avgOrders.toFixed(1)} pedidos y {avgSelling.toFixed(1)}{" "}
          lavanderías vendiendo al día (sin contar hoy). Debajo de cada barra:
          cuántas vendieron.
        </p>
        <div
          className={css.bars}
          style={{ gridTemplateColumns: `repeat(${daily.length || 1}, 1fr)` }}
          role="img"
          aria-label="Pedidos por día"
        >
          {daily.map((d) => (
            <div
              key={d.day}
              className={css.barCol}
              title={`${fmtDay(d.day)}: ${d.orders} pedidos, ${d.selling ?? 0} vendiendo, ${d.active} abrieron`}
            >
              <span className={css.barValue}>{d.orders || ""}</span>
              <div
                className={css.bar}
                style={{ height: `${(d.orders / maxOrders) * 100}%` }}
              />
              <span className={css.barSelling}>{d.selling ?? 0}</span>
              <span className={css.barDay}>{shortDay(d.day)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="adm-card">
        <div className={css.tableHead}>
          <h2>
            <Smartphone size={18} /> Teléfonos
          </h2>
          <div className="adm-seg" role="group" aria-label="Filtro">
            {(
              [
                ["serious", `En serio (${groups.serious.length})`],
                ["new", `Nuevos (${installs.filter(isNew).length})`],
                ["all", `Todos (${installs.length})`],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                className={tab === key ? "on" : ""}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <p className="adm-muted">
          Cada fila es una instalación anónima (Android). Verde: llegó en los
          últimos {days} días.
        </p>
        <div className={css.tableWrap}>
          <table className={css.table}>
            <thead>
              <tr>
                <th>Teléfono</th>
                <th>Llegó</th>
                <th>Última vez</th>
                <th>Días usando</th>
                <th>Pedidos</th>
                <th>Entregas</th>
                <th>Avance</th>
                <th>Versión</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((i) => (
                <tr key={i.id} className={isNew(i) ? css.rowNew : undefined}>
                  <td>
                    <code>{i.id}</code>
                    {isNew(i) && <span className={css.pill}>Nuevo</span>}
                  </td>
                  <td>{fmtDate(i.first_seen)}</td>
                  <td>{ago(i.last_seen)}</td>
                  <td>{i.days_active}</td>
                  <td className={css.num}>{i.orders}</td>
                  <td className={css.num}>{i.deliveries}</td>
                  <td>
                    <Progress install={i} />
                  </td>
                  <td>
                    {i.app_version} · {i.platform}
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr>
                  <td colSpan={8} className="adm-muted">
                    Nadie todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* La prueba cerrada de Play ya casi termina: queda guardada abajo. */}
      <details className="adm-card">
        <summary className={css.summary}>
          Prueba cerrada de Android · {s?.signups ?? 0} inscritos
        </summary>
        {webFunnel.length > 0 && (
          <ul className={css.webFunnel}>
            {webFunnel.map((step) => (
              <li key={step.label}>
                <span>{step.label}</span>
                <strong>{step.value}</strong>
              </li>
            ))}
          </ul>
        )}
        <div className={css.tableHead}>
          <p className="adm-muted">Últimos {days} días en /probar.</p>
          <button className="adm-link" onClick={() => void copyEmails()}>
            <Copy size={14} /> {copied ? "Copiados" : "Copiar correos"}
          </button>
        </div>
        <ul className={css.signups}>
          {(data?.signups ?? []).map((signup) => (
            <li key={`${signup.email}-${signup.created_at}`}>
              <span>{signup.email}</span>
              <em>{fmtDateTime(signup.created_at)}</em>
            </li>
          ))}
        </ul>
      </details>
    </main>
  );
}

type Rc =
  | null
  | { connected: false }
  | { connected: true; metrics?: RcMetric[]; error?: string };

type RcMetric = { id: string; name: string; value: number; unit: string };

/// Lo que se muestra de RevenueCat y con qué nombre. El resto se ignora.
const rcTiles: { id: string; label: string; hint: string; money?: boolean }[] = [
  { id: "active_subscriptions", label: "Pagando", hint: "suscripciones activas" },
  { id: "active_trials", label: "En prueba", hint: "7 días gratis" },
  { id: "mrr", label: "Ingreso mensual", hint: "MRR", money: true },
  { id: "revenue", label: "Cobrado", hint: "últimos 28 días", money: true },
  { id: "new_customers", label: "Instalaciones", hint: "últimos 28 días" },
];

function Sales({ rc }: { rc: Rc }) {
  if (rc === null) return <p className="adm-muted">Cargando…</p>;
  if (!rc.connected) {
    return (
      <div className={css.connect}>
        <p>
          Para ver aquí las ventas, crea en RevenueCat una llave secreta{" "}
          <strong>v2 de solo lectura</strong> (Project settings › API keys,
          permiso de métricas) y agrégala en Vercel como{" "}
          <code>REVENUECAT_API_KEY</code>. Luego vuelve a desplegar.
        </p>
        <a
          className="btn btn-light"
          href="https://app.revenuecat.com/projects/8802b1fc/overview"
          target="_blank"
          rel="noreferrer"
        >
          Abrir RevenueCat <ExternalLink size={14} />
        </a>
      </div>
    );
  }
  if (rc.error) return <p className="adm-error">{rc.error}</p>;
  const byId = new Map((rc.metrics ?? []).map((m) => [m.id, m]));
  return (
    <div className="adm-kpis">
      {rcTiles.map((tile) => {
        const metric = byId.get(tile.id);
        return (
          <div className="adm-kpi" key={tile.id}>
            <span>{tile.label}</span>
            <strong>
              {metric === undefined
                ? "—"
                : tile.money
                  ? `$${Math.round(metric.value).toLocaleString("es-MX")}`
                  : metric.value.toLocaleString("es-MX")}
            </strong>
            <em>{tile.hint}</em>
          </div>
        );
      })}
    </div>
  );
}

function Group({
  value,
  label,
  hint,
  tone,
}: {
  value: number;
  label: string;
  hint: string;
  tone: "good" | "mid" | "low";
}) {
  return (
    <div className={`${css.group} ${css[tone]}`}>
      <strong>{value}</strong>
      <span>{label}</span>
      <em>{hint}</em>
    </div>
  );
}

const steps: { label: string; done: (i: Install) => boolean }[] = [
  { label: "Bienvenida", done: (i) => i.onboarded },
  { label: "Primer pedido", done: (i) => i.orders >= 1 },
  { label: "3 pedidos", done: (i) => i.orders >= 3 },
  { label: `${freeOrders} pedidos`, done: (i) => i.orders >= freeOrders },
  { label: "Vio planes", done: (i) => i.plans },
  { label: "Prueba o pago", done: (i) => i.trial || i.paid },
];

function Progress({ install }: { install: Install }) {
  const reached = steps.filter((step) => step.done(install));
  const last = reached[reached.length - 1];
  return (
    <span className={css.progress} title={steps.map((s) => `${s.done(install) ? "✓" : "·"} ${s.label}`).join("\n")}>
      {steps.map((step) => (
        <i key={step.label} className={step.done(install) ? css.dotOn : css.dot} />
      ))}
      <small>{install.paid ? "Pagó" : last ? last.label : "Solo abrió"}</small>
    </span>
  );
}
