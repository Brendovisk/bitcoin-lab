import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MiningSim } from "@/components/MiningSim";

export const Route = createFileRoute("/lab/mining")({
  head: () => ({ meta: [
    { title: "Mineração — Bitcoin Caveman Lab" },
    { name: "description", content: "Veja a prova-de-trabalho na prática: nonce dançando, hash buscando o alvo, dificuldade ajustável." },
  ] }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="mx-auto max-w-7xl w-full px-8 pt-16 pb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-bitcoin mb-4">// estação viii</div>
        <h1 className="font-display text-5xl font-light">Provar com trabalho</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Mineradores não “escolhem” quem ganha o bloco. Eles competem chutando números até achar
          um hash raro o suficiente. Você é o minerador agora — escolha a dificuldade e mine.
        </p>
      </section>
      <section className="mx-auto max-w-7xl w-full px-8 mt-4">
        <MiningSim />
      </section>
      <SiteFooter />
    </div>
  );
}
