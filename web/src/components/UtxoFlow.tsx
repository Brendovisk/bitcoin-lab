"use client";

import { useEffect, useMemo, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type ApiUtxo = {
  txid: string;
  vout: number;
  address: string;
  amount: number;
  sats: number;
  confirmations: number;
};

function utxoKey(u: ApiUtxo) {
  return `${u.txid}:${u.vout}`;
}

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

export function UtxoFlow() {
  const [wallets, setWallets] = useState<string[]>([]);
  const [wallet, setWallet] = useState("");
  const [utxos, setUtxos] = useState<ApiUtxo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [target, setTarget] = useState(80_000);
  const [history, setHistory] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

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
    setSelected([]);
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

  const totalIn = useMemo(
    () => utxos.filter((u) => selected.includes(utxoKey(u))).reduce((s, u) => s + u.sats, 0),
    [selected, utxos],
  );
  const maxSats = utxos.length > 0 ? Math.max(...utxos.map((u) => u.sats)) : 1;
  const valid = totalIn >= target && target > 0 && !sending;

  function toggle(key: string) {
    setSelected((s) => (s.includes(key) ? s.filter((x) => x !== key) : [...s, key]));
  }

  async function spend() {
    if (!valid || !wallet) return;
    setSending(true);
    setError("");
    try {
      const addrRes = await fetch(`${API}/api/wallets/${encodeURIComponent(wallet)}/address`);
      const { address } = (await addrRes.json()) as { address: string };

      const sendRes = await fetch(`${API}/api/wallets/${encodeURIComponent(wallet)}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, amount: target / 1e8 }),
      });
      const data = (await sendRes.json()) as { txid?: string; error?: string };
      if (!sendRes.ok || !data.txid) throw new Error(data.error ?? "Erro ao enviar");

      setHistory((h) =>
        [
          `gastou ${selected.length} utxo(s) → ${target.toLocaleString()} sat · tx: ${data.txid!.slice(0, 16)}…`,
          ...h,
        ].slice(0, 5),
      );
      setSelected([]);
      refreshUtxos();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setSending(false);
    }
  }

  return (
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
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="border border-border/70 bg-card/30 p-4 sm:p-6 xl:col-span-8">
          <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                sua carteira · regtest
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

          {loading && (
            <div className="font-mono text-xs text-muted-foreground/60">carregando utxos…</div>
          )}
          {!loading && utxos.length === 0 && (
            <div className="font-mono text-xs text-muted-foreground/60">
              nenhum utxo — aguardando seed da API ou reinicie o servidor
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {utxos.map((u) => {
              const key = utxoKey(u);
              const sel = selected.includes(key);
              const ratio = Math.sqrt(u.sats) / Math.sqrt(maxSats);
              const size = Math.round(70 + ratio * 100);
              return (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  style={{ width: size, height: size }}
                  className={`relative border transition-all animate-fade-up flex flex-col items-center justify-center
                    ${sel ? "border-bitcoin bg-bitcoin/15 shadow-glow" : "border-border bg-background/60 hover:border-bitcoin/50"}`}
                >
                  <div className="font-mono text-[10px] text-muted-foreground">utxo</div>
                  <div className="font-display text-lg text-bitcoin">
                    {(u.sats / 1e8).toFixed(4)}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    {u.sats.toLocaleString()} sat
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground/60 mt-1">
                    #{u.txid.slice(0, 6)}…
                  </div>
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

        <aside className="border border-border/70 bg-card/30 p-4 space-y-5 sm:p-6 xl:col-span-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              construir transação
            </div>
            <h3 className="font-display text-xl">Quebrar moedas</h3>
          </div>

          <Field label="enviar (sats)" value={target} onChange={setTarget} />

          <div className="border border-border/60 p-3 font-mono text-[11px] space-y-1.5">
            <Row k="inputs" v={`${selected.length} utxo(s)`} />
            <Row k="total in" v={totalIn.toLocaleString()} />
            <Row k="enviar" v={target.toLocaleString()} />
            <div className="border-t border-border/40 my-2" />
            <Row
              k="troco estimado"
              v={Math.max(totalIn - target, 0).toLocaleString()}
              highlight={totalIn > target}
            />
          </div>

          {error && <div className="font-mono text-xs text-red-400">{error}</div>}

          <button
            disabled={!valid}
            onClick={spend}
            className={`w-full py-3 font-mono text-xs uppercase tracking-widest transition-colors
              ${valid ? "bg-bitcoin text-primary-foreground hover:bg-bitcoin-glow" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
          >
            {sending ? "enviando…" : valid ? "broadcast tx →" : "selecione mais utxos"}
          </button>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Você não "tira sats" de uma carteira. Você pega pedaços inteiros, gasta tudo, e o que
            sobra volta como <span className="text-bitcoin">troco</span>.
          </p>
        </aside>
      </div>
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
