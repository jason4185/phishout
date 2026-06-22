"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface ValidatorStripProps {
  urlKey: string; // keyed to URL so dots re-animate on each new result
}

const DOTS = [0, 1, 2, 3] as const;

export function ValidatorStrip({ urlKey }: ValidatorStripProps) {
  return (
    <AnimatePresence>
      <motion.div
        key={urlKey}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="mt-2"
      >
        <Card size="sm">
          <CardContent className="flex items-center gap-3 py-3!">
            {/* Sequential validator-confirmation dots — Framer Motion only */}
            <div className="flex items-center gap-1.5 shrink-0" aria-hidden>
              {DOTS.map((i) => (
                <motion.span
                  key={i}
                  className="block h-2 w-2 rounded-full bg-primary"
                  initial={{ opacity: 0.12, scale: 0.55 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.32,
                    delay: 0.28 + i * 0.38,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
            <p className="text-xs leading-snug text-muted-foreground">
              Verified by{" "}
              <span className="font-semibold text-foreground">
                independent GenLayer validators
              </span>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
