import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ModuleCard } from "@/components/ModuleCard";

export const metadata: Metadata = {
  title: "Laboratório — Bitcoin Caveman Lab",
  description:
    "Módulos interativos para aprender Bitcoin: blockchain, mempool, UTXOs, carteiras, mineração e mais.",
};

export default function LabIndex() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-4 pt-14 pb-10 border-b border-border/60 sm:px-6 sm:pt-16 xl:px-8 xl:pt-20 xl:pb-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-bitcoin mb-5 sm:text-[11px] sm:tracking-[0.3em] xl:mb-6">
          // laboratório · v0.1
        </div>
        <h1 className="font-display text-4xl font-light tracking-tight max-w-3xl sm:text-5xl xl:text-6xl">
          Nove estações para você <em className="text-bitcoin">enxergar</em> o Bitcoin.
        </h1>
        <p className="mt-6 text-muted-foreground max-w-2xl">
          Cada estação é um experimento ao vivo. Você pode mexer, quebrar, reconstruir. Comece por
          onde quiser — mas se for sua primeira fogueira, siga a ordem.
        </p>
      </section>

      <section className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-4 px-4 pb-8 sm:grid-cols-2 sm:px-6 xl:mt-12 xl:grid-cols-3 xl:px-8">
        {MODULES.map((m) => (
          <ModuleCard key={m.index} {...m} />
        ))}
      </section>

      <SiteFooter />
    </div>
  );
}

const MODULES = [
  {
    index: "Estação I",
    title: "Blockchain",
    description:
      "Veja blocos sendo encadeados em tempo real. Inspecione hashes, alturas e a prova-de-trabalho.",
    href: "/lab/blockchain",
    meta: "regtest · live",
  },
  {
    index: "Estação II",
    title: "Mempool",
    description:
      "Acompanhe transações esperando confirmação. Veja taxas brigando por espaço no próximo bloco.",
    href: "/lab/mempool",
    meta: "stream ao vivo",
  },
  {
    index: "Estação III",
    title: "UTXOs",
    description:
      "Moedas no Bitcoin se quebram e se juntam. Veja inputs sendo consumidos e outputs nascendo.",
    href: "/lab/utxos",
    meta: "fluxo visual",
  },
  {
    index: "Estação IV",
    title: "Transações",
    description:
      "Monte uma transação peça por peça. Inputs, outputs, troco, taxa, assinatura — e broadcast.",
    href: "/lab/transactions",
    meta: "construtor",
  },
  {
    index: "Estação V",
    title: "Carteiras & Seeds",
    description:
      "12 palavras viram bilhões de chaves. Gere uma seed, derive endereços, entenda a árvore HD.",
    href: "/lab/wallets",
    meta: "BIP39 · HD",
  },
  {
    index: "Estação VI",
    title: "Redes",
    description:
      "regtest, signet, mainnet — três Bitcoins, três propósitos. Aprenda quando usar cada um.",
    href: "/lab/networks",
    meta: "comparativo",
  },
  {
    index: "Estação VII",
    title: "Bitcoin Core",
    description: "Um terminal de verdade. Digite comandos, leia respostas, converse com o nó.",
    href: "/lab/bitcoin-core",
    meta: "bitcoin-cli",
  },
  {
    index: "Estação VIII",
    title: "Mineração",
    description:
      "Veja o nonce dançando, o hash tentando bater no alvo. Mine um bloco com suas próprias mãos.",
    href: "/lab/mining",
    meta: "PoW interativo",
  },
  {
    index: "Estação IX",
    title: "Desafios",
    description:
      "Puzzles progressivos para você provar que entende. Recupere fundos, decifre scripts, vença.",
    href: "/lab/challenges",
    meta: "9 missões",
  },
];
