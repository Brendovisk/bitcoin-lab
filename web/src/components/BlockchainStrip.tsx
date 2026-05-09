"use client";

import { useEffect, useState } from "react";

type Block = {
  height: number;
  hash: string;
  txs: number;
  size: string;
  time: string;
};

const HEX = "0123456789abcdef";
function rand(len: number) {
  let s = "";
  for (let i = 0; i < len; i++) s += HEX[Math.floor(Math.random() * 16)];
  return s;
}

function makeBlock(h: number): Block {
  return {
    height: h,
    hash: "0000000000000000000" + rand(45),
    txs: 1800 + Math.floor(Math.random() * 1500),
    size: (1.2 + Math.random() * 0.6).toFixed(2) + " MB",
    time: Math.floor(Math.random() * 9 + 1) + "min",
  };
}

export function BlockchainStrip() {
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    setBlocks(Array.from({ length: 5 }, (_, i) => makeBlock(840219 - i)));
    const id = setInterval(() => {
      setBlocks((b) => (b.length ? [makeBlock(b[0].height + 1), ...b.slice(0, 4)] : b));
    }, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border border-border/70 bg-card/30 p-6 scanline">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            live · regtest visualization
          </div>
          <h3 className="font-display text-xl">A blockchain, em tempo real</h3>
        </div>
        <div className="font-mono text-[11px] text-signal pulse-dot">sincronizado</div>
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
