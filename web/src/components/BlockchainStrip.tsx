"use client";

import { useEffect, useState } from "react";

type Block = {
  height: number;
  hash: string;
  txs: number;
  size: string;
  time: string;
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export function BlockchainStrip() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let es: EventSource | null = null;
    let dead = false;

    function connect() {
      if (dead) return;
      es = new EventSource(`${API}/api/sse/blocks`);

      es.addEventListener("init", (e) => {
        const data = JSON.parse(e.data) as { blocks: Block[] };
        setBlocks(data.blocks);
        setConnected(true);
      });

      es.addEventListener("block", (e) => {
        const block = JSON.parse(e.data) as Block;
        setBlocks((prev) => [block, ...prev.slice(0, 4)]);
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
  }, []);

  return (
    <div className="border border-border/70 bg-card/30 p-6 scanline">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            live · signet
          </div>
          <h3 className="font-display text-xl">A blockchain, em tempo real</h3>
        </div>
        <div className={`font-mono text-[11px] ${connected ? "text-signal pulse-dot" : "text-muted-foreground"}`}>
          {connected ? "sincronizado" : "conectando…"}
        </div>
      </div>

      <div className="flex items-stretch gap-2 overflow-x-auto pb-2 min-h-[170px]">
        {blocks.length === 0 && (
          <div className="font-mono text-xs text-muted-foreground/60 self-center">
            conectando ao nó…
          </div>
        )}
        {blocks.map((b, i) => (
          <div key={b.height} className="relative flex items-center shrink-0 animate-fade-up">
            <div
              className={`w-44 border ${i === 0 ? "border-bitcoin animate-block" : "border-border"} bg-background/80 p-3`}
            >
              <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
                BLOCK
              </div>
              <div className="font-mono text-bitcoin text-lg">#{b.height.toLocaleString()}</div>
              <div className="font-mono text-[10px] text-muted-foreground truncate mt-2 animate-hash">
                {b.hash.slice(0, 26)}…
              </div>
              <div className="mt-3 grid grid-cols-2 gap-1 font-mono text-[10px]">
                <div className="text-muted-foreground">txs</div>
                <div className="text-right">{b.txs}</div>
                <div className="text-muted-foreground">size</div>
                <div className="text-right">{b.size}</div>
                <div className="text-muted-foreground">age</div>
                <div className="text-right">{b.time}</div>
              </div>
            </div>
            {i < blocks.length - 1 && <div className="text-border font-mono px-1">←</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
