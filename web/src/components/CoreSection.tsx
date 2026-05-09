"use client";

import { useState } from "react";
import { CoreTerminal } from "./CoreTerminal";

const HINTS = [
  { c: "getblockcount", d: "altura do último bloco" },
  { c: "getblockchaininfo", d: "estado completo da chain" },
  { c: "getrawmempool", d: "txs pendentes na mempool" },
  { c: "listwallets", d: "wallets carregadas no momento" },
  { c: "loadwallet alice", d: "carrega a wallet alice" },
  { c: "loadwallet bob", d: "carrega a wallet bob" },
  { c: "unloadwallet alice", d: "descarrega a wallet alice" },
  { c: "unloadwallet bob", d: "descarrega a wallet bob" },
  { c: "getnewaddress", d: "novo endereço da carteira ativa" },
  { c: "getbalance", d: "saldo da wallet carregada" },
  { c: "listunspent", d: "UTXOs disponíveis para gastar" },
  { c: "generatetoaddress 3 <addr>", d: "minera 3 blocos (regtest)" },
  { c: "sendtoaddress <addr> 0.01", d: "manda 0.01 BTC" },
];

export function CoreSection() {
  const [paste, setPaste] = useState<{ cmd: string; seq: number } | null>(null);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8">
        <CoreTerminal paste={paste} />
      </div>
      <aside className="col-span-4 border border-border/70 bg-card/30 p-5">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
          comandos para experimentar
        </div>
        <div className="space-y-3 font-mono text-xs">
          {HINTS.map((h) => (
            <button
              key={h.c}
              onClick={() => setPaste((p) => ({ cmd: h.c, seq: (p?.seq ?? 0) + 1 }))}
              className="w-full text-left border-b border-border/40 pb-2 group hover:border-bitcoin/30 transition-colors"
            >
              <div className="text-bitcoin group-hover:underline">$ {h.c}</div>
              <div className="text-muted-foreground mt-0.5">{h.d}</div>
            </button>
          ))}
        </div>
        <p className="mt-5 text-xs text-muted-foreground leading-relaxed">
          Dica: use <span className="text-bitcoin">↑</span> e{" "}
          <span className="text-bitcoin">↓</span> para navegar no histórico.
        </p>
      </aside>
    </div>
  );
}
