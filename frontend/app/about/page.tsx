import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/SiteHeader";
import Link from "next/link";

export const metadata = {
  title: "How Phishout Works",
  description:
    "Most phishing checkers send your link to one server. Phishout uses multiple independent validators that each check separately and must agree before any result is accepted.",
};

const STEPS = [
  {
    n: 1,
    title: "You paste a link and click Check",
    body: "Your link is sent to Phishout's GenLayer Intelligent Contract. Nothing leaves your browser until you click Check.",
  },
  {
    n: 2,
    title: "One validator runs first",
    body: "A single validator, picked automatically by the GenLayer Intelligent Contract, queries the database and records what it finds: either this website is flagged, or it isn't.",
  },
  {
    n: 3,
    title: "Other validators check the same link independently",
    body: "Several other validators each query the same database on their own. They have no idea what the first validator found. Each one reports back separately.",
  },
  {
    n: 4,
    title: "Their answers are compared",
    body: "The answers must match exactly. Because the database returns a clear yes or no for any given website, every validator that queries it at the same time will get the same answer, making an exact match reliably achievable.",
  },
  {
    n: 5,
    title: "Agreed result accepted or the check fails",
    body: "If all validators agree, the result is confirmed. If they don't, which can happen if the database is updating, the check fails rather than silently returning an unreliable answer. You will be asked to try again.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex flex-1 flex-col">

        {/* Hero */}
        <section className="border-b border-border px-4 py-16 text-center">
          <div className="mx-auto max-w-2xl">
            <h1
              className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              How Phishout works
            </h1>
            <p
              className="text-base leading-relaxed text-muted-foreground"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Most phishing checkers send your link to one server and ask you to
              trust whatever it says back. Phishout works differently. Multiple
              independent validators each check your link separately against the
              database, and the result is only accepted when they all agree. No
              single server can fake or change the answer.
            </p>
          </div>
        </section>

        {/* The check, step by step */}
        <section className="border-b border-border bg-card px-4 py-16">
          <div className="mx-auto max-w-2xl">
            <h2
              className="mb-2 text-xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              The check, step by step
            </h2>
            <p
              className="mb-8 text-sm text-muted-foreground"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              What happens from the moment you paste a link to the moment a
              result appears.
            </p>
            <ol className="flex flex-col gap-3">
              {STEPS.map((step) => (
                <li key={step.n}>
                  <Card>
                    <CardContent className="flex gap-4 py-4">
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
        </section>

        {/* Why checking separately matters */}
        <section className="border-b border-border bg-background px-4 py-16">
          <div className="mx-auto max-w-2xl">
            <h2
              className="mb-4 text-xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Why checking separately matters
            </h2>
            <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
              <p style={{ fontFamily: "var(--font-jakarta)" }}>
                When you ask one server if a website is safe, you are trusting
                that server completely. If that server is compromised,
                misconfigured, or simply lying, you have no way to know. You
                just get an answer and are expected to believe it.
              </p>
              <p style={{ fontFamily: "var(--font-jakarta)" }}>
                Phishout removes that single point of trust. Each validator
                queries the database independently, without knowing what the
                others found. For the result to be accepted, every validator
                must come back with the same answer. If even one disagrees, the
                check fails rather than passing with an unreliable result.
              </p>
              <p style={{ fontFamily: "var(--font-jakarta)" }}>
                This means no single party, not even Phishout itself, can tell
                you a phishing site is safe. The answer has to be earned by
                agreement, not handed down by one server you have to trust
                blindly.
              </p>
            </div>
          </div>
        </section>

        {/* Why this is different */}
        <section className="border-b border-border bg-card px-4 py-16">
          <div className="mx-auto max-w-2xl">
            <h2
              className="mb-4 text-xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Why this is different from every other phishing checker
            </h2>
            <p
              className="mb-8 text-sm leading-relaxed text-muted-foreground"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              The difference is not the database. That is just a data source any
              checker can use. The difference is who delivers the answer and how
              many independent validators verify it.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card
                style={{
                  backgroundColor: "var(--ph-flagged-bg)",
                  borderColor: "var(--ph-flagged-border)",
                }}
              >
                <CardHeader className="pb-2">
                  <CardTitle
                    className="text-sm font-semibold"
                    style={{
                      fontFamily: "var(--font-jakarta)",
                      color: "var(--ph-flagged)",
                    }}
                  >
                    Every other phishing checker
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p
                    className="text-sm leading-relaxed text-muted-foreground"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    Your link goes to one server. That server queries a
                    database, gets an answer, and sends it back to you. You have
                    no way of knowing if that server returned the real answer or
                    any answer at all.
                  </p>
                </CardContent>
              </Card>

              <Card
                style={{
                  backgroundColor: "var(--ph-clean-bg)",
                  borderColor: "var(--ph-clean-border)",
                }}
              >
                <CardHeader className="pb-2">
                  <CardTitle
                    className="text-sm font-semibold"
                    style={{
                      fontFamily: "var(--font-jakarta)",
                      color: "var(--ph-clean)",
                    }}
                  >
                    Phishout
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p
                    className="text-sm leading-relaxed text-muted-foreground"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    Your link is checked by multiple independent validators,
                    each querying the database separately. The result is only
                    accepted when they all see the same thing. No single server,
                    including Phishout itself, can fake or change that result.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* The database behind the check */}
        <section className="border-b border-border bg-background px-4 py-16">
          <div className="mx-auto max-w-2xl">
            <h2
              className="mb-4 text-xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              The database behind the check
            </h2>
            <p
              className="text-sm leading-relaxed text-muted-foreground"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Phishout uses one of the largest phishing and malicious website
              databases in Web3. Phishout does not replace the database. It
              makes the database trustworthy by ensuring multiple independent
              validators verify the answer, rather than asking you to trust a
              single server&rsquo;s word.
            </p>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
                <h2
                  className="text-xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  Ready to check a website?
                </h2>
                <Link
                  href="/"
                  className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold transition-opacity hover:opacity-85"
                  style={{
                    background: "var(--ph-brand)",
                    color: "var(--ph-on-brand)",
                    fontFamily: "var(--font-jakarta)",
                  }}
                >
                  Check a website →
                </Link>
                <p
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  Phishout uses a live phishing database, independently verified
                  by multiple validators before any result is accepted.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

      </main>
    </div>
  );
}
