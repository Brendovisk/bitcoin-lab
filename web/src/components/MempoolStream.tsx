"use client";

import { useEffect, useState } from "react";

type Tx = { id: string; sats: number; fee: number; vsize: number };

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export function MempoolStream({ rows = 8 }: { rows?: number }) {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let es: EventSource | null = null;
    let dead = false;

    function connect() {
      if (dead) return;
      es = new EventSource(`${API}/api/sse/mempool`);

      es.addEventListener("init", (e) => {
        const data = JSON.parse(e.data) as { txs: Tx[] };
        setTxs(data.txs.slice(0, rows));
        setConnected(true);
      });

      es.addEventListener("tx", (e) => {
        const tx = JSON.parse(e.data) as Tx;
        setTxs((prev) => [tx, ...prev.slice(0, rows - 1)]);
      });

      es.onerror = () => {
        setConnected(false);
        es?.close();
        setTimeout(connect, 5_000);
      };
    }

    connect();
    return () => {
      dead = true;
      es?.close();
    };
  }, [rows]);

  return (
    <div className="border border-border/70 bg-card/30 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            mempool · mainnet · pending
          </div>
          <h3 className="font-display text-xl">Transações esperando confirmação</h3>
        </div>
        <div className={`font-mono text-[11px] ${connected ? "text-bitcoin" : "text-muted-foreground"}`}>
          {connected
            ? `${txs.reduce((s, t) => s + t.fee, 0)} sat/vB total`
            : "conectando…"}
        </div>
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
