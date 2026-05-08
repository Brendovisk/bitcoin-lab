import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <Logo />
        </Link>
        <nav className="flex items-center gap-7 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">
            Manifesto
          </Link>
          <Link to="/lab" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">
            Laboratório
          </Link>
          <Link to="/lab/bitcoin-core" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">
            Console
          </Link>
          <Link to="/lab/challenges" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">
            Desafios
          </Link>
        </nav>
        <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
          <span className="pulse-dot">regtest</span>
          <span className="text-border">|</span>
          <span>block <span className="text-bitcoin">#840.219</span></span>
        </div>
      </div>
    </header>
  );
}
