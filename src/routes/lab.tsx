import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ModuleCard } from "@/components/ModuleCard";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Laboratório — Bitcoin Caveman Lab" },
      { name: "description", content: "Módulos interativos para aprender Bitcoin: blockchain, mempool, UTXOs, carteiras, mineração e mais." },
    ],
  }),
  component: LabIndex,
});

function LabIndex() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-8 pt-20 pb-12 border-b border-border/60">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-bitcoin mb-6">// laboratório · v0.1</div>
        <h1 className="font-display text-6xl font-light tracking-tight max-w-3xl">
          Nove estações para você <em className="text-bitcoin">enxergar</em> o Bitcoin.
        </h1>
        <p className="mt-6 text-muted-foreground max-w-2xl">
          Cada módulo é independente. Comece por onde quiser — mas se for sua primeira vez, siga a ordem.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-8 mt-12 grid grid-cols-3 gap-4">
        {MODULES.map((m) => (
          <ModuleCard key={m.index} {...m} />
        ))}
      </section>

      <SiteFooter />
    </div>
  );
}

const MODULES = [
  { index: "01", title: "Blockchain", description: "Veja blocos sendo encadeados em tempo real. Inspecione hashes, alturas e a prova-de-trabalho.", to: "/lab/blockchain", meta: "regtest · live" },
  { index: "02", title: "Mempool", description: "Acompanhe transações esperando confirmação. Entenda taxas, prioridade e congestionamento.", to: "/lab/mempool", meta: "stream ao vivo" },
  { index: "03", title: "UTXOs", description: "O modelo real do Bitcoin: moedas como pedaços que se quebram e se juntam. Visual e palpável.", status: "soon" as const },
  { index: "04", title: "Transações", description: "Construa uma transação byte a byte: inputs, outputs, change e assinatura.", status: "soon" as const },
  { index: "05", title: "Carteiras & Seeds", description: "BIP39, derivação HD, xpubs. Gere uma seed, derive endereços e entenda a árvore.", status: "soon" as const },
  { index: "06", title: "Redes", description: "regtest, signet, mainnet — quando usar cada uma e por quê.", status: "soon" as const },
  { index: "07", title: "Bitcoin Core", description: "Use o nó como ele deve ser usado: bitcoin-cli, RPC e debug console.", status: "soon" as const },
  { index: "08", title: "Mineração", description: "Minere blocos no regtest. Entenda nonce, target e dificuldade na prática.", status: "soon" as const },
  { index: "09", title: "Desafios", description: "Resolva exercícios assinados, recupere fundos perdidos, decifre scripts.", status: "soon" as const },
];
