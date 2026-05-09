"use client";

import { useEffect, useRef, useState } from "react";

type Line = { kind: "in" | "out" | "info" | "err"; text: string };

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function parseCommand(raw: string): { command: string; params: unknown[] } {
  const parts = raw.trim().split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  const params: unknown[] = args.map((a) => {
    const n = Number(a);
    if (!isNaN(n) && a !== "") return n;
    if (a === "true") return true;
    if (a === "false") return false;
    return a;
  });

  return { command, params };
}

async function execRPC(
  cmd: string,
  wallet: string,
): Promise<{ lines: Line[]; newWallet?: string; unloadedWallet?: string }> {
  const c = cmd.trim();
  if (!c) return { lines: [] };
  if (c === "clear") return { lines: [{ kind: "info", text: "__CLEAR__" }] };
  if (c === "help") {
    const res = await fetch(`${API}/api/rpc/commands`);
    const data = (await res.json()) as { commands: string[] };
    return {
      lines: [
        { kind: "info", text: "comandos disponíveis (regtest):" },
        { kind: "info", text: "  " + data.commands.join(" · ") },
        { kind: "info", text: "" },
        { kind: "info", text: "uso: <command> [arg1] [arg2] ..." },
        { kind: "info", text: "ex:  generatetoaddress 10 bcrt1q..." },
      ],
    };
  }

  const { command, params } = parseCommand(c);
  const walletName = typeof params[0] === "string" ? params[0] : undefined;
  const walletContext = command === "unloadwallet" ? undefined : wallet;

  const res = await fetch(`${API}/api/rpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command, params, ...(walletContext ? { wallet: walletContext } : {}) }),
  });

  if (!res.ok) {
    const err = (await res.json()) as { error: string };
    return { lines: [{ kind: "err", text: err.error ?? `HTTP ${res.status}` }] };
  }

  const data = (await res.json()) as { result: unknown };
  const text =
    typeof data.result === "object" ? JSON.stringify(data.result, null, 2) : String(data.result);

  let newWallet: string | undefined;
  let unloadedWallet: string | undefined;

  if ((command === "loadwallet" || command === "createwallet") && walletName) {
    newWallet = walletName;
  } else if (command === "unloadwallet" && walletName) {
    unloadedWallet = walletName;
  }

  return { lines: [{ kind: "out", text }], newWallet, unloadedWallet };
}

const BASE_INTRO: Line[] = [
  { kind: "info", text: "bitcoin-cli regtest · conectado ao nó local" },
  { kind: "info", text: 'digite "help" para ver os comandos.' },
];

export function CoreTerminal({ paste }: { paste?: { cmd: string; seq: number } | null }) {
  const [lines, setLines] = useState<Line[]>(BASE_INTRO);
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${API}/api/wallets`)
      .then((r) => r.json())
      .then((d: { wallets: string[] }) => {
        const loaded = d.wallets;
        if (loaded.length === 0) return;
        if (loaded.length === 1) {
          setWallet(loaded[0]);
          setLines((l) => [...l, { kind: "info", text: `→ carteira ativa: ${loaded[0]}` }]);
        } else {
          setWallet(loaded[0]);
          setLines((l) => [
            ...l,
            {
              kind: "info",
              text: `wallets carregadas: ${loaded.join(", ")} — ativa: ${loaded[0]}`,
            },
            { kind: "info", text: 'use "loadwallet <nome>" para trocar.' },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!paste) return;
    setInput(paste.cmd);
    inputRef.current?.focus();
  }, [paste]);

  useEffect(() => {
    const el = document.getElementById("term-scroll");
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  async function submit() {
    if (!input.trim() || loading) return;
    const cmd = input;
    setLines((l) => [...l, { kind: "in", text: `${wallet ? `[${wallet}]` : ""}$ ${cmd}` }]);
    setHist((h) => [cmd, ...h]);
    setHi(-1);
    setInput("");
    setLoading(true);

    try {
      const { lines: out, newWallet, unloadedWallet } = await execRPC(cmd, wallet);
      if (out[0]?.text === "__CLEAR__") {
        setLines(BASE_INTRO);
      } else if (newWallet) {
        setWallet(newWallet);
        setLines((l) => [...l, ...out, { kind: "info", text: `→ carteira ativa: ${newWallet}` }]);
      } else if (unloadedWallet) {
        if (unloadedWallet === wallet) setWallet("");
        setLines((l) => [
          ...l,
          ...out,
          {
            kind: "info",
            text:
              unloadedWallet === wallet
                ? `→ wallet "${unloadedWallet}" descarregada · nenhuma carteira ativa`
                : `→ wallet "${unloadedWallet}" descarregada`,
          },
        ]);
      } else {
        setLines((l) => [...l, ...out]);
      }
    } catch (err) {
      setLines((l) => [...l, { kind: "err", text: String(err) }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-border/70 bg-background/80 font-mono text-xs sm:text-sm">
      <div className="border-b border-border/60 px-3 py-2 flex flex-col gap-2 text-[11px] text-muted-foreground sm:px-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-destructive/70" />
          <span className="h-2 w-2 rounded-full bg-bitcoin/70" />
          <span className="h-2 w-2 rounded-full bg-signal/70" />
          <span className="ml-3">~/bitcoin-core/regtest</span>
        </div>
        <div className="flex items-center gap-3">
          {wallet && <span className="text-bitcoin">wallet: {wallet}</span>}
          <span className="pulse-dot">node online</span>
        </div>
      </div>

      <div id="term-scroll" className="p-3 h-[320px] overflow-auto space-y-1 sm:p-4 sm:h-[420px]">
        {lines.map((l, i) => (
          <pre
            key={i}
            className={`whitespace-pre-wrap wrap-break-word xl:whitespace-pre xl:break-normal ${
              l.kind === "in"
                ? "text-bitcoin"
                : l.kind === "err"
                  ? "text-destructive"
                  : l.kind === "info"
                    ? "text-muted-foreground"
                    : "text-foreground"
            }`}
          >
            {l.text}
          </pre>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="border-t border-border/60 px-4 py-2 flex items-center gap-2"
      >
        <span className={`text-bitcoin ${loading ? "animate-pulse" : ""}`}>
          {wallet ? `[${wallet}]$` : "$"}
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              const n = Math.min(hi + 1, hist.length - 1);
              setHi(n);
              setInput(hist[n] || "");
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const n = Math.max(hi - 1, -1);
              setHi(n);
              setInput(n === -1 ? "" : hist[n]);
            }
          }}
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground/50 disabled:opacity-50"
          placeholder='tente "getblockcount" ou "loadwallet alice"'
          autoFocus
        />
      </form>
    </div>
  );
}
