export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-32">
      <div className="mx-auto max-w-7xl px-8 py-10 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
        <span>// don't trust. verify.</span>
        <span>caveman_lab v0.1 · open source · no kyc</span>
        <span>peers: <span className="text-signal">12</span></span>
      </div>
    </footer>
  );
}
