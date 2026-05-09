import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CoreSection } from "@/components/CoreSection";

export const metadata: Metadata = {
  title: "Bitcoin Core — Bitcoin Caveman Lab",
  description:
    "Um terminal interativo bitcoin-cli. Converse com um nó Bitcoin, leia respostas reais do protocolo.",
};

export default function BitcoinCorePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="mx-auto max-w-7xl w-full px-4 pt-12 pb-6 sm:px-6 xl:px-8 xl:pt-16 xl:pb-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-bitcoin mb-4 sm:text-[11px] sm:tracking-[0.3em]">
          // estação vii
        </div>
        <h1 className="font-display text-4xl font-light sm:text-5xl">Conversando com o nó</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          O Bitcoin Core é o software que <em>é</em> o Bitcoin. Aqui você usa o mesmo terminal que
          devs usam pra falar com o protocolo — digite comandos, leia respostas reais.
        </p>
      </section>
      <section className="mx-auto max-w-7xl w-full px-4 mt-4 pb-12 sm:px-6 xl:px-8">
        <CoreSection />
      </section>
      <SiteFooter />
    </div>
  );
}
