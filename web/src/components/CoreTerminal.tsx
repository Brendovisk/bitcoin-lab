"use client";

import { useEffect, useState } from "react";

type Line = { kind: "in" | "out" | "info" | "err"; text: string };

const HEX = "0123456789abcdef";
const rand = (n: number) =>
  Array.from({ length: n }, () => HEX[Math.floor(Math.random() * 16)]).join("");

function exec(cmd: string): Line[] {
  const c = cmd.trim();
  if (!c) return [];
  if (c === "help") {
    return [
      { kind: "info", text: "comandos disponíveis:" },
      { kind: "info", text: "  getblockchaininfo · getblockcount · getrawmempool" },
      { kind: "info", text: "  getnewaddress · generatetoaddress N <addr>" },
      { kind: "info", text: "  sendtoaddress <addr> <btc> · getbalance · clear" },
    ];
  }
  if (c === "clear") return [{ kind: "info", text: "__CLEAR__" }];
  if (c === "getblockcount")
    return [{ kind: "out", text: String(840219 + Math.floor(Math.random() * 8)) }];
  if (c === "getbalance") return [{ kind: "out", text: (Math.random() * 4 + 0.1).toFixed(8) }];
  if (c === "getnewaddress") return [{ kind: "out", text: `bcrt1q${rand(38)}` }];
  if (c.startsWith("generatetoaddress")) {
    const n = Number(c.split(/\s+/)[1] || 1);
    return [
      {
        kind: "out",
        text: `[ ${Array.from({ length: Math.min(n, 5) }, () => `"${rand(64)}"`).join(", ")}${n > 5 ? ", …" : ""} ]`,
      },
    ];
  }
  if (c === "getrawmempool") {
    return [
      { kind: "out", text: `[ ${Array.from({ length: 4 }, () => `"${rand(64)}"`).join(", ")} ]` },
    ];
  }
  if (c === "getblockchaininfo") {
    return [
      {
        kind: "out",
        text: `{
  "chain": "regtest",
  "blocks": ${840219 + Math.floor(Math.random() * 8)},
  "headers": ${840219 + Math.floor(Math.random() * 8)},
  "difficulty": 0.000244,
  "verificationprogress": 1,
  "pruned": false
}`,
      },
    ];
  }
  if (c.startsWith("sendtoaddress")) {
    return [{ kind: "out", text: rand(64) }];
  }
  return [{ kind: "err", text: `comando desconhecido: "${c}". digite "help".` }];
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

  useEffect(() => {
    const el = document.getElementById("term-scroll");
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function submit() {
    if (!input.trim()) return;
    const out = exec(input);
    if (out[0]?.text === "__CLEAR__") setLines(INTRO);
    else setLines((l) => [...l, { kind: "in", text: `$ ${input}` }, ...out]);
    setHist((h) => [input, ...h]);
    setHi(-1);
    setInput("");
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
          submit();
        }}
        className="border-t border-border/60 px-4 py-2 flex items-center gap-2"
      >
        <span className="text-bitcoin">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground/50"
          placeholder='tente "getblockcount" ou "generatetoaddress 3 bcrt1q..."'
          autoFocus
        />
      </form>
    </div>
  );
}
