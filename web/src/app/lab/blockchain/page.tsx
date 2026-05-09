import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BlockchainStrip } from "@/components/BlockchainStrip";

export const metadata: Metadata = {
  title: "Blockchain — Bitcoin Caveman Lab",
  description:
    "Visualize a blockchain do Bitcoin em tempo real: blocos, hashes, encadeamento e prova-de-trabalho.",
};

export default function BlockchainPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="mx-auto max-w-7xl w-full px-8 pt-16 pb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-bitcoin mb-4">
          // módulo 01
        </div>
        <h1 className="font-display text-5xl font-light">A blockchain</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Uma fila de blocos. Cada bloco aponta para o anterior pelo hash. Mude um bit em qualquer
          lugar e a corrente inteira se quebra. É só isso — e é tudo.
        </p>
      </section>

      <section className="mx-auto max-w-7xl w-full px-8 mt-4">
        <BlockchainStrip />
      </section>

      <section className="mx-auto max-w-7xl w-full px-8 mt-12 grid grid-cols-3 gap-4">
        <Concept
          n="hash"
          title="SHA-256 duplo"
          desc="Cabeçalho do bloco passa por SHA-256 duas vezes. O resultado precisa começar com N zeros."
        />
        <Concept
          n="nonce"
          title="Adivinhação massiva"
          desc="Mineradores variam um número até achar um hash válido. Bilhões de tentativas por segundo."
        />
        <Concept
          n="merkle"
          title="Raiz de Merkle"
          desc="Todas as transações do bloco são compactadas em uma única raiz — qualquer alteração muda tudo."
        />
      </section>

      <SiteFooter />
    </div>
  );
}

function Concept({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="border border-border/70 bg-card/40 p-6">
      <div className="font-mono text-[10px] uppercase tracking-widest text-bitcoin mb-3">{n}</div>
      <h3 className="font-display text-xl mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
