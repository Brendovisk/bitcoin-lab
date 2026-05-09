import Link from "next/link";

type Props = {
  index: string;
  title: string;
  description: string;
  href?: string;
  status?: "available" | "soon";
  meta?: string;
};

export function ModuleCard({ index, title, description, href, status = "available", meta }: Props) {
  const content = (
    <div className="group relative h-full border border-border/70 bg-card/40 p-6 transition-all hover:border-bitcoin/60 hover:bg-card/80 hover:shadow-glow">
      <div className="flex items-start justify-between mb-8">
        <span className="font-mono text-[11px] text-muted-foreground tracking-widest">{index}</span>
        {status === "soon" ? (
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5">
            em breve
          </span>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-widest text-signal pulse-dot">
            live
          </span>
        )}
      </div>
      <h3 className="font-display text-2xl font-medium mb-2 group-hover:text-bitcoin transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{description}</p>
      {meta && (
        <div className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest">
          {meta}
        </div>
      )}
      <div className="absolute bottom-6 right-6 font-mono text-bitcoin opacity-0 group-hover:opacity-100 transition-opacity">
        →
      </div>
    </div>
  );
  if (!href || status === "soon") return content;
  return <Link href={href}>{content}</Link>;
}
