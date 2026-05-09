"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Tx = { id: string; sats: number; fee: number; vsize: number };

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export function MempoolStream({ rows = 8 }: { rows?: number }) {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let es: EventSource | null = null;
    let dead = false;

    async function refreshMempool() {
      try {
        const res = await fetch(`${API}/api/mempool/txs`, { cache: "no-store" });
        if (!res.ok || dead) return;
        const data = (await res.json()) as { txs: Tx[] };
        setTxs(data.txs.slice(0, rows));
      } catch {
        // SSE remains the primary live feed; polling only reconciles stale state.
      }
    }

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
    void refreshMempool();
    const poll = setInterval(() => {
      void refreshMempool();
    }, 5_000);

    return () => {
      dead = true;
      es?.close();
      clearInterval(poll);
    };
  }, [rows]);

  return (
    <div className="border border-border/70 bg-card/30 p-4 sm:p-6">
      <div className="flex flex-col gap-4 mb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            mempool · regtest · pending
          </div>
          <h3 className="font-display text-xl">Transações esperando confirmação</h3>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          {txs.length > 0 && (
            <Link
              href="/lab/mining"
              className="font-mono text-[10px] uppercase tracking-widest border border-bitcoin/50 text-bitcoin px-3 py-1.5 hover:bg-bitcoin/10 transition-colors"
            >
              minerar agora →
            </Link>
          )}
          <div
            className={`font-mono text-[11px] ${connected ? "text-bitcoin" : "text-muted-foreground"}`}
          >
            {connected ? `${txs.reduce((s, t) => s + t.fee, 0)} sat/vB total` : "conectando…"}
          </div>
        </div>
      </div>
      <div className="space-y-1 font-mono text-[11px] min-h-[260px] sm:text-xs">
        {txs.length === 0 && <div className="text-muted-foreground/60">aguardando transações…</div>}
        {txs.map((t, i) => {
          const intensity = Math.min(t.fee / 80, 1);
          return (
            <div
              key={t.id}
              className="group flex flex-col gap-1 border-b border-border/40 py-2 transition-colors hover:bg-bitcoin/5 animate-fade-up sm:flex-row sm:items-center sm:justify-between sm:py-1.5"
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
              <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-6">
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
