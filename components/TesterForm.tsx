"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, Users } from "lucide-react";
import { signupApi, testerProgram } from "@/lib/site";

type Status = "idle" | "sending" | "done" | "error";

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/// Inscripción a la prueba cerrada. Solo guarda lo que se escribe aquí;
/// la base únicamente acepta inserciones (ver migración 002 en la app).
export default function TesterForm() {
  const [email, setEmail] = useState("");
  const [laundry, setLaundry] = useState("");
  const [city, setCity] = useState("");
  const [trap, setTrap] = useState("");
  const [source, setSource] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const parts = ["utm_source", "utm_campaign", "utm_content"]
      .map((key) => params.get(key))
      .filter(Boolean);
    if (parts.length) setSource(parts.join(" / ").slice(0, 120));
  }, []);

  const trimmed = email.trim().toLowerCase();
  const notGmail =
    emailPattern.test(trimmed) && !/@(gmail|googlemail)\.com$/.test(trimmed);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (status === "sending") return;
    if (!emailPattern.test(trimmed)) {
      setError("Escribe tu correo de Gmail completo.");
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
          apikey: signupApi.anonKey,
          Authorization: `Bearer ${signupApi.anonKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          email: trimmed,
          laundry_name: laundry.trim() || null,
          city: city.trim() || null,
          source,
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

  if (status === "done") {
    return (
      <div className="tester-card tester-done" aria-live="polite">
        <CheckCircle2 size={40} className="tester-done-icon" aria-hidden="true" />
        <h2>¡Ya estás en la lista!</h2>
        <p>Faltan dos pasos con el mismo Gmail ({trimmed}):</p>
        <ol className="tester-next">
          <li>
            <span>
              <strong>Únete al grupo de testers.</strong> Así Google Play te deja
              instalar la prueba.
            </span>
            {testerProgram.groupUrl ? (
              <a
                className="btn btn-primary"
                href={testerProgram.groupUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Users size={18} aria-hidden="true" /> Unirme al grupo
              </a>
            ) : (
              <em>Te mandamos el enlace a tu correo en cuanto abramos la prueba.</em>
            )}
          </li>
          <li>
            <span>
              <strong>Acepta la prueba e instala Lávale</strong> desde Google
              Play.
            </span>
            {testerProgram.playTestUrl ? (
              <a
                className="btn btn-light"
                href={testerProgram.playTestUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={18} aria-hidden="true" /> Abrir en Google Play
              </a>
            ) : (
              <em>Este enlace también te llega por correo.</em>
            )}
          </li>
        </ol>
        <p className="tester-fine">
          No te salgas de la prueba durante {testerProgram.days} días. Al terminar
          te mandamos tu código para tener Lávale gratis de por vida.
        </p>
      </div>
    );
  }

  return (
    <form className="tester-card" onSubmit={submit} noValidate>
      <label className="t-field">
        <span>Tu Gmail (el de tu Play Store)</span>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="tunombre@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={254}
        />
        {notGmail && (
          <small className="t-field-hint">
            Tiene que ser la cuenta de Google con la que usas Play Store.
          </small>
        )}
      </label>
      <label className="t-field">
        <span>
          Nombre de tu lavandería <em>(opcional)</em>
        </span>
        <input
          type="text"
          autoComplete="organization"
          placeholder="Lavandería La Burbuja"
          value={laundry}
          onChange={(e) => setLaundry(e.target.value)}
          maxLength={120}
        />
      </label>
      <label className="t-field">
        <span>
          Ciudad <em>(opcional)</em>
        </span>
        <input
          type="text"
          autoComplete="address-level2"
          placeholder="Colima"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          maxLength={80}
        />
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
        {status === "sending" ? "Guardando…" : "Quiero probar Lávale"}
      </button>
      <p className="tester-fine">
        Solo usamos tu correo para la prueba y para mandarte tu código.{" "}
        <a href="/privacidad">Aviso de privacidad</a>.
      </p>
    </form>
  );
}
