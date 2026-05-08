import { useEffect, useState } from "react";

type Tx = { id: string; sats: number; fee: number };

const hex = "0123456789abcdef";
const mkId = () => Array.from({ length: 16 }, () => hex[Math.floor(Math.random() * 16)]).join("");

export function MempoolStream() {
  const [txs, setTxs] = useState<Tx[]>(() =>
    Array.from({ length: 8 }, () => ({
      id: mkId(),
      sats: Math.floor(Math.random() * 5000000) + 10000,
      fee: Math.floor(Math.random() * 80) + 2,
    }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTxs((prev) => [
        { id: mkId(), sats: Math.floor(Math.random() * 5000000) + 10000, fee: Math.floor(Math.random() * 80) + 2 },
        ...prev.slice(0, 7),
      ]);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border border-border/70 bg-card/30 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">mempool · pending</div>
          <h3 className="font-display text-xl">Transações esperando confirmação</h3>
        </div>
        <div className="font-mono text-[11px] text-bitcoin">{txs.length * 312} sat/vB</div>
      </div>
      <div className="space-y-1 font-mono text-xs">
        {txs.map((t, i) => (
          <div
            key={t.id}
            className="flex items-center justify-between border-b border-border/40 py-1.5 transition-opacity"
            style={{ opacity: 1 - i * 0.08 }}
          >
            <span className="text-muted-foreground truncate">tx_{t.id}</span>
            <div className="flex items-center gap-6">
              <span className="text-foreground">{(t.sats / 1e8).toFixed(8)} BTC</span>
              <span className="text-bitcoin w-16 text-right">{t.fee} sat/vB</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
