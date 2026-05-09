import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bitcoin Caveman Lab",
  description:
    "Um laboratório interativo para aprender Bitcoin do zero. Experimente comandos, visualize blocos e transações na regtest — tudo em tempo real.",
  authors: [{ name: "Bitcoin Caveman Lab Team" }],
  openGraph: {
    title: "Bitcoin Caveman Lab",
    description:
      "Laboratório interativo para aprender Bitcoin, explorando blocos, transações e mempool em regtest.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitcoin Caveman Lab",
    description:
      "Entre no laboratório interativo: experimente transações e mineração no seu próprio ambiente Bitcoin.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
