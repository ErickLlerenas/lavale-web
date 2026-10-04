"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Copy,
  Inbox,
  LogOut,
  RefreshCw,
  Smartphone,
  Users,
} from "lucide-react";
import { signupApi, testerProgram } from "@/lib/site";

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
  signups: Signup[];
};

const storageKey = "lavale_admin_session_v1";
const tz = "America/Mexico_City";

const eventLabels: Record<string, string> = {
  app_opened: "Abrir la app",
  screen_orders: "Pantalla Pedidos",
  screen_services: "Pantalla Servicios",
  screen_cashbox: "Pantalla Caja",
  screen_settings: "Pantalla Ajustes",
  order_created: "Pedido creado",
  payment_added: "Cobro / abono",
  order_ready: "Marcado listo",
  order_delivered: "Entregado",
  order_notified: "Aviso por WhatsApp",
  order_cancelled: "Pedido cancelado",
  counter_sale: "Cobro sin pedido",
  ticket_pdf: "Ticket PDF",
  ticket_printed: "Ticket impreso",
  backup_exported: "Respaldo guardado",
  backup_restored: "Respaldo restaurado",
};

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

function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
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

  const maxActive = useMemo(
    () => Math.max(1, ...(data?.daily.map((d) => d.active) ?? [1])),
    [data],
  );

  const eventRows = useMemo(
    () =>
      Object.entries(data?.events ?? {})
        .sort((a, b) => b[1] - a[1])
        .map(([key, value]) => ({ label: eventLabels[key] ?? key, value })),
    [data],
  );

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
  const kpis = s
    ? [
        { label: "Teléfonos con la app", value: s.installs, hint: "con estadísticas" },
        { label: "Activos hoy", value: s.active_today, hint: "abrieron la app" },
        { label: "Activos 7 días", value: s.active_7d, hint: "teléfonos distintos" },
        { label: "Pedidos creados", value: s.orders, hint: "en total" },
        { label: "Entregas", value: s.deliveries, hint: "en total" },
        { label: "Avisos WhatsApp", value: s.notified, hint: "en total" },
        { label: "Inscritos en la web", value: s.signups, hint: "/probar" },
      ]
    : [];

  return (
    <main className="adm">
      <header className="adm-head">
        <div>
          <h1>Panel de Lávale</h1>
          <p className="adm-muted">
            {session.email}
            {data && <> · actualizado {fmtDateTime(data.generated_at)}</>}
          </p>
        </div>
        <div className="adm-actions">
          <div className="adm-seg" role="group" aria-label="Periodo">
            {[7, 14, 30].map((n) => (
              <button
                key={n}
                className={n === days ? "on" : ""}
                aria-pressed={n === days}
                onClick={() => setDays(n)}
              >
                {n} días
              </button>
            ))}
          </div>
          <button className="adm-icon" onClick={() => void load()} disabled={loading} aria-label="Actualizar">
            <RefreshCw size={18} className={loading ? "spin" : ""} />
          </button>
          <button className="adm-icon" onClick={signOut} aria-label="Salir">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {error && <p className="adm-error">{error}</p>}

      {data && (
        <>
          <section className="adm-kpis">
            {kpis.map((k) => (
              <div className="adm-kpi" key={k.label}>
                <span>{k.label}</span>
                <strong>{k.value.toLocaleString("es-MX")}</strong>
                <em>{k.hint}</em>
              </div>
            ))}
          </section>

          <section className="adm-card">
            <h2>Teléfonos activos por día</h2>
            <p className="adm-muted">
              Teléfonos distintos que mandaron al menos un evento ese día (hora de
              México).
            </p>
            <div className="adm-bars" role="img" aria-label="Teléfonos activos por día">
              {data.daily.map((d) => (
                <div className="adm-bar" key={d.day}>
                  <span className="adm-bar-n">{d.active || ""}</span>
                  <div
                    className="adm-bar-fill"
                    style={{ height: `${(d.active / maxActive) * 100}%` }}
                    title={`${fmtDay(d.day)}: ${d.active} activos, ${d.orders} pedidos, ${d.signups} inscritos`}
                  />
                  <span className="adm-bar-day">{fmtDay(d.day)}</span>
                </div>
              ))}
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Activos</th>
                    <th>Aperturas</th>
                    <th>Pedidos</th>
                    <th>Cobros</th>
                    <th>Entregas</th>
                    <th>Avisos</th>
                    <th>Sin pedido</th>
                    <th>Inscritos</th>
                  </tr>
                </thead>
                <tbody>
                  {[...data.daily].reverse().map((d) => (
                    <tr key={d.day}>
                      <td>{fmtDay(d.day)}</td>
                      <td>{d.active}</td>
                      <td>{d.opens}</td>
                      <td>{d.orders}</td>
                      <td>{d.payments}</td>
                      <td>{d.deliveries}</td>
                      <td>{d.notified}</td>
                      <td>{d.counter_sales}</td>
                      <td>{d.signups}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="adm-card">
            <h2>
              <Smartphone size={18} /> Teléfonos (anónimos)
            </h2>
            <p className="adm-muted">
              Cada fila es una instalación. No sabemos de quién es: el
              identificador es al azar. Para Play cuentan los que siguen
              {` ${testerProgram.days}`} días en la prueba.
            </p>
            {data.installs.length === 0 ? (
              <p className="adm-empty">
                <Inbox size={18} /> Todavía no llegan datos de la app.
              </p>
            ) : (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Primera vez</th>
                      <th>Última vez</th>
                      <th>Días usando</th>
                      <th>Pedidos</th>
                      <th>Entregas</th>
                      <th>Versión</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.installs.map((i) => (
                      <tr key={i.id} className={daysSince(i.last_seen) >= 3 ? "stale" : ""}>
                        <td className="mono">{i.id}</td>
                        <td>{fmtDateTime(i.first_seen)}</td>
                        <td>{fmtDateTime(i.last_seen)}</td>
                        <td>{i.days_active}</td>
                        <td>{i.orders}</td>
                        <td>{i.deliveries}</td>
                        <td>
                          {i.app_version} · {i.platform}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="adm-grid">
            <div className="adm-card">
              <h2>Qué hacen en la app</h2>
              {eventRows.length === 0 ? (
                <p className="adm-empty">
                  <Inbox size={18} /> Sin eventos todavía.
                </p>
              ) : (
                <ul className="adm-list">
                  {eventRows.map((r) => (
                    <li key={r.label}>
                      <span>{r.label}</span>
                      <strong>{r.value.toLocaleString("es-MX")}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="adm-card">
              <div className="adm-card-head">
                <h2>
                  <Users size={18} /> Inscritos en /probar
                </h2>
                {data.signups.length > 0 && (
                  <button className="adm-link" onClick={copyEmails}>
                    <Copy size={14} /> {copied ? "¡Copiados!" : "Copiar correos"}
                  </button>
                )}
              </div>
              {data.signups.length === 0 ? (
                <p className="adm-empty">
                  <Inbox size={18} /> Nadie se ha inscrito todavía.
                </p>
              ) : (
                <ul className="adm-list adm-signups">
                  {data.signups.map((p) => (
                    <li key={p.email}>
                      <div>
                        <strong>{p.email}</strong>
                        <span>
                          {[p.laundry_name, p.city].filter(Boolean).join(" · ") || "—"}
                          {p.source ? ` · ${p.source}` : ""}
                        </span>
                      </div>
                      <em>{fmtDateTime(p.created_at)}</em>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </>
      )}

      {!data && loading && <p className="adm-muted">Cargando…</p>}
    </main>
  );
}
