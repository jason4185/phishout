"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SiteHeader } from "@/components/SiteHeader";
import { ResultCard } from "@/components/ResultCard";
import { ValidatorStrip } from "@/components/ValidatorStrip";
import { FAQSection } from "@/components/FAQSection";
import Link from "next/link";
import type { CheckState } from "@/lib/types";
import { usePhishout } from "@/hooks/usePhishout";
import { useWallet } from "@/hooks/useWallet";

interface RecentEntry {
  url: string;
  result: 0 | 1;
  isCached: boolean;
  checkedAt: Date;
}

function truncateUrl(url: string): string {
  return url.length > 40 ? url.slice(0, 40) + "..." : url;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [recentChecks, setRecentChecks] = useState<RecentEntry[]>([]);
  const { address, connect, isConnecting } = useWallet();
  const { checkUrl, loading, loadingPhase, txHash, result, isCached, error, reset } = usePhishout();

  const state: CheckState = loading
    ? { phase: "loading", url: submittedUrl }
    : result === 1
    ? { phase: "flagged", url: submittedUrl }
    : result === 0
    ? { phase: "clean", url: submittedUrl }
    : error !== null
    ? { phase: "error", url: submittedUrl }
    : { phase: "idle" };

  // Append to recent checks whenever a new result arrives
  useEffect(() => {
    if (result !== null && submittedUrl) {
      setRecentChecks((prev) =>
        [
          { url: submittedUrl, result: result as 0 | 1, isCached, checkedAt: new Date() },
          ...prev,
        ].slice(0, 10)
      );
    }
  }, [result, submittedUrl, isCached]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    const normalized =
      trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`;
    setSubmittedUrl(normalized);
    checkUrl(normalized);
  }

  function handleReset() {
    reset();
    setUrl("");
    setSubmittedUrl("");
  }

  const isLoading = loading || isConnecting;
  const walletConnected = Boolean(address);

  const confirmedUrl: string | null =
    state.phase === "flagged" ? state.url :
    state.phase === "clean"   ? state.url :
    null;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        {/* Hero + tool */}
        <div
          className="flex flex-col items-center justify-center px-4 py-16"
          style={{ minHeight: "calc(100vh - 65px)" }}
        >
          <div className="mb-10 w-full max-w-xl text-center">
            <h1
              className="mb-4 leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <span className="block text-2xl font-medium text-muted-foreground sm:text-3xl">
                Stay safe online
              </span>
              <span className="block text-4xl font-extrabold text-foreground sm:text-5xl">
                Check any website
              </span>
            </h1>
            <p
              className="text-base leading-relaxed text-muted-foreground"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Paste any website and find out if it&rsquo;s a known phishing
              site, confirmed by multiple independent GenLayer validators, not a
              single backend you have to trust.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-xl flex-col gap-3"
          >
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a website link here..."
              disabled={isLoading}
              className="h-12 px-4 text-sm"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            />
            <Button
              type={walletConnected ? "submit" : "button"}
              size="lg"
              disabled={walletConnected ? (!url.trim() || isLoading) : isConnecting}
              onClick={walletConnected ? undefined : connect}
              className="h-12 text-sm font-semibold"
              style={
                walletConnected && !url.trim() && !isLoading
                  ? {
                      background: "var(--ph-surface-raised)",
                      color: "var(--ph-text-subtle)",
                    }
                  : {
                      background: "var(--ph-brand)",
                      color: "var(--ph-on-brand)",
                    }
              }
            >
              {isConnecting
                ? "Connecting…"
                : isLoading
                ? "Checking…"
                : walletConnected
                ? "Check Website"
                : "Connect Wallet to Check"}
            </Button>
          </form>

          {/* Static trust line */}
          <p
            className="mt-4 w-full max-w-xl text-center text-xs text-subtle"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Every check is confirmed by independent GenLayer validators, not a single server.
          </p>

          {/* Result area */}
          <div className="mt-4 w-full max-w-xl">
            <ResultCard
              state={state}
              onReset={handleReset}
              onRetry={() => state.phase === "error" && checkUrl(submittedUrl)}
              loadingPhase={loadingPhase}
              isCached={isCached}
            />

            {loadingPhase === "consensus" && txHash && (
              <p
                className="mt-3 text-xs"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                <a
                  href={`https://explorer-bradbury.genlayer.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--ph-brand)" }}
                >
                  View on Explorer →
                </a>
              </p>
            )}

            <AnimatePresence>
              {confirmedUrl !== null && (
                <ValidatorStrip key={confirmedUrl} urlKey={confirmedUrl} />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Recently Checked — session data only */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="border-t border-border bg-card px-4 py-16"
          aria-labelledby="recent-heading"
        >
          <div className="mx-auto max-w-2xl">
            <h2
              id="recent-heading"
              className="mb-1 text-xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Recently checked
            </h2>
            <p
              className="mb-8 text-sm text-muted-foreground"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              A sample of recent checks and their consensus results.
            </p>

            {recentChecks.length === 0 ? (
              <p
                className="text-sm text-muted-foreground"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                No checks yet this session — paste a website above to get started.
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="w-[52%]"
                        style={{ fontFamily: "var(--font-jakarta)" }}
                      >
                        URL
                      </TableHead>
                      <TableHead
                        className="w-[20%]"
                        style={{ fontFamily: "var(--font-jakarta)" }}
                      >
                        Result
                      </TableHead>
                      <TableHead
                        style={{ fontFamily: "var(--font-jakarta)" }}
                      >
                        Source
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentChecks.map((entry, i) => (
                      <TableRow key={i}>
                        <TableCell
                          className="text-xs text-muted-foreground"
                          style={{ fontFamily: "var(--font-jetbrains)" }}
                          title={entry.url}
                        >
                          {truncateUrl(entry.url)}
                        </TableCell>
                        <TableCell>
                          {entry.result === 1 ? (
                            <Badge variant="destructive">Flagged</Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-success/10 text-success border-success/30 dark:bg-success/20 dark:border-success/40"
                            >
                              Clean
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell
                          className="text-xs text-muted-foreground"
                          style={{ fontFamily: "var(--font-jakarta)" }}
                        >
                          {entry.isCached ? "Cached result" : "Fresh check"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </motion.section>

        {/* How It Works teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="border-t border-border bg-background px-4 py-12 text-center"
        >
          <p
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Curious how the consensus works?{" "}
            <Link
              href="/about"
              className="font-medium text-foreground underline-offset-4 hover:underline"
              style={{ color: "var(--ph-brand)" }}
            >
              How It Works →
            </Link>
          </p>
        </motion.div>

        {/* FAQ */}
        <FAQSection />

        <footer className="border-t border-border px-6 py-6 text-center">
          <p
            className="text-xs text-subtle"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Phishout uses the database, verified by GenLayer validator
            consensus.
          </p>
        </footer>
      </main>
    </div>
  );
}
