# Phishout

Phishout is a trustless website phishing detector built on GenLayer Bradbury. Every check submitted to Phishout is verified by a GenLayer Intelligent Contract through validator consensus — multiple independent validators each query a live phishing database separately, reach exact agreement on the result, and confirm it on-chain. The database that flags phishing sites is maintained independently — Phishout does not build or maintain it. Phishout's job is narrower and more specific: it makes the act of querying that database trustless. You are not trusting Phishout's infrastructure. You are trusting that independent validators all agreed.

**Live Demo:** https://phishout.vercel.app

---

## The Vision

Every phishing detector on the internet today asks you to trust one backend. You paste a link, one server queries a database, and one server sends back an answer. You have no way to verify it told you the truth. Phishout removes that invisible trust dependency entirely. Multiple independent GenLayer validators each query the database on their own — with no knowledge of what the others found — and the result is only accepted when they all agree. Not one server's word. Every validator's.

This matters most in Web3, where the stakes of a wrong answer are irreversible. A phishing detector that has been tampered with — one that quietly tells you a scam site is safe — is not a hypothetical risk. It is exactly the kind of single-point-of-failure attack that decentralized consensus is designed to prevent. Phishout makes the check itself trustless, not just fast.

---

## What Inspired This

Two things came together to make Phishout possible.

The first was GenLayer's own canonical demonstration of Intelligent Contracts: a price oracle that fetches live data from external APIs and reaches validator consensus on the result. That prototype proved that GenLayer's non-deterministic web access, combined with its equivalence principle, could make any external data source's answer trustless — not just price feeds, but any API a contract could reach.

The second was a gap in the market. Every phishing detector in existence follows the same architecture: one server, one database call, one answer you are asked to trust blindly. None of them make the check itself verifiable. Phishout applies the same oracle pattern GenLayer demonstrated for price data to a real Web3 safety problem. The underlying detection database already exists. Phishout's contribution is making the act of querying it trustless.

---

## Key Innovations

**Trustless oracle pattern applied to Web3 security**
Phishout is structurally the same pattern as a decentralized price oracle — fetch external data, reach consensus, return a verified answer — applied outside the usual financial use case to a real Web3 safety problem. The innovation is not the detection logic. It is who delivers the answer and how many independent parties verify it before it is accepted.

**`strict_eq` consensus on deterministic data**
Because the phishing database returns a binary flag (0 or 1) for any given website, validators use exact-match equivalence — the strictest possible consensus mode. No tolerance bands, no language model judgment, no ambiguity. Either every validator saw the same answer or the check fails rather than silently passing with an inconsistent result.

**No single backend**
Every other phishing detector has one server you call. Phishout has no privileged relay. The Intelligent Contract is the only intermediary, and its logic is publicly verifiable on-chain. Not even Phishout itself can change the result a user receives.

**Fail-safe on disagreement**
If validators do not reach exact agreement — which can happen if the database is mid-update — the transaction fails rather than silently returning an unreliable answer. The user is asked to try again. A security tool should never guess.

---

## Technical Pillars

**GenLayer Intelligent Contract (Python, GenVM)**
The contract is written in Python using GenLayer's SDK. It uses `gl.nondet.web.get()` for non-deterministic web fetches inside the consensus round, and `gl.eq_principle.strict_eq` to require exact validator agreement before any result is accepted. Only the `phishing_site` field is extracted from the database response before consensus comparison — all other response fields are discarded so transient formatting differences between validator fetches never break agreement.

**Binary equivalence consensus**
The database returns either 0 (not flagged) or 1 (flagged). This discrete, non-probabilistic output makes `strict_eq` the correct and reliable consensus choice — unlike contracts that ask a language model to evaluate text, where outputs naturally vary between validators. Phishout's consensus is provably achievable on every check.

**On-chain storage per URL**
Results are stored in a `TreeMap[str, PhishResult]` keyed by URL. Every fresh check overwrites the previous entry for that URL. Storage acts as a write buffer — the frontend reads the result back immediately after the transaction is accepted, using `get_storage(url)` as a reliable post-consensus read.

**Next.js 15 + TypeScript frontend**
Built with the standard GenLayer builder stack: shadcn/ui components, Framer Motion animations, Plus Jakarta Sans and JetBrains Mono typography, next-themes for light/dark/system support, and genlayer-js for contract interaction. All colors defined as CSS custom properties in oklch() format — no hardcoded values anywhere.

---

## GenLayer Methods Used

| Method | Purpose |
|---|---|
| `gl.Contract` | Base contract class |
| `@gl.public.write` | State-modifying check method |
| `@gl.public.view` | Read-only storage lookup |
| `gl.nondet.web.get()` | Non-deterministic database fetch |
| `gl.eq_principle.strict_eq` | Exact-match validator consensus |
| `gl.vm.UserError` | Malformed response handling |
| `TreeMap[str, T]` | Persistent on-chain storage |
| `@allow_storage @dataclass` | Storage-compatible data struct |
| `u8` | Sized integer for phishing flag |

**Total: 9 GenLayer methods across 6 categories**

---

## Contract Methods
check_url(url: str) -> int
Write method. Queries the database through validator consensus, writes result to storage, returns 0 or 1.
get_storage(url: str) -> int
View method. Returns the stored result for a URL (0 or 1), or -1 if never checked.

---

## Status

### MVP 1 — Current (Live on Bradbury)

- ✅ Trustless phishing detection through exact-match validator consensus
- ✅ Every website always fetches fresh from the database — no stale cached results
- ✅ On-chain storage per website — latest result always queryable via get_storage
- ✅ Explorer link shown during verification — users can track their transaction on the Bradbury explorer while validators are reaching consensus
- ✅ User wallet signing — each user signs their own transaction, no shared sponsor wallet
- ✅ Session-based recent checks log — live feed of every website checked in the current session
- ✅ How It Works page — full consensus flow explained in plain language for non-technical users
- ✅ Deployed on GenLayer Bradbury Testnet

**Contract address:** `0xf5E68861Fcf61141190bf3d5383795E207337436`
**Network:** GenLayer Bradbury · Chain ID: 4221

### MVP 2 — Planned

- Multiple databases — cross-reference results across several independent phishing and malware databases, consensus required across all sources, not just one
- Risk scoring — instead of a binary flag, return a weighted risk score based on how many databases flagged the website and with what severity

---

## Project Structure
phishout/

├── contracts/

│   └── phishout.py          # GenLayer Intelligent Contract

├── frontend/

│   ├── app/                 # Next.js pages and API routes

│   ├── components/          # UI components

│   ├── hooks/               # Contract interaction hooks

│   └── lib/                 # Contract address and client config

└── README.md

---

## Configuration & Environment Setup

**Prerequisites**
- Node.js 18+
- Rabby Wallet (https://rabby.io) — recommended for GenLayer Bradbury
- Testnet GEN from the GenLayer Faucet (https://faucet.genlayer.com)

**Local Setup**
```bash
git clone https://github.com/jason4185/phishout
cd phishout/frontend
npm install
npm run dev
```

Open http://localhost:3000, connect your Rabby wallet, and paste any website to see the full consensus flow.

---

## Feedback

Phishout is an active GenLayer Builder Program submission. Feedback and suggestions are welcome on GitHub.

---

*Results reflect the database at time of check and are not a guarantee of safety. Always verify independently before entering credentials anywhere.*

Built by Jason (https://x.com/ja__so)
