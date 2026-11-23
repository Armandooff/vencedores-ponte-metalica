import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import { DataProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth";
import "./globals.css";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vencedorespontemetalica.com"),
  title: {
    default: "Vencedores da Ponte Metálica — Bodyboard em Iracema",
    template: "%s · Vencedores da Ponte Metálica",
  },
  description:
    "Projeto social de bodyboard na Praia de Iracema, Fortaleza (CE). Esporte, educação e comunidade transformando a vida de crianças e jovens.",
  keywords: [
    "bodyboard",
    "Ponte dos Ingleses",
    "projeto social",
    "Praia de Iracema",
    "Fortaleza",
    "Vencedores da Ponte Metálica",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Vencedores da Ponte Metálica",
    description:
      "O mar como ferramenta de transformação social. Bodyboard e comunidade na Praia de Iracema.",
    images: ["/img/ponte.jpg"],
  },
  icons: {
    icon: "/img/logo.png",
    apple: "/img/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
      </head>
      <body>
        <DataProvider>
          <AuthProvider>{children}</AuthProvider>
        </DataProvider>
      </body>
    </html>
  );
}
