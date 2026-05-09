"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type StatusResponse = {
  regtest?: {
    peers?: number;
  };
};

export function SiteFooter() {
  const [peers, setPeers] = useState<number | null>(null);

  useEffect(() => {
    let dead = false;

    async function refreshPeers() {
      try {
        const res = await fetch(`${API}/api/status`, { cache: "no-store" });
        const data = (await res.json()) as StatusResponse;
        if (!dead) {
          setPeers(typeof data.regtest?.peers === "number" ? data.regtest.peers : null);
        }
      } catch {
        if (!dead) setPeers(null);
      }
    }

    void refreshPeers();
    const timer = setInterval(refreshPeers, 30_000);

    return () => {
      dead = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <footer className="border-t border-border/60 mt-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 font-mono text-[11px] text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between xl:px-8 xl:py-10">
        <span>// don't trust. verify.</span>
        <span>
          caveman_lab v0.1 ·{" "}
          <a
            href="https://github.com/Brendovisk/bitcoin-lab"
            target="_blank"
            rel="noopener noreferrer"
          >
            open source
          </a>{" "}
          · no kyc
        </span>
        <span>
          regtest peers: <span className="text-signal">{peers ?? "—"}</span>
        </span>
      </div>
    </footer>
  );
}
