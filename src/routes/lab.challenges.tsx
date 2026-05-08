import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChallengesGrid } from "@/components/ChallengesGrid";

export const Route = createFileRoute("/lab/challenges")({
  head: () => ({ meta: [
    { title: "Desafios — Bitcoin Caveman Lab" },
    { name: "description", content: "Puzzles progressivos para provar que você entendeu Bitcoin: hashes, UTXOs, taxas, scripts e mais." },
  ] }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="mx-auto max-w-7xl w-full px-8 pt-16 pb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-bitcoin mb-4">// estação ix</div>
        <h1 className="font-display text-5xl font-light">Provar que você entende</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Nove missões, do iniciante ao avançado. Sem prêmio, sem badge — só a satisfação de
          olhar pro Bitcoin e dizer: <em className="text-bitcoin">eu entendi.</em>
        </p>
      </section>
      <section className="mx-auto max-w-7xl w-full px-8 mt-4">
        <ChallengesGrid />
      </section>
      <SiteFooter />
    </div>
  );
}
