# Lávale web

Landing de **Lávale — Tickets para lavanderías**. Next.js 14 (App Router), lista para Vercel.

```sh
yarn install
yarn dev        # http://localhost:3000
yarn build      # lo mismo que corre Vercel
```

## Dónde se cambia cada cosa

- `lib/site.ts`: enlaces de tiendas, precios (espejo de `plan_catalog.dart` en la app) y URL del sitio.
- Cuando la app esté publicada, llena `stores.google` / `stores.apple` y los botones dejan de decir «Próximamente» y llevan a la tienda.
- `app/page.tsx`: textos y secciones. `components/HeroPhone.tsx`: demo animada del hero.
- `app/globals.css`: paleta (espejo de `app_theme.dart`) y estilos.
- La fuente (Plus Jakarta Sans, OFL) va incluida en `app/fonts`, así que el build no depende de Google Fonts.

## Vercel

Importa el repo en Vercel (framework: Next.js, sin configuración extra). Cuando tengas dominio, agrega la variable `NEXT_PUBLIC_SITE_URL` (p. ej. `https://lavale.mx`) para canonical, sitemap y Open Graph.
