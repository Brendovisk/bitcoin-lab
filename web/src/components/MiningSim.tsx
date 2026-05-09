"use client";

import { useEffect, useRef, useState } from "react";

const HEX = "0123456789abcdef";
const rand = (n: number) =>
  Array.from({ length: n }, () => HEX[Math.floor(Math.random() * 16)]).join("");

export function MiningSim() {
  const [difficulty, setDifficulty] = useState(3); // leading zeros
  const [running, setRunning] = useState(false);
  const [nonce, setNonce] = useState(0);
  const [hash, setHash] = useState("—");
  const [found, setFound] = useState<{ nonce: number; hash: string; took: number } | null>(null);
  const startRef = useRef(0);
  const timer = useRef<number | null>(null);

  const target = "0".repeat(difficulty);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();
    setFound(null);
    setNonce(0);

    const tick = () => {
      let n = 0;
      let h = "";
      // burst of attempts per frame
      for (let i = 0; i < 250; i++) {
        n = Math.floor(Math.random() * 1e9);
        h = rand(64);
        if (h.startsWith(target)) {
          setNonce(n);
          setHash(h);
          setFound({ nonce: n, hash: h, took: performance.now() - startRef.current });
          setRunning(false);
          return;
        }
      }
      setNonce(n);
      setHash(h);
      timer.current = requestAnimationFrame(tick);
    };
    timer.current = requestAnimationFrame(tick);
    return () => {
      if (timer.current) cancelAnimationFrame(timer.current);
    };
  }, [running, target]);

  return (
    <div className="border border-border/70 bg-card/30 p-6 space-y-6">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            prova de trabalho
          </div>
          <h3 className="font-display text-2xl">
            Encontrar um hash que começa com <span className="text-bitcoin">{difficulty}</span>{" "}
            zero(s)
          </h3>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-muted-foreground">dificuldade</span>
          <input
            type="range"
            min={1}
            max={6}
            value={difficulty}
            disabled={running}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            className="accent-bitcoin"
          />
          <span className="text-bitcoin w-4">{difficulty}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 font-mono text-xs">
        <Stat label="nonce" value={nonce.toLocaleString()} />
        <Stat label="target" value={`${target}…`} highlight />
      </div>

      <div className="border border-border/60 p-4 bg-background/60">
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
          candidato
        </div>
        <div className="font-mono text-sm break-all">
          <span className={hash.startsWith(target) ? "text-signal-glow" : "text-bitcoin"}>
            {hash.slice(0, difficulty)}
          </span>
          <span className="text-muted-foreground">{hash.slice(difficulty)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          className={`px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors ${running ? "bg-destructive text-destructive-foreground" : "bg-bitcoin text-primary-foreground hover:bg-bitcoin-glow"}`}
        >
          {running ? "parar" : "minerar bloco"}
        </button>
        {found && (
          <div className="font-mono text-xs text-signal-glow animate-fade-up">
            ✓ bloco encontrado em {(found.took / 1000).toFixed(2)}s · nonce {found.nonce}
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Mineradores chutam números (<span className="text-bitcoin">nonce</span>) até achar um hash
        com zeros suficientes na frente. Quanto mais zeros o protocolo exige, mais raro é o hash — e
        mais energia custa achar um.
      </p>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="border border-border/60 bg-background/60 p-3">
      <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{label}</div>
      <div className={`mt-1 ${highlight ? "text-bitcoin" : ""}`}>{value}</div>
    </div>
  );
}
