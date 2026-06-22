"use client";

import { motion } from "framer-motion";

export function RecentlyChecked() {
  return (
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

        <p
          className="text-sm text-muted-foreground"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          No checks yet — be the first to check a website.
        </p>
      </div>
    </motion.section>
  );
}
