import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CoreTerminal } from "@/components/CoreTerminal";

export const metadata: Metadata = {
  title: "Bitcoin Core — Bitcoin Caveman Lab",
  description:
    "Um terminal interativo bitcoin-cli. Converse com um nó Bitcoin, leia respostas reais do protocolo.",
};

const HINTS = [
  { c: "getblockcount", d: "altura do último bloco" },
  { c: "getblockchaininfo", d: "estado completo da chain" },
  { c: "getnewaddress", d: "novo endereço da carteira" },
  { c: "generatetoaddress 3 <addr>", d: "minera 3 blocos (regtest)" },
  { c: "getrawmempool", d: "txs pendentes na mempool" },
  { c: "sendtoaddress <addr> 0.01", d: "manda 0.01 BTC" },
];

export default function BitcoinCorePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="mx-auto max-w-7xl w-full px-8 pt-16 pb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-bitcoin mb-4">
          // estação vii
        </div>
        <h1 className="font-display text-5xl font-light">Conversando com o nó</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          O Bitcoin Core é o software que <em>é</em> o Bitcoin. Aqui você usa o mesmo terminal que
          devs usam pra falar com o protocolo — digite comandos, leia respostas reais.
        </p>
      </section>
      <section className="mx-auto max-w-7xl w-full px-8 mt-4 grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <CoreTerminal />
        </div>
        <aside className="col-span-4 border border-border/70 bg-card/30 p-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
            comandos para experimentar
          </div>
          <div className="space-y-3 font-mono text-xs">
            {HINTS.map((h) => (
              <div key={h.c} className="border-b border-border/40 pb-2">
                <div className="text-bitcoin">$ {h.c}</div>
                <div className="text-muted-foreground mt-0.5">{h.d}</div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted-foreground leading-relaxed">
            Dica: use <span className="text-bitcoin">↑</span> e{" "}
            <span className="text-bitcoin">↓</span> para navegar no histórico.
          </p>
        </aside>
      </section>
      <SiteFooter />
    </div>
  );
}
