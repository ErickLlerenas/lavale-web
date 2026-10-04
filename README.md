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

## Prueba cerrada de Google Play (`/probar`)

Página para anuncios: el tester deja su Gmail y después ve los botones para unirse al grupo y a la prueba. Al día 14, a quien siga inscrito se le manda un código de promoción de Play para el producto «De por vida».

Variables en Vercel:

| Variable | Qué es |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Proyecto «Lávale». La tabla `tester_signups` solo acepta inserciones (migración `002_tester_signups.sql` en el repo de la app). |
| `NEXT_PUBLIC_TESTER_GROUP_URL` | Grupo de Google dado de alta como lista de testers en Play Console. |
| `NEXT_PUBLIC_PLAY_TEST_URL` | Enlace de inscripción de la prueba cerrada. |
| `NEXT_PUBLIC_TESTER_PROGRAM=closed` | Cierra la inscripción y quita los botones «Probar gratis». |
| `NEXT_PUBLIC_PRIVACY_OWNER` / `NEXT_PUBLIC_PRIVACY_EMAIL` | Responsable y correo del aviso de privacidad (`/privacidad`). |

Usa `?utm_source=facebook&utm_campaign=…` en los anuncios: se guarda en la columna `source`.
