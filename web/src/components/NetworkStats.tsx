"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type Stats = { hashrate: string; difficulty: string; halvingDays: number };

const FALLBACK: Stats = { hashrate: "—", difficulty: "—", halvingDays: 0 };

export function NetworkStats() {
  const [stats, setStats] = useState<Stats>(FALLBACK);

  useEffect(() => {
    fetch(`${API}/api/blocks/stats`)
      .then((r) => r.json())
      .then((d: Stats) => setStats(d))
      .catch(() => {});
  }, []);

  return (
    <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-[11px]">
      <Stat label="hashrate" value={stats.hashrate} />
      <Stat label="dificuldade" value={stats.difficulty} />
      <Stat label="próximo halving" value={stats.halvingDays > 0 ? `${stats.halvingDays}d` : "—"} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/70 bg-card/40 p-3">
      <div className="text-muted-foreground uppercase tracking-widest text-[9px]">{label}</div>
      <div className="text-bitcoin mt-1">{value}</div>
    </div>
  );
}
