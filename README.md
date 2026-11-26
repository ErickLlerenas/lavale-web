# Lávale web

Landing de **Lávale — Tickets para lavanderías**. Next.js 14 (App Router), lista para Vercel.

```sh
yarn install
yarn dev        # http://localhost:3000
yarn build      # lo mismo que corre Vercel
```

## Dónde se cambia cada cosa

- `lib/site.ts`: enlaces de tiendas, precios (espejo de `plan_catalog.dart` en la app) y URL del sitio.
- Los botones de descarga llevan a las fichas de Google Play y App Store definidas en `stores`.
- `app/page.tsx`: textos y secciones. `components/HeroPhone.tsx`: demo animada del hero.
- `app/globals.css`: paleta (espejo de `app_theme.dart`) y estilos.
- La fuente (Plus Jakarta Sans, OFL) va incluida en `app/fonts`, así que el build no depende de Google Fonts.

## Vercel

Importa el repo en Vercel (framework: Next.js, sin configuración extra). Cuando tengas dominio, agrega la variable `NEXT_PUBLIC_SITE_URL` (p. ej. `https://lavale.mx`) para canonical, sitemap y Open Graph.

## Descargas y suscripción

Solo se anuncia la suscripción mensual de $99 MXN, con siete días de prueba. Se retiraron la captación de testers y los regalos públicos. Los enlaces históricos `/probar`, `/probar/descargar` y `/email/bienvenida.html` redirigen a `/#descargar`.

La app está publicada en Google Play (`mx.ejele.lavale`) y en App Store (`id6819459731`).

Las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` se conservan para el panel privado existente. No hay formularios públicos de inscripción. `NEXT_PUBLIC_PRIVACY_OWNER` y `NEXT_PUBLIC_PRIVACY_EMAIL` configuran el contacto del aviso de privacidad.
