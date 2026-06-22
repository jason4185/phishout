"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { CheckState } from "@/lib/types";
import type { LoadingPhase } from "@/hooks/usePhishout";

interface ResultCardProps {
  state: CheckState;
  onReset: () => void;
  onRetry: () => void;
  loadingPhase?: LoadingPhase | null;
  isCached?: boolean;
}

const cardAnim = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: "easeOut" },
};

function ValidatorDots() {
  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-2 w-2 rounded-full bg-primary"
          animate={{ opacity: [0.25, 1, 0.25], scale: [0.75, 1.25, 0.75] }}
          transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.28 }}
        />
      ))}
    </div>
  );
}

export function ResultCard({
  state,
  onReset,
  onRetry,
  loadingPhase,
  isCached = false,
}: ResultCardProps) {
  return (
    <AnimatePresence mode="wait">
      {state.phase === "loading" && (
        <motion.div
          key="loading"
          {...cardAnim}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
        >
          <ValidatorDots />
          <div>
            <p
              className="mb-1 text-sm font-medium text-foreground"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              {loadingPhase === "cache"
                ? "Checking recent results…"
                : "Verifying with GenLayer validators…"}
            </p>
            <p
              className="truncate text-xs text-muted-foreground"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              {state.url}
            </p>
          </div>
        </motion.div>
      )}

      {state.phase === "flagged" && (
        <motion.div
          key="flagged"
          {...cardAnim}
          className="flex flex-col gap-4 rounded-xl border p-6"
          style={{
            background: "var(--ph-flagged-bg)",
            borderColor: "var(--ph-flagged-border)",
          }}
        >
          <div>
            <p
              className="mb-1.5 text-sm font-bold"
              style={{ color: "var(--ph-flagged)", fontFamily: "var(--font-jakarta)" }}
            >
              This website is flagged
            </p>
            <p
              className="break-all text-xs text-muted-foreground"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              {state.url}
            </p>
          </div>
          <p
            className="text-sm text-foreground"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            This website appears in a known phishing database, confirmed by
            multiple independent GenLayer validators. Do not enter any personal
            information or connect your wallet here.
          </p>
          <Button variant="outline" size="sm" onClick={onReset}>
            Check another website
          </Button>
        </motion.div>
      )}

      {state.phase === "clean" && (
        <motion.div
          key="clean"
          {...cardAnim}
          className="flex flex-col gap-4 rounded-xl border p-6"
          style={{
            background: "var(--ph-clean-bg)",
            borderColor: "var(--ph-clean-border)",
          }}
        >
          <div>
            <p
              className="mb-1.5 text-sm font-bold"
              style={{ color: "var(--ph-clean)", fontFamily: "var(--font-jakarta)" }}
            >
              No issues found
            </p>
            <p
              className="break-all text-xs text-muted-foreground"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              {state.url}
            </p>
          </div>
          <p
            className="text-sm text-foreground"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            {isCached
              ? "This website is not currently listed in any known phishing database, based on a recent check. Always stay cautious before connecting your wallet or entering personal information anywhere online."
              : "This website is not currently listed in any known phishing database, verified by multiple independent GenLayer validators. Always stay cautious before connecting your wallet or entering personal information anywhere online."}
          </p>
          <Button variant="outline" size="sm" onClick={onReset}>
            Check another website
          </Button>
        </motion.div>
      )}

      {state.phase === "error" && (
        <motion.div
          key="error"
          {...cardAnim}
          className="flex flex-col gap-4 rounded-xl border p-6"
          style={{
            background: "var(--ph-error-bg)",
            borderColor: "var(--ph-error-border)",
          }}
        >
          <div>
            <p
              className="mb-1.5 text-sm font-bold"
              style={{ color: "var(--ph-error)", fontFamily: "var(--font-jakarta)" }}
            >
              Verification could not be completed
            </p>
            <p
              className="break-all text-xs text-muted-foreground"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              {state.url}
            </p>
          </div>
          <p
            className="text-sm text-foreground"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Validators could not reach agreement on this result. This may be
            temporary — please try again.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onRetry}
              style={{
                background: "var(--ph-brand)",
                color: "var(--ph-on-brand)",
              }}
            >
              Retry
            </Button>
            <Button variant="outline" size="sm" onClick={onReset}>
              Clear
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
