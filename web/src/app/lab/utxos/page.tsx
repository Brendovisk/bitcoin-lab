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
      <section className="mx-auto max-w-7xl w-full px-8 pt-16 pb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-bitcoin mb-4">
          // estação iii
        </div>
        <h1 className="font-display text-5xl font-light">Moedas que se quebram</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Esqueça &quot;saldo&quot;. No Bitcoin você tem{" "}
          <span className="text-foreground">pedaços inteiros</span> de moedas (UTXOs). Gastar
          significa pegar pedaços, juntar, partir, e o que sobra volta como troco.
        </p>
      </section>
      <section className="mx-auto max-w-7xl w-full px-8 mt-4">
        <UtxoFlow />
      </section>
      <SiteFooter />
    </div>
  );
}
