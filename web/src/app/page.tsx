import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BlockchainStrip } from "@/components/BlockchainStrip";
import { NetworkStats } from "@/components/NetworkStats";

export const metadata: Metadata = {
  title: "Bitcoin Caveman Lab — Aprenda Bitcoin na prática",
  description:
    "Um laboratório interativo para entender Bitcoin de verdade: blocos, UTXOs, mempool, autocustódia e o protocolo, sem jargões.",
  openGraph: {
    title: "Bitcoin Caveman Lab",
    description: "Bitcoin não deveria parecer mágica. Veja, mexa, entenda.",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* HERO */}
      <section className="relative bg-radial-glow">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-end gap-8 px-4 pb-14 pt-16 sm:px-6 sm:pt-20 xl:grid-cols-12 xl:px-8 xl:pb-20 xl:pt-24">
          <div className="xl:col-span-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-bitcoin mb-6 sm:text-[11px] sm:tracking-[0.3em] xl:mb-8">
              <span className="pulse-dot" />ϟ aprendizado soberano · sem kyc · sem mágica
            </div>
            <h1 className="font-display text-5xl leading-[0.98] tracking-tight font-light sm:text-6xl xl:text-7xl xl:leading-[0.95]">
              Bitcoin não deveria
              <br />
              parecer <span className="italic text-bitcoin">mágica.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg xl:mt-8">
              O Caveman Lab é um <span className="text-foreground">laboratório interativo</span>{" "}
              para você ver, mexer e entender o que acontece por baixo das carteiras — blocos,
              UTXOs, mempool, mineração e autocustódia, na prática.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 xl:mt-10">
              <Link
                href="/lab"
                className="group inline-flex items-center justify-center gap-3 bg-bitcoin px-6 py-3 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-bitcoin-glow transition-colors"
              >
                entrar no laboratório
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/lab/blockchain"
                className="inline-flex items-center justify-center gap-3 border border-border px-6 py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                ver a blockchain
              </Link>
            </div>
          </div>

          <div className="xl:col-span-5">
            <pre className="overflow-hidden font-mono text-[8px] leading-tight text-bitcoin/60 select-none sm:text-[10px]">{`
        ╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱
       │ ░░  ▒▒  ▓▓  ██  │
       │  ◇  block #840k  │
       │  ◆  ◆  ◆  ◆  ◆  │
       │ utxo · utxo · utxo│
        ╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱
            verify · don't trust
`}</pre>
            <NetworkStats />
          </div>
        </div>
      </section>

      {/* LIVE BLOCKS */}
      <section className="mx-auto mt-8 w-full max-w-7xl px-4 sm:px-6 xl:px-0">
        <BlockchainStrip />
      </section>

      {/* PHILOSOPHY */}
      <section className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 xl:mt-32 xl:grid-cols-12 xl:px-8">
        <div className="xl:col-span-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-4 sm:text-[11px] sm:tracking-[0.3em]">
            // filosofia
          </div>
          <h2 className="font-display text-3xl font-light leading-tight sm:text-4xl">
            Aprenda
            <br />
            como um <em className="text-bitcoin not-italic">caveman</em>:
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2 xl:col-span-8 xl:gap-y-10">
          {PRINCIPLES.map((p) => (
            <div key={p.title}>
              <div className="font-mono text-bitcoin text-xs mb-2">{p.tag}</div>
              <h3 className="font-display text-xl mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 xl:mt-32 xl:px-8">
        <div className="border border-border/70 bg-card/40 p-6 text-center bg-radial-glow sm:p-8 xl:p-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-bitcoin mb-6 sm:text-[11px] sm:tracking-[0.3em]">
            // próxima estação
          </div>
          <h2 className="font-display text-3xl font-light mb-4 sm:text-4xl xl:text-5xl">
            Pegue uma pedra. Comece a quebrar.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Nove módulos práticos te esperam — do primeiro bloco até sua primeira transação assinada
            à mão.
          </p>
          <Link
            href="/lab"
            className="inline-flex items-center justify-center gap-3 bg-bitcoin px-6 py-3 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-bitcoin-glow transition-colors sm:px-8 sm:py-4"
          >
            abrir o laboratório →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

const PRINCIPLES = [
  {
    tag: "01 / ver",
    title: "Visualize o protocolo",
    desc: "Cada bloco, cada UTXO, cada assinatura — renderizados na tela. Sem caixas-pretas.",
  },
  {
    tag: "02 / mexer",
    title: "Erre sem medo",
    desc: "Tudo roda em regtest e signet. Quebre coisas, reinicie a rede, minere blocos sozinho.",
  },
  {
    tag: "03 / entender",
    title: "Sem jargão inútil",
    desc: "Conceitos explicados como você explicaria pra alguém na fogueira. Direto, visual, prático.",
  },
  {
    tag: "04 / soberano",
    title: "Autocustódia primeiro",
    desc: "Seeds BIP39, derivação de chaves, assinatura local. Suas chaves, seu Bitcoin.",
  },
];
