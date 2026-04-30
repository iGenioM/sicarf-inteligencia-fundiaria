import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SICARF — Inteligência Fundiária",
  description: "Simulador de campanha e acompanhamento de regularização fundiária",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
