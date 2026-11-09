"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { publicApi } from "@/lib/site";
import Panel, { periods, type PanelData, type Period, type Rc } from "./admin/Panel";

/// Sesión de Supabase Auth guardada en este navegador.
type Session = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // segundos epoch
  email: string;
};

const storageKey = "lavale_admin_session_v1";
const periodKey = "lavale_admin_period_v1";

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

export default function AdminDashboard() {
  const api = publicApi;
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("7");
  const [data, setData] = useState<PanelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [rc, setRc] = useState<Rc>(null);

  // El periodo elegido se recuerda en este navegador.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(periodKey);
      if (periods.some((p) => p.id === saved)) setPeriod(saved as Period);
    } catch {
      // Sin almacenamiento se queda en 7 días.
    }
  }, []);

  const choosePeriod = useCallback((next: Period) => {
    setPeriod(next);
    try {
      window.localStorage.setItem(periodKey, next);
    } catch {
      // Igual cambia en pantalla.
    }
  }, []);

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
        // El panel arma todo con el renglón de cada teléfono (`installs`);
        // el periodo se filtra aquí, así que basta con un día.
        body: JSON.stringify({ days: 1 }),
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
      setData((await response.json()) as PanelData);
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
  }, [api.url, api.anonKey, validSession, signOut]);

  useEffect(() => {
    if (session) void load();
    // Solo al entrar; el periodo se calcula sin volver a pedir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(session)]);

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


  return (
    <Panel
      data={data}
      rc={rc}
      period={period}
      onPeriod={choosePeriod}
      email={session.email}
      loading={loading}
      error={error}
      onRefresh={() => void load()}
      onSignOut={signOut}
    />
  );
}
