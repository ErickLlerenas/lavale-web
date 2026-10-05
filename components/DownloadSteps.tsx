"use client";

import { useEffect, useState } from "react";
import { Chrome, Download, KeyRound } from "lucide-react";
import { testerProgram } from "@/lib/site";
import { track } from "@/lib/track";
import { chromeUrl, readSource, readVisitor, type Visitor } from "@/lib/visitor";

/// Los dos pasos para instalar la prueba de Google Play, sin jerga.
/// Se muestran al inscribirse y en /probar/descargar (a donde llega quien
/// abre la página en Chrome desde Facebook).
export default function DownloadSteps({ email }: { email?: string | null }) {
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    const from = readSource();
    setVisitor(readVisitor());
    setSource(from);
    // Sin correo = página /probar/descargar (llegaron desde Chrome).
    if (!email) track("download_view", from);
  }, [email]);

  const stuckInApp = Boolean(visitor?.inApp && !visitor.ios);

  return (
    <div className="dl">
      {stuckInApp && (
        <div className="dl-inapp" role="note">
          <strong>Primero ábrela en Chrome</strong>
          <p>
            Estás dentro de Facebook y ahí Google no deja descargar apps de
            prueba.
          </p>
          <a
            className="btn btn-primary"
            href={chromeUrl("/probar/descargar")}
            onClick={() => track("chrome_open", source)}
          >
            <Chrome size={18} aria-hidden="true" /> Abrir en Chrome
          </a>
          <small>
            ¿No se abre? Toca <b>⋮</b> arriba a la derecha y elige «Abrir en
            Chrome» o «Abrir en el navegador».
          </small>
        </div>
      )}

      <ol className={`tester-next${stuckInApp ? " is-later" : ""}`}>
        <li>
          <span>
            <strong>Activa tu acceso.</strong> En la página que se abre, toca
            «Unirse al grupo».
          </span>
          {testerProgram.groupUrl ? (
            <a
              className="btn btn-primary"
              href={testerProgram.groupUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("group_click", source)}
            >
              <KeyRound size={18} aria-hidden="true" /> Activar mi acceso
            </a>
          ) : (
            <em>Te mandamos el enlace a tu correo.</em>
          )}
        </li>
        <li>
          <span>
            <strong>Descarga Lávale.</strong> Acepta la invitación y toca
            «Descargar» en Google Play.
          </span>
          {testerProgram.playTestUrl ? (
            <a
              className="btn btn-light"
              href={testerProgram.playTestUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("play_click", source)}
            >
              <Download size={18} aria-hidden="true" /> Descargar Lávale
            </a>
          ) : (
            <em>Este enlace también te llega por correo.</em>
          )}
        </li>
      </ol>

      <p className="tester-fine">
        Hazlo en ese orden. Si te pide iniciar sesión, entra con la cuenta de
        Google de tu celular{email ? ` (${email})` : ""}.
      </p>
    </div>
  );
}
