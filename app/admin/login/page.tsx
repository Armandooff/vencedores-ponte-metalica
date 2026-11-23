import type { Metadata } from "next";
import AdminLogin from "@/components/admin/AdminLogin";

export const metadata: Metadata = {
  title: "Painel administrativo",
  description: "Área restrita da coordenação do projeto.",
  robots: { index: false, follow: false },
};

export default function PaginaLoginAdmin() {
  return <AdminLogin />;
}
