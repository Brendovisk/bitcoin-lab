"use client";

import { useEffect, useRef, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const HEX = "0123456789abcdef";
const rand = (n: number) =>
  Array.from({ length: n }, () => HEX[Math.floor(Math.random() * 16)]).join("");

export function MiningSim() {
  const [difficulty, setDifficulty] = useState(3);
  const [running, setRunning] = useState(false);
  const [nonce, setNonce] = useState(0);
  const [hash, setHash] = useState("—");
  const [found, setFound] = useState<{ nonce: number; hash: string; took: number } | null>(null);
  const startRef = useRef(0);
  const timer = useRef<number | null>(null);

  // Real regtest mining
  const [mining, setMining] = useState(false);
  const [toast, setToast] = useState(false);
  const [mineError, setMineError] = useState("");

  const target = "0".repeat(difficulty);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();
    setFound(null);
    setNonce(0);

    const tick = () => {
      let n = 0;
      let h = "";
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

  async function mineReal() {
    setMining(true);
    setMineError("");
    try {
      const walletsRes = await fetch(`${API}/api/wallets`);
      const { wallets } = (await walletsRes.json()) as { wallets: string[] };
      const wallet = wallets[0];
      if (!wallet) throw new Error("Nenhuma wallet carregada");

      const res = await fetch(`${API}/api/wallets/${encodeURIComponent(wallet)}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks: 1 }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error: string };
        throw new Error(err.error ?? "Erro ao minerar");
      }
      setToast(true);
      setTimeout(() => setToast(false), 7000);
    } catch (e) {
      setMineError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setMining(false);
    }
  }

  return (
    <>
      {toast && (
        <div className="fixed top-5 right-5 z-50 border border-bitcoin/60 bg-background/95 backdrop-blur-sm p-4 shadow-lg font-mono text-xs max-w-xs animate-fade-up">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-bitcoin uppercase tracking-widest text-[10px] mb-1">bloco minerado</div>
              <div className="text-foreground leading-relaxed">
                1 bloco minerado na regtest. Todas as transações pendentes foram confirmadas — mempool zerada.
              </div>
            </div>
            <button
              onClick={() => setToast(false)}
              className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

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

      {/* Real regtest mining */}
      <div className="border border-border/70 bg-card/30 p-6 mt-6 flex items-center justify-between gap-6 flex-wrap">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            regtest
          </div>
          <div className="font-display text-xl">Minerar um bloco real</div>
          <p className="text-sm text-muted-foreground mt-1">
            Confirma todas as transações pendentes na mempool local e avança a chain.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={mineReal}
            disabled={mining}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors ${mining ? "bg-muted text-muted-foreground" : "bg-bitcoin text-primary-foreground hover:bg-bitcoin-glow"}`}
          >
            {mining ? "minerando…" : "minerar 1 bloco →"}
          </button>
          {mineError && (
            <div className="font-mono text-xs text-destructive">{mineError}</div>
          )}
        </div>
      </div>
    </>
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
