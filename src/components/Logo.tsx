export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative">
        <div className="h-8 w-8 rounded-md bg-gradient-bitcoin flex items-center justify-center font-display font-semibold text-primary-foreground text-lg leading-none">
          ₿
        </div>
        <div className="absolute inset-0 rounded-md bg-bitcoin/40 blur-md -z-10" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">caveman</span>
        <span className="font-display text-base font-medium">Bitcoin Lab</span>
      </div>
    </div>
  );
}
