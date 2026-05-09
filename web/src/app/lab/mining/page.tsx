import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MiningSim } from "@/components/MiningSim";

export const metadata: Metadata = {
  title: "Mineração — Bitcoin Caveman Lab",
  description:
    "Veja a prova-de-trabalho na prática: nonce dançando, hash buscando o alvo, dificuldade ajustável.",
};

export default function MiningPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="mx-auto max-w-7xl w-full px-4 pt-12 pb-6 sm:px-6 xl:px-8 xl:pt-16 xl:pb-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-bitcoin mb-4 sm:text-[11px] sm:tracking-[0.3em]">
          // estação viii
        </div>
        <h1 className="font-display text-4xl font-light sm:text-5xl">Provar com trabalho</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Mineradores não &quot;escolhem&quot; quem ganha o bloco. Eles competem chutando números
          até achar um hash raro o suficiente. Você é o minerador agora — escolha a dificuldade e
          mine.
        </p>
      </section>
      <section className="mx-auto max-w-7xl w-full px-4 mt-4 sm:px-6 xl:px-8">
        <MiningSim />
      </section>
      <SiteFooter />
    </div>
  );
}
