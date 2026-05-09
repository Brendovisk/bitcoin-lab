import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SeedExplorer } from "@/components/SeedExplorer";

export const metadata: Metadata = {
  title: "Carteiras & Seeds — Bitcoin Caveman Lab",
  description:
    "Gere uma seed BIP39, derive endereços HD e entenda como 12 palavras viram bilhões de chaves.",
};

export default function WalletsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="mx-auto max-w-7xl w-full px-8 pt-16 pb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-bitcoin mb-4">
          // estação v
        </div>
        <h1 className="font-display text-5xl font-light">Doze palavras, uma carteira</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Sua carteira não está num app. Está numa lista de palavras que <em>você</em> guarda. Esta
          estação é uma demonstração — palavras geradas aqui são apenas didáticas.
        </p>
      </section>
      <section className="mx-auto max-w-7xl w-full px-8 mt-4">
        <SeedExplorer />
      </section>
      <SiteFooter />
    </div>
  );
}
