"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

export function SiteHeader() {
  const pathname = usePathname();

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
            block <span className="text-bitcoin">#840.219</span>
          </span>
        </div>
      </div>
    </header>
  );
}
