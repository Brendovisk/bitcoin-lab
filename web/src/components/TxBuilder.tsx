"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function AddressChip({ wallet }: { wallet: string }) {
  const [address, setAddress] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!wallet) return;
    fetch(`${API}/api/wallets/${encodeURIComponent(wallet)}/address`)
      .then((r) => r.json())
      .then((d: { address: string }) => setAddress(d.address))
      .catch(() => {});
  }, [wallet]);

  function copy() {
    if (!address) return;
    void navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!address) return null;

  return (
    <button
      onClick={copy}
      title="clique para copiar endereço"
      className="flex max-w-full items-center gap-2 border border-border/60 bg-card/30 px-3 py-2 hover:border-bitcoin/50 transition-colors group"
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        endereço
      </span>
      <span className="font-mono text-xs text-bitcoin truncate max-w-[150px] sm:max-w-[260px]">{address}</span>
      <span className="font-mono text-[10px] text-muted-foreground group-hover:text-bitcoin transition-colors">
        {copied ? "copiado ✓" : "copiar"}
      </span>
    </button>
  );
}

type ApiUtxo = {
  txid: string;
  vout: number;
  address: string;
  amount: number;
  sats: number;
  confirmations: number;
};

type Step = "select" | "sign" | "done";

function utxoKey(u: ApiUtxo) {
  return `${u.txid}:${u.vout}`;
}

export function TxBuilder() {
  const [wallets, setWallets] = useState<string[]>([]);
  const [wallet, setWallet] = useState("");
  const [utxos, setUtxos] = useState<ApiUtxo[]>([]);
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [dest, setDest] = useState("");
  const [amount, setAmount] = useState(0);
  const [feeRate, setFeeRate] = useState(12);
  const [step, setStep] = useState<Step>("select");
  const [txid, setTxid] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/wallets`)
      .then((r) => r.json())
      .then((d: { wallets: string[] }) => {
        setWallets(d.wallets);
        if (d.wallets.length > 0) setWallet(d.wallets[0]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!wallet) return;
    setLoading(true);
    setPicked([]);
    fetch(`${API}/api/wallets/${encodeURIComponent(wallet)}/utxos`)
      .then((r) => r.json())
      .then((d: { utxos: ApiUtxo[] }) => setUtxos(d.utxos))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [wallet]);

  function refreshUtxos() {
    if (!wallet) return;
    fetch(`${API}/api/wallets/${encodeURIComponent(wallet)}/utxos`)
      .then((r) => r.json())
      .then((d: { utxos: ApiUtxo[] }) => setUtxos(d.utxos))
      .catch(() => {});
  }

  const inputs = useMemo(
    () => utxos.filter((u) => picked.includes(utxoKey(u))),
    [picked, utxos],
  );
  const totalIn = inputs.reduce((s, u) => s + u.sats, 0);
  const vsize = 110 + inputs.length * 68 + 31 * 2;
  const estimatedFee = vsize * feeRate;
  const change = totalIn - amount - estimatedFee;
  const valid = amount > 0 && dest.length > 10 && step === "select";

  function reset() {
    setPicked([]);
    setStep("select");
    setTxid("");
    setError("");
    refreshUtxos();
  }

  async function broadcast() {
    if (!valid) return;
    setStep("sign");
    setError("");
    try {
      const res = await fetch(`${API}/api/wallets/${encodeURIComponent(wallet)}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: dest, amount: amount / 1e8 }),
      });
      const data = (await res.json()) as { txid?: string; error?: string };
      if (!res.ok || !data.txid) throw new Error(data.error ?? "Erro ao transmitir");
      setTxid(data.txid);
      setStep("done");
      setToast(true);
      setTimeout(() => setToast(false), 7000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
      setStep("select");
    }
  }

  return (
    <>
    {toast && (
      <div className="fixed left-4 right-4 top-4 z-50 border border-bitcoin/60 bg-background/95 backdrop-blur-sm p-4 shadow-lg font-mono text-xs animate-fade-up sm:left-auto sm:right-5 sm:top-5 sm:max-w-xs">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="text-bitcoin uppercase tracking-widest text-[10px] mb-1">tx na mempool</div>
            <div className="text-foreground leading-relaxed">
              Transação transmitida. Aguardando ser incluída em um bloco.
            </div>
          </div>
          <button
            onClick={() => setToast(false)}
            className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0"
          >
            ✕
          </button>
        </div>
        <Link
          href="/lab/mempool"
          onClick={() => setToast(false)}
          className="block w-full text-center py-2 border border-bitcoin/50 text-bitcoin hover:bg-bitcoin/10 transition-colors uppercase tracking-widest text-[10px]"
        >
          ver mempool →
        </Link>
      </div>
    )}
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          wallet
        </div>
        <select
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          className="bg-background border border-border px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-bitcoin"
        >
          {wallets.length === 0 && <option value="">nenhuma wallet</option>}
          {wallets.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
        {wallet && <AddressChip wallet={wallet} />}
        {wallet && (
          <span className="font-mono text-[10px] text-muted-foreground">
            {utxos.length} utxos · {utxos.reduce((s, u) => s + u.sats, 0).toLocaleString()} sats
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-7">
          <Card title="01 · escolha os inputs" desc="Quais pedaços você quer gastar?">
            {loading && (
              <div className="font-mono text-xs text-muted-foreground/60">carregando utxos…</div>
            )}
            {!loading && utxos.length === 0 && (
              <div className="font-mono text-xs text-muted-foreground/60">
                nenhum utxo — aguardando seed da API ou reinicie o servidor
              </div>
            )}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {utxos.map((u) => {
                const key = utxoKey(u);
                const sel = picked.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() =>
                      setPicked((p) => (sel ? p.filter((x) => x !== key) : [...p, key]))
                    }
                    className={`p-3 border text-left transition-colors ${sel ? "border-bitcoin bg-bitcoin/10" : "border-border hover:border-bitcoin/40"}`}
                  >
                    <div className="font-mono text-[10px] text-muted-foreground">
                      utxo · {u.confirmations}conf
                    </div>
                    <div className="font-display text-bitcoin text-lg">
                      {(u.sats / 1e8).toFixed(4)}
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground/70">
                      #{u.txid.slice(0, 8)}…
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card title="02 · destino e valor" desc="Para onde os sats vão?">
            <label className="block mb-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                endereço
              </div>
              <input
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                placeholder="bcrt1q…"
                className="w-full bg-background border border-border px-3 py-2 font-mono text-xs focus:outline-none focus:border-bitcoin"
              />
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                  valor (sats)
                </div>
                <input
                  type="number"
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-background border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-bitcoin"
                />
              </label>
              <label>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                  fee rate (sat/vB)
                </div>
                <input
                  type="number"
                  value={feeRate}
                  onChange={(e) => setFeeRate(Number(e.target.value))}
                  className="w-full bg-background border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-bitcoin"
                />
              </label>
            </div>
          </Card>

          <Card title="03 · revisar e assinar">
            <div className="font-mono text-xs space-y-1.5">
              <Row k="inputs selecionados" v={`${inputs.length} · ${totalIn.toLocaleString()} sat`} />
              <Row k="output destino" v={`${amount.toLocaleString()} sat`} />
              <Row k="output troco (estimado)" v={`${Math.max(change, 0).toLocaleString()} sat`} />
              <Row k="vsize estimado" v={`${vsize} vB`} />
              <Row k="taxa estimada" v={`${estimatedFee.toLocaleString()} sat`} highlight />
            </div>
            <div className="mt-2 font-mono text-[10px] text-muted-foreground/60">
              * Bitcoin Core seleciona os inputs e taxa finais automaticamente
            </div>
            {error && (
              <div className="mt-3 font-mono text-xs text-red-400">{error}</div>
            )}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                disabled={!valid}
                onClick={broadcast}
                className={`px-5 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors ${valid ? "bg-bitcoin text-primary-foreground hover:bg-bitcoin-glow" : "bg-muted text-muted-foreground"}`}
              >
                {step === "sign"
                  ? "assinando…"
                  : step === "done"
                    ? "transmitida ✓"
                    : "assinar e transmitir"}
              </button>
              {step === "done" && (
                <button
                  onClick={reset}
                  className="px-5 py-2.5 font-mono text-xs uppercase tracking-widest border border-border hover:border-foreground/40"
                >
                  nova tx
                </button>
              )}
            </div>
          </Card>
        </div>

        <aside className="border border-border/70 bg-background/80 p-4 font-mono text-[11px] sm:p-6 sm:text-xs xl:col-span-5">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
            // raw transaction (preview)
          </div>
          <pre className="text-bitcoin/90 leading-relaxed whitespace-pre-wrap break-all">
            {`{
  "version": 2,
  "inputs": [${inputs.map((i) => `\n    { "txid": "${i.txid.slice(0, 16)}…", "vout": ${i.vout}, "value": ${i.sats} }`).join(",")}
  ],
  "outputs": [
    { "to": "${dest ? dest.slice(0, 32) + "…" : "<endereço>"}", "value": ${amount} }${
      change > 0
        ? `,
    { "to": "<change>", "value": ${change} }`
        : ""
    }
  ],
  "fee_rate": ${feeRate} sat/vB,
  "vsize": ~${vsize} vB${
    txid
      ? `,
  "txid": "${txid}"`
      : ""
  }
}`}
          </pre>
          {step === "done" && (
            <div className="mt-4 pt-4 border-t border-border/40 text-signal-glow animate-fade-up">
              ✓ broadcast em regtest · aguardando inclusão em bloco
            </div>
          )}
        </aside>
      </div>
    </div>
    </>
  );
}

function Card({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border/70 bg-card/30 p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest text-bitcoin mb-1">
        {title}
      </div>
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
