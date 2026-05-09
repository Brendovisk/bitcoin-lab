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
      <section className="mx-auto max-w-7xl w-full px-4 pt-12 pb-6 sm:px-6 xl:px-8 xl:pt-16 xl:pb-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-bitcoin mb-4 sm:text-[11px] sm:tracking-[0.3em]">
          // módulo 02
        </div>
        <h1 className="font-display text-4xl font-light sm:text-5xl">A mempool</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          A sala de espera. Toda transação passa por aqui antes de virar bloco. Quem paga mais por
          byte, entra primeiro. Não tem fila de banco — tem leilão.
        </p>
      </section>
      <section className="mx-auto max-w-7xl w-full px-4 mt-4 sm:px-6 xl:px-8">
        <MempoolStream />
      </section>
      <SiteFooter />
    </div>
  );
}
