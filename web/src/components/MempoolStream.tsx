"use client";

import { useEffect, useState } from "react";

type Tx = { id: string; sats: number; fee: number; vsize: number };

const hex = "0123456789abcdef";
const mkId = () => Array.from({ length: 16 }, () => hex[Math.floor(Math.random() * 16)]).join("");
const mkTx = (): Tx => ({
  id: mkId(),
  sats: Math.floor(Math.random() * 5000000) + 10000,
  fee: Math.floor(Math.random() * 80) + 2,
  vsize: 140 + Math.floor(Math.random() * 380),
});

export function MempoolStream({ rows = 8 }: { rows?: number }) {
  const [txs, setTxs] = useState<Tx[]>([]);

  useEffect(() => {
    setTxs(Array.from({ length: rows }, mkTx));
    const id = setInterval(() => {
      setTxs((prev) => [mkTx(), ...prev.slice(0, rows - 1)]);
    }, 1800);
    return () => clearInterval(id);
  }, [rows]);

  return (
    <div className="border border-border/70 bg-card/30 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            mempool · pending
          </div>
          <h3 className="font-display text-xl">Transações esperando confirmação</h3>
        </div>
        <div className="font-mono text-[11px] text-bitcoin">{txs.length * 312} sat/vB total</div>
      </div>
      <div className="space-y-1 font-mono text-xs min-h-[260px]">
        {txs.length === 0 && <div className="text-muted-foreground/60">aguardando transações…</div>}
        {txs.map((t, i) => {
          const intensity = Math.min(t.fee / 80, 1);
          return (
            <div
              key={t.id}
              className="group flex items-center justify-between border-b border-border/40 py-1.5 transition-colors hover:bg-bitcoin/5 animate-fade-up"
              style={{ opacity: 1 - i * 0.06 }}
              title={`txid: ${t.id}\nvsize: ${t.vsize} vB\nfee: ${t.fee} sat/vB`}
            >
              <span className="text-muted-foreground truncate flex items-center gap-3">
                <span
                  className="inline-block h-1.5 rounded-sm"
                  style={{
                    width: `${20 + intensity * 80}px`,
                    background: `oklch(0.78 0.16 60 / ${0.25 + intensity * 0.6})`,
                  }}
                />
                tx_{t.id}
              </span>
              <div className="flex items-center gap-6">
                <span className="text-muted-foreground/70 hidden md:inline">{t.vsize} vB</span>
                <span className="text-foreground">{(t.sats / 1e8).toFixed(8)} BTC</span>
                <span className="text-bitcoin w-20 text-right">{t.fee} sat/vB</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
