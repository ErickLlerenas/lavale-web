import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import {
  brandName,
  brandNamePlain,
  siteDescription,
  siteTitle,
  siteUrl,
} from "@/lib/site";
import "./globals.css";

/// Fuente local (Plus Jakarta Sans, OFL): no depende de Google Fonts al
/// compilar en Vercel.
const jakarta = localFont({
  src: "./fonts/PlusJakartaSans-latin.woff2",
  variable: "--font-sans",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: brandNamePlain,
  keywords: [
    "Lávale",
    "Lavale",
    "app para lavanderías",
    "tickets lavandería",
    "lavandería por kilo",
    "punto de venta lavandería",
    "software lavandería México",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: brandName,
    locale: "es_MX",
    type: "website",
    images: [{ url: "/og-icon.png", width: 256, height: 256, alt: brandName }],
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-icon.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0F766E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-MX" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
