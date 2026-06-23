"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  value: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    value: "flagged",
    question: "What does \"Flagged\" mean?",
    answer:
      "the database has this URL listed as a known phishing site. Don't enter credentials, sign a transaction, or connect your wallet here.",
  },
  {
    value: "not-flagged",
    question: "What does \"Not flagged\" mean?",
    answer:
      "This URL isn't in the database as of the time of check. That's not a guarantee it's safe — phishing databases can lag behind new threats. Always verify independently before entering credentials.",
  },
  {
    value: "different",
    question: "How is this different from other phishing checkers?",
    answer:
      "Most phishing checkers send your URL to a single server and return whatever that server says. You're trusting one backend to be honest and correct. Phishout dispatches your check to multiple independent GenLayer validators who each verify the answer separately, without knowing what the others found. The result is only accepted when they agree — so no single point of trust, and no single point of failure.",
  },
];

export function FAQSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="border-t border-border bg-card px-4 py-16"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-2xl">
        <h2
          id="faq-heading"
          className="mb-8 text-xl font-bold tracking-tight text-foreground"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          Common questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger
                className="text-sm font-semibold text-foreground"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent
                className="text-sm leading-relaxed text-muted-foreground"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.section>
  );
}
