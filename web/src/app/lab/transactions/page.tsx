import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TxBuilder } from "@/components/TxBuilder";

export const metadata: Metadata = {
  title: "Transações — Bitcoin Caveman Lab",
  description:
    "Construa uma transação Bitcoin peça por peça: inputs, outputs, troco, taxa, assinatura e broadcast.",
};

export default function TransactionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="mx-auto max-w-7xl w-full px-8 pt-16 pb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-bitcoin mb-4">
          // estação iv
        </div>
        <h1 className="font-display text-5xl font-light">Construir uma transação</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Sem mágica. Você escolhe os inputs, declara os outputs, calcula a taxa e assina. Acompanhe
          à direita o JSON da transação ganhando forma a cada passo.
        </p>
      </section>
      <section className="mx-auto max-w-7xl w-full px-8 mt-4">
        <TxBuilder />
      </section>
      <SiteFooter />
    </div>
  );
}
