"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function SiteHeader() {
  const pathname = usePathname();
  const { address, connect, disconnect, isConnecting } = useWallet();

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <Link
        href="/"
        className="select-none text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-75"
        style={{ fontFamily: "var(--font-jakarta)" }}
      >
        Phishout
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          href="/"
          className={`text-sm transition-colors ${
            pathname === "/"
              ? "font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={`text-sm transition-colors ${
            pathname === "/about"
              ? "font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          How It Works
        </Link>

        {address ? (
          <Button
            size="sm"
            variant="outline"
            onClick={disconnect}
            className="h-8 gap-2 border-border text-xs font-medium"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--ph-clean)" }}
            />
            {truncateAddress(address)}
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={connect}
            disabled={isConnecting}
            className="h-8 text-xs font-semibold"
            style={{
              background: "var(--ph-brand)",
              color: "var(--ph-on-brand)",
              fontFamily: "var(--font-jakarta)",
            }}
          >
            {isConnecting ? "Connecting…" : "Connect Wallet"}
          </Button>
        )}
      </nav>
    </header>
  );
}
