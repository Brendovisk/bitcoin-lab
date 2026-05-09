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
      <section className="mx-auto max-w-7xl w-full px-8 pt-16 pb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-bitcoin mb-4">
          // estação vii
        </div>
        <h1 className="font-display text-5xl font-light">Conversando com o nó</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          O Bitcoin Core é o software que <em>é</em> o Bitcoin. Aqui você usa o mesmo terminal que
          devs usam pra falar com o protocolo — digite comandos, leia respostas reais.
        </p>
      </section>
      <section className="mx-auto max-w-7xl w-full px-8 mt-4 pb-12">
        <CoreSection />
      </section>
      <SiteFooter />
    </div>
  );
}
