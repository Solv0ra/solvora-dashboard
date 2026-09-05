# Solvora Dashboard

[![Frontend CI](https://github.com/thegreatfeez/solvora-dashboard/actions/workflows/ci-frontend.yml/badge.svg)](https://github.com/thegreatfeez/solvora-dashboard/actions/workflows/ci-frontend.yml)
![Soroban](https://img.shields.io/badge/Built%20on-Soroban-blue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

**The web frontend for Solvora — pick an on-chain entity, run a financial tool on it, verify the result on-chain.**

---

## The Problem

Solvora is a platform, not a single-purpose app. But a platform without a product surface
is invisible: users have no way to register the entities they want analyzed, browse the
reports the engine produces, or verify that a report is anchored to real ledger state.

Solvora Dashboard is that surface. It is built around a **module switcher**: a user picks an
on-chain entity (a treasury, a protocol, a multisig) and chooses which Solvora tool to run
against it — today **Financial Reporting**, with **Invariant / Risk Monitor** and
**Proof of Reserve** visibly on the way.

---

## What the Dashboard Does

```
Connect Freighter ──► Entity picker ──► Module switcher
                                            │
                    ┌───────────────────────┤
                    ▼                       ▼
        Financial Reporting           (locked) Risk Monitor
        - balance sheet                (locked) Proof of Reserve
        - cash flow
        - attest on-chain
```

**Key properties:**

- **Platform-first shell** — module switcher visible from day one; locked modules are
  designed cards with real copy, never dead routes
- **Entity onboarding wizard** — register a treasury/generic entity on-chain; other types
  show "coming soon" inside the picker itself
- **Live reports from real data** — balance sheet and cash flow served by the engine from
  indexed testnet activity
- **One-click attestation** — anchor a report hash on-chain via the Solvora `attestation`
  contract
- **Verification** — re-derive report hashes and confirm they match on-chain anchors

---

## Live Deployment (Testnet)

| | |
|---|---|
| **Frontend** | TBD (deployed with Phase 3 of the build plan) |
| **Engine API** | [solvora-engine](https://github.com/thegreatfeez/solvora-engine) |
| **Contracts** | [solvora-contracts](https://github.com/thegreatfeez/solvora-contracts) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       Browser (Next.js)                         │
│                                                                 │
│  ┌──────────────┐   ┌──────────────────────────────────────┐   │
│  │  Freighter   │   │  Read-only (no signing):             │   │
│  │  Wallet      │   │  - contract reads via simulate       │   │
│  └──────┬───────┘   │  - all reports via engine REST API   │   │
│         │ sign tx   └──────────────────┬───────────────────┘   │
└─────────┼──────────────────────────────┼───────────────────────┘
          │                              │
          ▼                              ▼
   Soroban RPC (testnet)         solvora-engine (REST /health /modules /entities /reports)
          │
          ▼
   solvora contracts (entity-registry · attestation)
```

Read calls use `simulateTransaction` (no wallet, no fees) for entity/attestation data, and
the engine REST API for reports. Write calls (register entity, update entity, attest) go
through Freighter signing.

Full details: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)

---

## Repository Layout

```
src/
  lib/            contract.ts (Soroban reads), wallets.ts (Freighter), canonicalization
  hooks/          useWallet, useEntities, useReports, useModules
  pages/          Landing, EntityPicker, Reporting, AttestationHistory, Verify
  components/     ModuleCard, LockedModuleCard, ReportTable, AttestButton, ...
  styles/         Tailwind design system
docs/             Architecture, setup, design, security, deployment, FAQ, glossary, guides
.github/workflows/  CI: lint, build, typecheck
```

---

## Getting Started

> **New contributors:** See [`docs/SETUP.md`](./docs/SETUP.md) for full environment setup on macOS, Linux, and Windows (WSL2).

### 1. Clone and install

```bash
git clone https://github.com/thegreatfeez/solvora-dashboard.git
cd solvora-dashboard
cp .env.example .env.local
npm ci
```

### 2. Fill in your `.env.local`

```env
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_ENGINE_URL=http://localhost:3000
NEXT_PUBLIC_ENTITY_REGISTRY_ADDRESS=<deployed entity-registry id>
NEXT_PUBLIC_ATTESTATION_ADDRESS=<deployed attestation id>
NEXT_PUBLIC_SIM_SOURCE=<any funded testnet public key>
```

`NEXT_PUBLIC_SIM_SOURCE` is only used to build read-only simulation transactions — it never
signs anything. Get a free testnet account from [Friendbot](https://friendbot.stellar.org).

### 3. Run the dev server

```bash
npm run dev
```

---

## Screens (MVP)

| Screen | What it does |
|---|---|
| **Landing / entity picker** | Connect wallet, see your entities, "Register new entity" flow |
| **Module switcher** | Persistent nav rendering all modules from `GET /modules` — live are clickable, locked show a designed card |
| **Reporting module** | Report type selector (Balance Sheet / Cash Flow), report viewer + chart, "Attest on-chain" button, CSV export |
| **Entity onboarding wizard** | Pick type (MVP: only Treasury/Generic selectable; others "coming soon"), name, address list, submit to `entity-registry` |

---

## Common Commands

| Task | Command |
|---|---|
| Run dev server | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |

---

## Roadmap

### Near-term
- [ ] Wallet connect + entity registration flow
- [ ] Module switcher shell (three modules, two locked)
- [ ] Reporting module UI + attestation button

### Mid-term
- [ ] Attestation history page with verification
- [ ] Cash-flow charting and CSV export polish
- [ ] Invariant Monitor tab (when engine ships it)

### Long-term
- [ ] Public shareable report links
- [ ] i18n, mobile responsiveness, accessibility pass
- [ ] Proof-of-Reserve dashboard

---

## Contributing

Solvora Dashboard welcomes contributions of all kinds — components, flows, tests,
documentation, and bug fixes.

**Start here:** [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md)

---

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

---

## Security

This frontend is a client — it holds no funds and no secrets. Its job is to display
on-chain truth and to route signatures through the user's own wallet. See
[`docs/SECURITY.md`](./docs/SECURITY.md) for the threat model.

---

## License

MIT — see [LICENSE](./LICENSE)