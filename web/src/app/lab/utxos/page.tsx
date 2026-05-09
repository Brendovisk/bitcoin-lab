import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { UtxoFlow } from "@/components/UtxoFlow";

export const metadata: Metadata = {
  title: "UTXOs — Bitcoin Caveman Lab",
  description:
    "Visualize moedas no Bitcoin como pedaços que se quebram e se juntam. Selecione UTXOs, gaste, gere troco.",
};

export default function UtxosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="mx-auto max-w-7xl w-full px-4 pt-12 pb-6 sm:px-6 xl:px-8 xl:pt-16 xl:pb-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-bitcoin mb-4 sm:text-[11px] sm:tracking-[0.3em]">
          // estação iii
        </div>
        <h1 className="font-display text-4xl font-light sm:text-5xl">Moedas que se quebram</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Esqueça &quot;saldo&quot;. No Bitcoin você tem{" "}
          <span className="text-foreground">pedaços inteiros</span> de moedas (UTXOs). Gastar
          significa pegar pedaços, juntar, partir, e o que sobra volta como troco.
        </p>
      </section>
      <section className="mx-auto max-w-7xl w-full px-4 mt-4 sm:px-6 xl:px-8">
        <UtxoFlow />
      </section>
      <SiteFooter />
    </div>
  );
}
