"use client";

import { useEffect, useState } from "react";
import { testerProgram } from "@/lib/site";
import { fetchSignupCount } from "@/lib/track";

/// "Quedan N lugares", con el número real. Si no se puede leer, no se muestra.
export default function SpotsLeft() {
  const [taken, setTaken] = useState<number | null>(null);

  useEffect(() => {
    fetchSignupCount().then(setTaken);
  }, []);

  if (taken === null) return null;
  const left = testerProgram.spots - taken;

  return (
    <p className="spots" aria-live="polite">
      <span className="spots-dot" aria-hidden="true" />
      {left > 0 ? (
        <span>
          Quedan <b>{left}</b> de {testerProgram.spots} lugares
        </span>
      ) : (
        <span>Lugares llenos · te anotamos en la lista de espera</span>
      )}
    </p>
  );
}
