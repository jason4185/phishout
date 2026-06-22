"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { ResultCard } from "@/components/ResultCard";
import { ValidatorStrip } from "@/components/ValidatorStrip";
import { decodeUrlParam } from "@/lib/utils";
import { usePhishout } from "@/hooks/usePhishout";
import type { CheckState } from "@/lib/types";

export default function CheckPage() {
  const params = useParams();
  const encoded = params.url as string;

  const [decodedUrl, setDecodedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { checkUrl, loading, loadingPhase, result, isCached, error, reset } = usePhishout();

  const state: CheckState = loading
    ? { phase: "loading", url: decodedUrl ?? "" }
    : result === 1
    ? { phase: "flagged", url: decodedUrl ?? "" }
    : result === 0
    ? { phase: "clean", url: decodedUrl ?? "" }
    : error !== null
    ? { phase: "error", url: decodedUrl ?? "" }
    : { phase: "idle" };

  useEffect(() => {
    try {
      const url = decodeUrlParam(encoded);
      setDecodedUrl(url);
      checkUrl(url);
    } catch {
      setDecodedUrl(encoded);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encoded]);

  function handleReset() {
    reset();
    window.location.href = "/";
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const confirmedUrl: string | null =
    state.phase === "flagged" ? state.url :
    state.phase === "clean"   ? state.url :
    null;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex flex-1 flex-col items-center px-4 py-16">
        <div className="w-full max-w-xl">
          {/* Back link */}
          <div className="mb-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              ← Check another URL
            </Link>
          </div>

          <h1
            className="mb-6 text-xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Shared result
          </h1>

          {/* URL being checked */}
          {decodedUrl && state.phase === "loading" && (
            <p
              className="mb-4 truncate text-xs text-muted-foreground"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              {decodedUrl}
            </p>
          )}

          {/* Result card */}
          <ResultCard
            state={state}
            onReset={handleReset}
            onRetry={() => decodedUrl && checkUrl(decodedUrl)}
            loadingPhase={loadingPhase}
            isCached={isCached}
          />

          {/* Validator strip */}
          <AnimatePresence>
            {confirmedUrl !== null && (
              <ValidatorStrip key={confirmedUrl} urlKey={confirmedUrl} />
            )}
          </AnimatePresence>

          {/* Share button — appears after result is in */}
          {confirmedUrl !== null && (
            <div className="mt-4">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                {copied ? "✓ Link copied" : "Share this result"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
