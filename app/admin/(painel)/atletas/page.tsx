import type { Metadata } from "next";
import GerenciarAtletas from "@/components/admin/GerenciarAtletas";

export const metadata: Metadata = {
  title: "Atletas",
  robots: { index: false, follow: false },
};

export default function PaginaAdminAtletas() {
  return <GerenciarAtletas />;
}
