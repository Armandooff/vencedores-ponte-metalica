import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vencedores da Ponte Metálica",
  description:
    "Projeto social de bodyboard e surf na Praia de Iracema, Fortaleza - CE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
