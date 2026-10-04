import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Panel · Lávale",
  robots: { index: false, follow: false },
};

/// Panel privado: login con enlace mágico de Supabase y métricas que solo
/// devuelve la función `admin_dashboard` a correos dados de alta en `admins`.
export default function AdminPage() {
  return <AdminDashboard />;
}
