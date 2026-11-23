import type { Metadata } from "next";
import VisaoGeral from "@/components/admin/VisaoGeral";

export const metadata: Metadata = {
  title: "Visão geral",
  robots: { index: false, follow: false },
};

export default function PaginaAdmin() {
  return <VisaoGeral />;
}
