import type { Metadata } from "next";
import GerenciarAgenda from "@/components/admin/GerenciarAgenda";

export const metadata: Metadata = {
  title: "Agenda",
  robots: { index: false, follow: false },
};

export default function PaginaAdminAgenda() {
  return <GerenciarAgenda />;
}
