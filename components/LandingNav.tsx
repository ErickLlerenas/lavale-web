"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#funciones", label: "Funciones" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#precios", label: "Precios" },
  { href: "#preguntas", label: "Preguntas" },
];

/// Transparente sobre el hero y sólida al hacer scroll.
export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
      <nav className="nav-inner" aria-label="Principal">
        <a className="nav-brand" href="/" aria-label="Lávale, inicio">
          <img src="/logo.svg" alt="" width="34" height="34" />
          Lávale
        </a>
        <div className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <a className="nav-cta" href="#descargar">
          Descargar
        </a>
      </nav>
    </header>
  );
}
