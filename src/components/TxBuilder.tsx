import { useMemo, useState } from "react";

type Step = "select" | "sign" | "broadcast" | "done";

const HEX = "0123456789abcdef";
const rndHex = (n: number) => Array.from({ length: n }, () => HEX[Math.floor(Math.random() * 16)]).join("");

const POOL = [
  { id: rndHex(8), sats: 50_000 },
  { id: rndHex(8), sats: 220_000 },
  { id: rndHex(8), sats: 130_000 },
];

export function TxBuilder() {
  const [picked, setPicked] = useState<string[]>([]);
  const [dest, setDest] = useState("bc1qcaveman000000000000000000000000lab");
  const [amount, setAmount] = useState(180_000);
  const [feeRate, setFeeRate] = useState(12);
  const [step, setStep] = useState<Step>("select");
  const [txid, setTxid] = useState("");

  const inputs = useMemo(() => POOL.filter((u) => picked.includes(u.id)), [picked]);
  const totalIn = inputs.reduce((s, u) => s + u.sats, 0);
  const vsize = 110 + inputs.length * 68 + 31 * 2;
  const fee = vsize * feeRate;
  const change = totalIn - amount - fee;
  const valid = totalIn >= amount + fee && amount > 0;

  function reset() { setPicked([]); setStep("select"); setTxid(""); }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-7 space-y-4">
        <Card title="01 · escolha os inputs" desc="Quais pedaços você quer gastar?">
          <div className="grid grid-cols-3 gap-2">
            {POOL.map((u) => {
              const sel = picked.includes(u.id);
              return (
                <button key={u.id} onClick={() => setPicked((p) => sel ? p.filter((x) => x !== u.id) : [...p, u.id])}
                  className={`p-3 border text-left transition-colors ${sel ? "border-bitcoin bg-bitcoin/10" : "border-border hover:border-bitcoin/40"}`}>
                  <div className="font-mono text-[10px] text-muted-foreground">utxo</div>
                  <div className="font-display text-bitcoin text-lg">{(u.sats / 1e8).toFixed(4)}</div>
                  <div className="font-mono text-[10px] text-muted-foreground/70">#{u.id}</div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card title="02 · destino e valor" desc="Para onde os sats vão?">
          <label className="block mb-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">endereço</div>
            <input value={dest} onChange={(e) => setDest(e.target.value)} className="w-full bg-background border border-border px-3 py-2 font-mono text-xs focus:outline-none focus:border-bitcoin" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">valor (sats)</div>
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-background border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-bitcoin" />
            </label>
            <label>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">fee rate (sat/vB)</div>
              <input type="number" value={feeRate} onChange={(e) => setFeeRate(Number(e.target.value))} className="w-full bg-background border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-bitcoin" />
            </label>
          </div>
        </Card>

        <Card title="03 · revisar e assinar">
          <div className="font-mono text-xs space-y-1.5">
            <Row k="inputs" v={`${inputs.length} · ${totalIn.toLocaleString()} sat`} />
            <Row k="output destino" v={`${amount.toLocaleString()} sat`} />
            <Row k="output troco" v={`${Math.max(change, 0).toLocaleString()} sat`} />
            <Row k="vsize estimado" v={`${vsize} vB`} />
            <Row k="taxa total" v={`${fee.toLocaleString()} sat`} highlight />
          </div>
          <div className="mt-4 flex gap-2">
            <button disabled={!valid || step === "done"} onClick={() => { setStep("sign"); setTimeout(() => { setTxid(rndHex(64)); setStep("done"); }, 1100); }}
              className={`px-5 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors ${valid && step !== "done" ? "bg-bitcoin text-primary-foreground hover:bg-bitcoin-glow" : "bg-muted text-muted-foreground"}`}>
              {step === "sign" ? "assinando…" : step === "done" ? "transmitida ✓" : "assinar e transmitir"}
            </button>
            {step === "done" && <button onClick={reset} className="px-5 py-2.5 font-mono text-xs uppercase tracking-widest border border-border hover:border-foreground/40">nova tx</button>}
          </div>
        </Card>
      </div>

      <aside className="col-span-5 border border-border/70 bg-background/80 p-6 font-mono text-xs">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">// raw transaction (preview)</div>
        <pre className="text-bitcoin/90 leading-relaxed whitespace-pre-wrap break-all">
{`{
  "version": 2,
  "inputs": [${inputs.map((i) => `\n    { "txid": "${i.id}…", "value": ${i.sats} }`).join(",")}
  ],
  "outputs": [
    { "to": "${dest.slice(0, 32)}…", "value": ${amount} }${change > 0 ? `,
    { "to": "<change>", "value": ${change} }` : ""}
  ],
  "fee": ${fee},
  "vsize": ${vsize}${txid ? `,
  "txid": "${txid}"` : ""}
}`}
        </pre>
        {step === "done" && (
          <div className="mt-4 pt-4 border-t border-border/40 text-signal-glow animate-fade-up">
            ✓ broadcast em regtest · aguardando inclusão em bloco
          </div>
        )}
      </aside>
    </div>
  );
}

function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="border border-border/70 bg-card/30 p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest text-bitcoin mb-1">{title}</div>
      {desc && <div className="text-sm text-muted-foreground mb-4">{desc}</div>}
      {children}
    </div>
  );
}
function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between border-b border-border/40 py-1">
      <span className="text-muted-foreground">{k}</span>
      <span className={highlight ? "text-bitcoin" : ""}>{v}</span>
    </div>
  );
}
