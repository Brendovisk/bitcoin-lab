import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BlockchainStrip } from "@/components/BlockchainStrip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bitcoin Caveman Lab — Aprenda Bitcoin na prática" },
      { name: "description", content: "Um laboratório interativo para entender Bitcoin de verdade: blocos, UTXOs, mempool, autocustódia e o protocolo, sem jargões." },
      { property: "og:title", content: "Bitcoin Caveman Lab" },
      { property: "og:description", content: "Bitcoin não deveria parecer mágica. Veja, mexa, entenda." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* HERO */}
      <section className="relative bg-radial-glow">
        <div className="mx-auto max-w-7xl px-8 pt-24 pb-20 grid grid-cols-12 gap-8 items-end">
          <div className="col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-bitcoin mb-8">
              <span className="pulse-dot" />ϟ aprendizado soberano · sem kyc · sem mágica
            </div>
            <h1 className="font-display text-7xl leading-[0.95] tracking-tight font-light">
              Bitcoin não deveria<br />
              parecer <span className="italic text-bitcoin">mágica.</span>
            </h1>
            <p className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed">
              O Caveman Lab é um <span className="text-foreground">laboratório interativo</span> para você
              ver, mexer e entender o que acontece por baixo das carteiras —
              blocos, UTXOs, mempool, mineração e autocustódia, na prática.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Link
                to="/lab"
                className="group inline-flex items-center gap-3 bg-bitcoin px-6 py-3 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-bitcoin-glow transition-colors"
              >
                entrar no laboratório
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                to="/lab/blockchain"
                className="inline-flex items-center gap-3 border border-border px-6 py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                ver a blockchain
              </Link>
            </div>
          </div>

          <div className="col-span-5">
            <pre className="font-mono text-[10px] leading-tight text-bitcoin/60 select-none">{`
        ╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱
       │ ░░  ▒▒  ▓▓  ██  │
       │  ◇  block #840k  │
       │  ◆  ◆  ◆  ◆  ◆  │
       │ utxo · utxo · utxo│
        ╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱
            verify · don't trust
`}</pre>
            <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-[11px]">
              <Stat label="hashrate" value="612 EH/s" />
              <Stat label="dificuldade" value="86.87 T" />
              <Stat label="próximo halving" value="2028" />
            </div>
          </div>
        </div>
      </section>

      {/* LIVE BLOCKS */}
      <section className="mx-auto max-w-7xl px-8 mt-8">
        <BlockchainStrip />
      </section>

      {/* PHILOSOPHY */}
      <section className="mx-auto max-w-7xl px-8 mt-32 grid grid-cols-12 gap-8">
        <div className="col-span-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-4">// filosofia</div>
          <h2 className="font-display text-4xl font-light leading-tight">
            Aprenda<br />como um <em className="text-bitcoin not-italic">caveman</em>:
          </h2>
        </div>
        <div className="col-span-8 grid grid-cols-2 gap-x-12 gap-y-10">
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
      <section className="mx-auto max-w-7xl px-8 mt-32">
        <div className="border border-border/70 bg-card/40 p-12 text-center bg-radial-glow">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-bitcoin mb-6">// próxima estação</div>
          <h2 className="font-display text-5xl font-light mb-4">Pegue uma pedra. Comece a quebrar.</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Nove módulos práticos te esperam — do primeiro bloco até sua primeira transação assinada à mão.
          </p>
          <Link
            to="/lab"
            className="inline-flex items-center gap-3 bg-bitcoin px-8 py-4 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-bitcoin-glow transition-colors"
          >
            abrir o laboratório →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/70 bg-card/40 p-3">
      <div className="text-muted-foreground uppercase tracking-widest text-[9px]">{label}</div>
      <div className="text-bitcoin mt-1">{value}</div>
    </div>
  );
}

const PRINCIPLES = [
  { tag: "01 / ver", title: "Visualize o protocolo", desc: "Cada bloco, cada UTXO, cada assinatura — renderizados na tela. Sem caixas-pretas." },
  { tag: "02 / mexer", title: "Erre sem medo", desc: "Tudo roda em regtest e signet. Quebre coisas, reinicie a rede, minere blocos sozinho." },
  { tag: "03 / entender", title: "Sem jargão inútil", desc: "Conceitos explicados como você explicaria pra alguém na fogueira. Direto, visual, prático." },
  { tag: "04 / soberano", title: "Autocustódia primeiro", desc: "Seeds BIP39, derivação de chaves, assinatura local. Suas chaves, seu Bitcoin." },
];
