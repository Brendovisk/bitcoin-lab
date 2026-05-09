"use client";

import { useEffect, useState } from "react";

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

async function execRPC(cmd: string): Promise<Line[]> {
  const c = cmd.trim();
  if (!c) return [];
  if (c === "clear") return [{ kind: "info", text: "__CLEAR__" }];
  if (c === "help") {
    const res = await fetch(`${API}/api/rpc/commands`);
    const data = (await res.json()) as { commands: string[] };
    return [
      { kind: "info", text: "comandos disponíveis (regtest):" },
      { kind: "info", text: "  " + data.commands.join(" · ") },
      { kind: "info", text: "" },
      { kind: "info", text: "uso: <command> [arg1] [arg2] ..." },
      { kind: "info", text: "ex:  generatetoaddress 10 bcrt1q..." },
    ];
  }

  const { command, params } = parseCommand(c);
  const res = await fetch(`${API}/api/rpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command, params }),
  });

  if (!res.ok) {
    const err = (await res.json()) as { error: string };
    return [{ kind: "err", text: err.error ?? `HTTP ${res.status}` }];
  }

  const data = (await res.json()) as { result: unknown };
  const text =
    typeof data.result === "object"
      ? JSON.stringify(data.result, null, 2)
      : String(data.result);
  return [{ kind: "out", text }];
}

const INTRO: Line[] = [
  { kind: "info", text: "bitcoin-cli regtest · conectado ao nó local" },
  { kind: "info", text: 'digite "help" para ver os comandos.' },
];

export function CoreTerminal() {
  const [lines, setLines] = useState<Line[]>(INTRO);
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const el = document.getElementById("term-scroll");
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  async function submit() {
    if (!input.trim() || loading) return;
    const cmd = input;
    setLines((l) => [...l, { kind: "in", text: `$ ${cmd}` }]);
    setHist((h) => [cmd, ...h]);
    setHi(-1);
    setInput("");
    setLoading(true);

    try {
      const out = await execRPC(cmd);
      if (out[0]?.text === "__CLEAR__") setLines(INTRO);
      else setLines((l) => [...l, ...out]);
    } catch (err) {
      setLines((l) => [...l, { kind: "err", text: String(err) }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-border/70 bg-background/80 font-mono text-sm">
      <div className="border-b border-border/60 px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-destructive/70" />
          <span className="h-2 w-2 rounded-full bg-bitcoin/70" />
          <span className="h-2 w-2 rounded-full bg-signal/70" />
          <span className="ml-3">~/bitcoin-core/regtest</span>
        </div>
        <span className="pulse-dot">node online</span>
      </div>
      <div id="term-scroll" className="p-4 h-[420px] overflow-auto space-y-1">
        {lines.map((l, i) => (
          <pre
            key={i}
            className={
              l.kind === "in"
                ? "text-bitcoin"
                : l.kind === "err"
                  ? "text-destructive"
                  : l.kind === "info"
                    ? "text-muted-foreground"
                    : "text-foreground"
            }
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
        <span className={`text-bitcoin ${loading ? "animate-pulse" : ""}`}>$</span>
        <input
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
          placeholder='tente "getblockcount" ou "generatetoaddress 3 bcrt1q..."'
          autoFocus
        />
      </form>
    </div>
  );
}
