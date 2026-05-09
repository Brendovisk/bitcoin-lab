"use client";

import { useState } from "react";

const CHALLENGES = [
  {
    id: 1,
    title: "O hash mudou",
    brief: "Um bit foi alterado num bloco antigo. Por que a corrente inteira quebra?",
    level: "iniciante",
    q: "O que acontece com os hashes dos blocos seguintes?",
    options: ["nada", "todos mudam em cascata", "só o próximo muda"],
    answer: 1,
  },
  {
    id: 2,
    title: "UTXO perdido",
    brief: "Você gastou 0.5 BTC mas só 0.4 chegou ao destino. Onde foram os 0.1?",
    level: "iniciante",
    q: "Para onde foi o sat que faltou?",
    options: ["sumiu", "virou taxa de minerador", "ficou na carteira"],
    answer: 1,
  },
  {
    id: 3,
    title: "Endereço reutilizado",
    brief: "Por que profissionais nunca usam o mesmo endereço duas vezes?",
    level: "intermediário",
    q: "Qual o principal motivo?",
    options: ["é mais lento", "vaza privacidade ligando suas tx", "não tem motivo"],
    answer: 1,
  },
  {
    id: 4,
    title: "Quem confirma?",
    brief: "Você assinou uma transação. Ela está confirmada?",
    level: "iniciante",
    q: "Quando uma tx vira 'confirmada'?",
    options: ["ao assinar", "ao entrar na mempool", "ao entrar num bloco"],
    answer: 2,
  },
  {
    id: 5,
    title: "Taxa baixa demais",
    brief: "Sua tx está há 3 dias na mempool. Por quê?",
    level: "intermediário",
    q: "Qual a saída mais comum?",
    options: ["esperar ou usar RBF", "ligar pro suporte", "perdeu pra sempre"],
    answer: 0,
  },
  {
    id: 6,
    title: "Decifre o script",
    brief: "OP_DUP OP_HASH160 <pkh> OP_EQUALVERIFY OP_CHECKSIG",
    level: "avançado",
    q: "Que tipo de script é esse?",
    options: ["P2WPKH", "P2PKH (legacy)", "P2SH"],
    answer: 1,
  },
  {
    id: 7,
    title: "Seed comprometida",
    brief: "Você desconfia que viu sua seed. Próximo passo?",
    level: "iniciante",
    q: "O que fazer agora?",
    options: ["mudar senha do email", "criar nova seed e mover fundos", "esperar"],
    answer: 1,
  },
  {
    id: 8,
    title: "Mainnet ou regtest?",
    brief: "Você quer testar uma tx sem perder dinheiro real.",
    level: "iniciante",
    q: "Qual rede usar?",
    options: ["mainnet com pouco sat", "regtest ou signet", "tanto faz"],
    answer: 1,
  },
  {
    id: 9,
    title: "51% do quê?",
    brief: "Atacante teria 51% de quê para reescrever o histórico?",
    level: "avançado",
    q: "51% de…",
    options: ["dos nós", "do hashrate", "das moedas"],
    answer: 1,
  },
];

export function ChallengesGrid() {
  const [open, setOpen] = useState<number | null>(null);
  const [solved, setSolved] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {CHALLENGES.map((c) => {
        const isOpen = open === c.id;
        const isSolved = solved.includes(c.id);
        return (
          <div
            key={c.id}
            className={`border ${isSolved ? "border-signal/60" : "border-border/70"} bg-card/30 p-5 transition-all ${isOpen ? "sm:col-span-2 xl:col-span-3 shadow-deep" : "hover:border-bitcoin/50"}`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
                DESAFIO {String(c.id).padStart(2, "0")}
              </span>
              <span
                className={`font-mono text-[9px] uppercase tracking-widest border px-2 py-0.5 ${isSolved ? "border-signal text-signal" : "border-border text-muted-foreground"}`}
              >
                {isSolved ? "resolvido" : c.level}
              </span>
            </div>
            <h3 className="font-display text-xl mb-2">{c.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.brief}</p>

            {!isOpen ? (
              <button
                onClick={() => {
                  setOpen(c.id);
                  setPicked(null);
                }}
                className="mt-4 font-mono text-xs uppercase tracking-widest text-bitcoin hover:text-bitcoin-glow"
              >
                aceitar →
              </button>
            ) : (
              <div className="mt-5 pt-4 border-t border-border/50 animate-fade-up">
                <div className="font-mono text-[11px] text-muted-foreground mb-3">{c.q}</div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {c.options.map((o, i) => {
                    const correct = picked !== null && i === c.answer;
                    const wrong = picked === i && i !== c.answer;
                    return (
                      <button
                        key={i}
                        disabled={picked !== null}
                        onClick={() => {
                          setPicked(i);
                          if (i === c.answer) setSolved((s) => [...new Set([...s, c.id])]);
                        }}
                        className={`p-3 border text-left text-sm transition-colors
                          ${correct ? "border-signal text-signal-glow" : wrong ? "border-destructive text-destructive" : "border-border hover:border-bitcoin/50"}`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setOpen(null)}
                  className="mt-4 font-mono text-[11px] text-muted-foreground hover:text-foreground"
                >
                  fechar
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
