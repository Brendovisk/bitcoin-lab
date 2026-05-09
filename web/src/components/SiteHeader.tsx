"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function useCurrentBlock(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    let es: EventSource | null = null;
    let dead = false;

    async function init() {
      try {
        const res = await fetch(`${API}/api/status/block`);
        const data = (await res.json()) as { height: number };
        if (data.height) setHeight(data.height);
      } catch {
        // node offline
      }
    }

    function connect() {
      if (dead) return;
      es = new EventSource(`${API}/api/sse/status`);
      es.addEventListener("block-height", (e) => {
        const data = JSON.parse(e.data) as { height: number };
        setHeight(data.height);
      });
      es.onerror = () => {
        es?.close();
        setTimeout(connect, 10_000);
      };
    }

    void init();
    connect();

    return () => {
      dead = true;
      es?.close();
    };
  }, []);

  return height;
}

export function SiteHeader() {
  const pathname = usePathname();
  const blockHeight = useCurrentBlock();

  const linkClass = (href: string, exact = false) => {
    const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
    return `hover:text-foreground transition-colors${isActive ? " text-foreground" : ""}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo />
        </Link>
        <nav className="flex items-center gap-7 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <Link href="/" className={linkClass("/", true)}>
            Manifesto
          </Link>
          <Link href="/lab" className={linkClass("/lab")}>
            Laboratório
          </Link>
          <Link href="/lab/bitcoin-core" className={linkClass("/lab/bitcoin-core")}>
            Console
          </Link>
          <Link href="/lab/challenges" className={linkClass("/lab/challenges")}>
            Desafios
          </Link>
        </nav>
        <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
          <span className="pulse-dot">regtest</span>
          <span className="text-border">|</span>
          <span>
            block{" "}
            <span className="text-bitcoin">
              #{blockHeight > 0 ? blockHeight.toLocaleString("pt-BR") : "—"}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
