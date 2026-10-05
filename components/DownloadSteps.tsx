"use client";

import { useEffect, useState } from "react";
import { Chrome, Download } from "lucide-react";
import { testerProgram } from "@/lib/site";
import { track } from "@/lib/track";
import { chromeUrl, readSource, readVisitor, type Visitor } from "@/lib/visitor";

/// Botón de descarga de la prueba en Google Play (/probar/descargar).
/// A esta página llega el enlace del correo que mandamos cuando el Gmail
/// ya está dado de alta en la lista de testers de Play Console.
export default function DownloadSteps() {
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    const from = readSource();
    setVisitor(readVisitor());
    setSource(from);
    track("download_view", from);
  }, []);

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

      {testerProgram.playTestUrl ? (
        <a
          className={`btn ${stuckInApp ? "btn-light" : "btn-primary"} btn-block`}
          href={testerProgram.playTestUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("play_click", source)}
        >
          <Download size={18} aria-hidden="true" /> Descargar la app
        </a>
      ) : (
        <em>El enlace de descarga te llega por correo.</em>
      )}

      <ol className="dl-howto">
        <li>Toca «Descargar la app».</li>
        <li>En la página de Google Play, acepta la invitación.</li>
        <li>Toca «Descargar» o «Instalar».</li>
      </ol>

      <p className="tester-fine">
        Usa la cuenta de Google con la que te inscribiste. Si Play dice que la app
        no está disponible, tu acceso todavía no está listo: espera el correo que
        te mandamos.
      </p>
    </div>
  );
}
