"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface Step {
  n: number;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    n: 1,
    title: "Paste a URL",
    body: "Drop any link into the checker. No account or sign-up required.",
  },
  {
    n: 2,
    title: "Dispatched to multiple validators simultaneously",
    body: "Your check isn't sent to one server. It's dispatched to several independent GenLayer validators at the same time — each one running separately, with no coordination between them.",
  },
  {
    n: 3,
    title: "Each validator checks independently",
    body: "Every validator queries the database on its own. No validator has any knowledge of what the others found before reporting back.",
  },
  {
    n: 4,
    title: "Consensus required before the result is accepted",
    body: "Validators compare answers. The result is only confirmed if they agree. If they don't reach consensus, the check fails — not silently passes. This is what makes the result trustless: no single server's word is taken at face value.",
  },
];

export function HowItWorks() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="border-t border-border bg-background px-4 py-16"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-2xl">
        <h2
          id="how-heading"
          className="mb-1 text-xl font-bold tracking-tight text-foreground"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          How it works
        </h2>
        <p
          className="mb-8 text-sm text-muted-foreground"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          Why consensus verification is different from trusting a single backend.
        </p>

        <ol className="flex flex-col gap-3">
          {STEPS.map((step) => (
            <li key={step.n}>
              <Card>
                <CardContent className="flex gap-4 py-4!">
                  {/* Step number — brand amber circle */}
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground tabular-nums"
                    aria-hidden
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    {step.n}
                  </span>
                  <div>
                    <p
                      className="mb-1 text-sm font-semibold text-foreground"
                      style={{ fontFamily: "var(--font-jakarta)" }}
                    >
                      {step.title}
                    </p>
                    <p
                      className="text-sm leading-relaxed text-muted-foreground"
                      style={{ fontFamily: "var(--font-jakarta)" }}
                    >
                      {step.body}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </motion.section>
  );
}
