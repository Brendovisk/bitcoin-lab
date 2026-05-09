import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Redes — Bitcoin Caveman Lab",
  description: "regtest, signet e mainnet: três Bitcoins, três propósitos. Quando usar cada um.",
};

const NETS = [
  {
    name: "regtest",
    tag: "seu computador",
    desc: "Você é o universo. Mine blocos sob demanda, crie moedas do nada, reinicie tudo. Perfeito pra aprender e quebrar coisas.",
    points: ["instantâneo", "controle total", "sem dinheiro real", "rede privada local"],
    glow: true,
  },
  {
    name: "signet",
    tag: "rede pública de teste",
    desc: "Uma rede de teste compartilhada. Blocos saem em ritmo previsível. Boa pra testar integrações e wallets.",
    points: ["pública", "blocos a cada ~10min", "moedas via faucet", "sem valor financeiro"],
  },
  {
    name: "mainnet",
    tag: "a coisa séria",
    desc: "A rede real. Onde Bitcoin tem valor. Erros aqui custam dinheiro de verdade — e são irreversíveis.",
    points: ["real e final", "consenso global", "sem 'ctrl+z'", "use por último"],
  },
];

export default function NetworksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="mx-auto max-w-7xl w-full px-4 pt-12 pb-6 sm:px-6 xl:px-8 xl:pt-16 xl:pb-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-bitcoin mb-4 sm:text-[11px] sm:tracking-[0.3em]">
          // estação vi
        </div>
        <h1 className="font-display text-4xl font-light sm:text-5xl">Três redes, um protocolo</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Bitcoin não é uma rede só. Existem versões pra brincar, testar e usar de verdade. Aprenda
          nas duas primeiras antes de tocar na terceira.
        </p>
      </section>

      <section className="mx-auto max-w-7xl w-full px-4 mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-6 xl:grid-cols-3 xl:px-8">
        {NETS.map((n) => (
          <div
            key={n.name}
            className={`border ${n.glow ? "border-bitcoin/60 shadow-glow" : "border-border/70"} bg-card/30 p-6`}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {n.tag}
            </div>
            <h3 className="font-display text-3xl text-bitcoin mt-1">{n.name}</h3>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{n.desc}</p>
            <ul className="mt-5 space-y-1.5 font-mono text-[11px]">
              {n.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-bitcoin">›</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl w-full px-4 mt-8 sm:px-6 xl:mt-12 xl:px-0">
        <div className="border border-border/70 bg-card/30 p-6 xl:p-8">
          <div className="font-mono text-[10px] uppercase tracking-widest text-bitcoin mb-3">
            // regra do caveman
          </div>
          <p className="font-display text-xl leading-snug max-w-3xl sm:text-2xl">
            Aprenda em <span className="text-bitcoin">regtest</span>. Confirme em{" "}
            <span className="text-bitcoin">signet</span>. Só então toque em{" "}
            <span className="text-bitcoin">mainnet</span> — devagar e com pouco sat.
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
