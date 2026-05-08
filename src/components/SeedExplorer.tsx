import { useState } from "react";

const WORDS = [
  "abandon","ability","able","about","above","absent","absorb","abstract","absurd","abuse",
  "access","accident","account","accuse","achieve","acid","acoustic","acquire","across","act",
  "action","actor","actress","actual","adapt","add","addict","address","adjust","admit",
  "adult","advance","advice","aerobic","affair","afford","afraid","again","age","agent",
  "agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert",
];

const HEX = "0123456789abcdef";

function gen12() {
  return Array.from({ length: 12 }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);
}
function rndHex(n: number) {
  return Array.from({ length: n }, () => HEX[Math.floor(Math.random() * 16)]).join("");
}

export function SeedExplorer() {
  const [words, setWords] = useState<string[] | null>(null);
  const [reveal, setReveal] = useState(false);

  const xpub = words ? `xpub6${rndHex(106)}` : "";
  const addrs = words
    ? Array.from({ length: 5 }, (_, i) => ({
        path: `m/84'/0'/0'/0/${i}`,
        addr: `bc1q${rndHex(38)}`,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div className="border border-border/70 bg-card/30 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">BIP39 · 12 palavras</div>
            <h3 className="font-display text-xl">Sua semente</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setWords(gen12()); setReveal(false); }}
              className="px-4 py-2 font-mono text-xs uppercase tracking-widest border border-border hover:border-bitcoin/60 transition-colors"
            >
              gerar nova
            </button>
            {words && (
              <button
                onClick={() => setReveal((r) => !r)}
                className="px-4 py-2 font-mono text-xs uppercase tracking-widest bg-bitcoin text-primary-foreground hover:bg-bitcoin-glow transition-colors"
              >
                {reveal ? "esconder" : "revelar"}
              </button>
            )}
          </div>
        </div>

        {!words && (
          <div className="font-mono text-sm text-muted-foreground/70 py-12 text-center border border-dashed border-border">
            clique em “gerar nova” para criar uma seed offline
          </div>
        )}

        {words && (
          <div className="grid grid-cols-4 gap-2 animate-fade-up">
            {words.map((w, i) => (
              <div key={i} className="border border-border/70 px-3 py-2 font-mono text-sm">
                <span className="text-muted-foreground/60 text-[10px] mr-2">{String(i + 1).padStart(2, "0")}</span>
                <span>{reveal ? w : "•".repeat(w.length)}</span>
              </div>
            ))}
          </div>
        )}

        <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
          Essas 12 palavras <em>são</em> sua carteira. Quem tem essa lista, tem o Bitcoin.
          Anote em papel, guarde longe de câmeras, e nunca digite em um site qualquer.
        </p>
      </div>

      {words && (
        <>
          <div className="border border-border/70 bg-card/30 p-6 animate-fade-up">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">extended public key (xpub)</div>
            <div className="font-mono text-xs text-bitcoin break-all animate-hash">{xpub}</div>
            <p className="mt-3 text-sm text-muted-foreground">
              A xpub permite gerar todos os seus endereços <em>sem</em> revelar a chave privada. Útil pra ver saldo num computador inseguro.
            </p>
          </div>

          <div className="border border-border/70 bg-card/30 p-6 animate-fade-up">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">endereços derivados (m/84'/0'/0'/0/n)</div>
            <div className="space-y-1 font-mono text-xs">
              {addrs.map((a) => (
                <div key={a.path} className="flex gap-4 border-b border-border/40 py-1.5">
                  <span className="text-muted-foreground w-32">{a.path}</span>
                  <span className="text-foreground truncate">{a.addr}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Uma única seed gera uma <span className="text-bitcoin">árvore infinita</span> de endereços. Use um diferente pra cada recebimento.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
