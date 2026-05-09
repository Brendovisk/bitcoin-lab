import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MempoolStream } from "@/components/MempoolStream";

export const metadata: Metadata = {
  title: "Mempool — Bitcoin Caveman Lab",
  description:
    "A sala de espera do Bitcoin: transações pendentes, taxas e como mineradores escolhem o que entra no próximo bloco.",
};

export default function MempoolPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="mx-auto max-w-7xl w-full px-8 pt-16 pb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-bitcoin mb-4">
          // módulo 02
        </div>
        <h1 className="font-display text-5xl font-light">A mempool</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          A sala de espera. Toda transação passa por aqui antes de virar bloco. Quem paga mais por
          byte, entra primeiro. Não tem fila de banco — tem leilão.
        </p>
      </section>
      <section className="mx-auto max-w-7xl w-full px-8 mt-4">
        <MempoolStream />
      </section>
      <SiteFooter />
    </div>
  );
}
