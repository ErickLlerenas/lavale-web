"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { signupApi, testerProgram } from "@/lib/site";
import { track } from "@/lib/track";
import { readSource, readVisitor } from "@/lib/visitor";

type Status = "idle" | "sending" | "done" | "error";

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/// Inscripción a la prueba: un solo campo. La base únicamente acepta
/// inserciones (migración 002 en el repo de la app).
export default function TesterForm() {
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [source, setSource] = useState<string | null>(null);
  const [ios, setIos] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  // Al inscribirse, los pasos de descarga quedan a la vista (en el celular el
  // formulario está a media pantalla y la tarjeta crece hacia abajo).
  useEffect(() => {
    if (status !== "done") return;
    const el = doneRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: "smooth" });
  }, [status]);

  useEffect(() => {
    const from = readSource();
    setSource(from);
    setIos(readVisitor().ios);
    track("probar_view", from);
  }, []);

  const trimmed = email.trim().toLowerCase();
  const notGmail =
    !ios && emailPattern.test(trimmed) && !/@(gmail|googlemail)\.com$/.test(trimmed);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (status === "sending") return;
    if (!emailPattern.test(trimmed)) {
      setError(ios ? "Escribe tu correo completo." : "Escribe tu correo de Gmail completo.");
      return;
    }
    if (trap) {
      setStatus("done");
      return;
    }
    if (!signupApi.url || !signupApi.anonKey) {
      setError("La inscripción todavía no está abierta. Vuelve en unos días.");
      return;
    }
    setError(null);
    setStatus("sending");
    try {
      const response = await fetch(`${signupApi.url}/rest/v1/tester_signups`, {
        method: "POST",
        headers: {
          // Llave publicable (sb_publishable_…): solo va en `apikey`.
          apikey: signupApi.anonKey,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          email: trimmed,
          source: [source, ios ? "iphone" : null].filter(Boolean).join(" / ") || null,
        }),
      });
      // 409: ese correo ya estaba inscrito. Para la persona es lo mismo.
      if (!response.ok && response.status !== 409) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
      setError("No se pudo guardar. Revisa tu internet e inténtalo otra vez.");
    }
  }

  if (status === "done" && ios) {
    return (
      <div ref={doneRef} className="tester-card tester-done" aria-live="polite">
        <CheckCircle2 size={40} className="tester-done-icon" aria-hidden="true" />
        <h2>¡Listo, te avisamos!</h2>
        <p>
          En cuanto Lávale salga para iPhone te escribimos a <b>{trimmed}</b>.
        </p>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div ref={doneRef} className="tester-card tester-done" aria-live="polite">
        <CheckCircle2 size={40} className="tester-done-icon" aria-hidden="true" />
        <h2>🎉 ¡Listo, ya es tuya!</h2>
        <p>
          En unos minutos te llega a <b>{trimmed}</b> un correo con tu enlace para
          descargar Lávale. Ábrelo desde tu celular Android.
        </p>
        <p className="tester-fine">
          ¿No lo ves? Revisa Promociones o Spam. Úsala {testerProgram.days} días
          y te mandamos tu código del plan de por vida.
        </p>
      </div>
    );
  }

  return (
    <form className="tester-card" onSubmit={submit} noValidate>
      {!ios && <p className="t-title">🎁 Aparta tu lugar gratis</p>}
      {ios && (
        <p className="t-ios" role="note">
          Por ahora Lávale es solo para <b>Android</b>. Déjanos tu correo y te
          avisamos cuando salga para iPhone.
        </p>
      )}
      <label className="t-field">
        <span>{ios ? "Tu correo" : "Tu correo de Gmail"}</span>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder={ios ? "tunombre@correo.com" : "tunombre@gmail.com"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={254}
        />
        {notGmail ? (
          <small className="t-field-hint">
            Tiene que ser una cuenta de Google (Gmail): la que usas en tu celular
            para bajar apps.
          </small>
        ) : (
          !ios && <small className="t-field-note">El que usas en tu celular para bajar apps.</small>
        )}
      </label>
      <label className="t-field-trap" aria-hidden="true">
        Sitio web
        <input
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </label>
      {error && (
        <p className="t-field-error" role="alert">
          {error}
        </p>
      )}
      <button className="btn btn-primary btn-block" disabled={status === "sending"}>
        {status === "sending"
          ? "Guardando…"
          : ios
            ? "Avísenme"
            : "¡Quiero mi Lávale gratis!"}
      </button>
      <p className="tester-fine">
        {ios
          ? "Solo usamos tu correo para avisarte."
          : "Te llega a tu correo en unos minutos. Sin tarjeta."}{" "}
        <a href="/privacidad">Aviso de privacidad</a>.
      </p>
    </form>
  );
}
