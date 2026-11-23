import type { Metadata } from "next";
import GerenciarNoticias from "@/components/admin/GerenciarNoticias";

export const metadata: Metadata = {
  title: "Notícias",
  robots: { index: false, follow: false },
};

export default function PaginaAdminNoticias() {
  return <GerenciarNoticias />;
}
