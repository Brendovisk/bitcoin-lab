import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChallengesGrid } from "@/components/ChallengesGrid";

export const metadata: Metadata = {
  title: "Desafios — Bitcoin Caveman Lab",
  description:
    "Puzzles progressivos para provar que você entendeu Bitcoin: hashes, UTXOs, taxas, scripts e mais.",
};

export default function ChallengesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="mx-auto max-w-7xl w-full px-4 pt-12 pb-6 sm:px-6 xl:px-8 xl:pt-16 xl:pb-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-bitcoin mb-4 sm:text-[11px] sm:tracking-[0.3em]">
          // estação ix
        </div>
        <h1 className="font-display text-4xl font-light sm:text-5xl">Provar que você entende</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Nove missões, do iniciante ao avançado. Sem prêmio, sem badge — só a satisfação de olhar
          pro Bitcoin e dizer: <em className="text-bitcoin">eu entendi.</em>
        </p>
      </section>
      <section className="mx-auto max-w-7xl w-full px-4 mt-4 sm:px-6 xl:px-8">
        <ChallengesGrid />
      </section>
      <SiteFooter />
    </div>
  );
}
