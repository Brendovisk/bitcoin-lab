"use client";

import { useMemo, useState } from "react";

type Utxo = { id: string; sats: number };

const id = () => Math.random().toString(36).slice(2, 8);

const INITIAL: Utxo[] = [
  { id: "a91f", sats: 50_000 },
  { id: "b22e", sats: 120_000 },
  { id: "c041", sats: 30_000 },
  { id: "d7a0", sats: 200_000 },
];

export function UtxoFlow() {
  const [utxos, setUtxos] = useState<Utxo[]>(INITIAL);
  const [selected, setSelected] = useState<string[]>([]);
  const [target, setTarget] = useState(80_000);
  const [fee, setFee] = useState(2_000);
  const [history, setHistory] = useState<string[]>([]);

  const totalIn = useMemo(
    () => utxos.filter((u) => selected.includes(u.id)).reduce((s, u) => s + u.sats, 0),
    [selected, utxos],
  );
  const change = totalIn - target - fee;
  const valid = totalIn >= target + fee;

  function toggle(uid: string) {
    setSelected((s) => (s.includes(uid) ? s.filter((x) => x !== uid) : [...s, uid]));
  }

  function spend() {
    if (!valid) return;
    const remaining = utxos.filter((u) => !selected.includes(u.id));
    const out: Utxo[] = [{ id: id(), sats: target }];
    if (change > 0) out.push({ id: id(), sats: change });
    setUtxos([...remaining, ...out]);
    setHistory((h) =>
      [`gastou ${selected.length} utxo(s) → ${target} sat + troco ${change} sat`, ...h].slice(0, 5),
    );
    setSelected([]);
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 border border-border/70 bg-card/30 p-6">
        <div className="flex justify-between mb-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              sua carteira
            </div>
            <div className="font-display text-xl">Pedaços de moeda</div>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            {utxos.length} utxos ·{" "}
            <span className="text-bitcoin">
              {utxos.reduce((s, u) => s + u.sats, 0).toLocaleString()} sats
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {utxos.map((u) => {
            const sel = selected.includes(u.id);
            const size = Math.max(70, Math.min(170, 60 + u.sats / 2000));
            return (
              <button
                key={u.id}
                onClick={() => toggle(u.id)}
                style={{ width: size, height: size }}
                className={`relative border transition-all animate-fade-up flex flex-col items-center justify-center
                  ${sel ? "border-bitcoin bg-bitcoin/15 shadow-glow" : "border-border bg-background/60 hover:border-bitcoin/50"}`}
              >
                <div className="font-mono text-[10px] text-muted-foreground">utxo</div>
                <div className="font-display text-lg text-bitcoin">{(u.sats / 1e8).toFixed(4)}</div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  {u.sats.toLocaleString()} sat
                </div>
                <div className="font-mono text-[9px] text-muted-foreground/60 mt-1">#{u.id}</div>
              </button>
            );
          })}
        </div>

        {history.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border/40 font-mono text-[11px] text-muted-foreground space-y-1">
            <div className="text-muted-foreground/60 uppercase tracking-widest text-[9px] mb-2">
              // histórico
            </div>
            {history.map((h, i) => (
              <div key={i}>› {h}</div>
            ))}
          </div>
        )}
      </div>

      <aside className="col-span-4 border border-border/70 bg-card/30 p-6 space-y-5">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            construir transação
          </div>
          <h3 className="font-display text-xl">Quebrar moedas</h3>
        </div>

        <Field label="enviar (sats)" value={target} onChange={setTarget} />
        <Field label="taxa (sats)" value={fee} onChange={setFee} />

        <div className="border border-border/60 p-3 font-mono text-[11px] space-y-1.5">
          <Row k="inputs" v={`${selected.length} utxo(s)`} />
          <Row k="total in" v={`${totalIn.toLocaleString()}`} />
          <Row k="enviar" v={`${target.toLocaleString()}`} />
          <Row k="taxa" v={`${fee.toLocaleString()}`} />
          <div className="border-t border-border/40 my-2" />
          <Row k="troco" v={`${Math.max(change, 0).toLocaleString()}`} highlight={change > 0} />
        </div>

        <button
          disabled={!valid}
          onClick={spend}
          className={`w-full py-3 font-mono text-xs uppercase tracking-widest transition-colors
            ${valid ? "bg-bitcoin text-primary-foreground hover:bg-bitcoin-glow" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
        >
          {valid ? "broadcast tx →" : "selecione mais utxos"}
        </button>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Você não “tira sats” de uma carteira. Você pega pedaços inteiros, gasta tudo, e o que
          sobra volta como <span className="text-bitcoin">troco</span>.
        </p>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full bg-background border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-bitcoin"
      />
    </label>
  );
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className={highlight ? "text-bitcoin" : ""}>{v}</span>
    </div>
  );
}
