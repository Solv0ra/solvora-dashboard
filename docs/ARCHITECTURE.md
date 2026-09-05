# Solvora Dashboard — Architecture

## 1. System Overview

```text
┌──────────────────────────────────────────────────────────────────────┐
│                        Browser (Next.js)                              │
│                                                                      │
│  ┌────────────────────┐        ┌──────────────────────────────────┐ │
│  │  Freighter wallet  │        │  Read-only data layer:            │ │
│  │  (sign only)       │        │  - contract reads (simulate)      │ │
│  └─────────┬──────────┘        │  - engine REST (reports/modules)  │ │
└────────────┼────────────────────┼──────────────────────────────────┘ │
             │                    │                                     │
             ▼                    ▼                                     │
   Soroban RPC (testnet)    solvora-engine (REST)                       │
             │                                                            │
             ▼                                                            │
   solvora contracts                                                      │
   (entity-registry · attestation)                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

**Golden rule:** the dashboard never trusts its own memory. Entities come from the
`entity-registry` contract; modules come from the engine's `/modules` registry; reports
come from the engine, and their integrity is verifiable on-chain via the `attestation`
contract.

## 2. Data Sources (Contract ↔ Screen Mapping)

| Screen / feature | Data source | Call |
|---|---|---|
| Landing entity list | `entity-registry` (contract) | `list_entities_by_owner(owner)` via `simulateTransaction` |
| Entity detail | `entity-registry` | `get_entity(entity_id)` |
| Register entity wizard | `entity-registry` (write) | `register_entity(...)` via Freighter |
| Update entity | `entity-registry` (write) | `update_entity(...)` via Freighter |
| Module switcher | Engine | `GET /modules` |
| Balance sheet / cash flow | Engine | `GET /entities/:id/reports?type=...` |
| Attest report | `attestation` (write) | `submit_attestation(...)` via Freighter |
| Attestation history | `attestation` (contract) | `list_attestations_for_entity(entity_id)` |
| Verify report | client-side | recompute canonical hash vs. on-chain `report_hash` |

## 3. Module Switcher (the platform shell)

**Behavior contract with the engine** (see engine ARCHITECTURE §3):

| `/modules` status | Frontend renders |
|---|---|
| `live` | Clickable nav item + route |
| `coming_soon` | Designed locked card — icon, name, backend-provided `description`, "Coming soon" badge; clicking opens a small info preview, **never** a broken route |
| absent | Nothing |

The registry is fetched on app boot and cached for the session. If the engine is
unreachable, the switcher renders with a degraded "engine offline" banner — the shell
itself must still render (it is the product framing).

**MVP module set** (driven by the engine, never hardcoded in the dashboard):

1. **Financial Reporting** — live
2. **Invariant / Risk Monitor** — coming soon
3. **Proof of Reserve** — coming soon

## 4. Screens

### 4.1 Landing / entity picker

- Connect Freighter (see docs/guides/connecting-your-wallet.md).
- On connect: `list_entities_by_owner(wallet.address)`; empty state invites registration.
- "Register new entity" opens the onboarding wizard (4.4).

### 4.2 Reporting module

- Report type selector: **Balance Sheet** / **Cash Flow** (only these two at MVP — both
  returned as live by the engine).
- Report viewer: table + simple chart (chart lib TBD; keep data-model agnostic).
- **Attest on-chain** button: computes the canonical hash client-side (shared
  implementation in `src/lib/canonicalize.ts`), calls `submit_attestation` via Freighter,
  shows the new attestation id.
- **Export CSV** for both report types.
- Stubbed types (income statement, consolidation) render a designed "Coming in a later
  wave" empty state — the engine answers `501` for them and the UI must not 500.

### 4.3 Attestation history + verify

- Table of `list_attestations_for_entity(entity_id)`: type, ledger sequence, timestamp, hash.
- Per-attestation **Verify** action: re-compute the canonical hash of the stored report
  (if available) and compare with the on-chain `report_hash`; show MATCH / MISMATCH.
- Warn when an attestation's TTL is approaching expiry (see contracts ARCHITECTURE §3.6).

### 4.4 Entity onboarding wizard

Steps: connect → pick type → name → address list → confirm → `register_entity` signed via
Freighter.

- Entity type picker: only `Treasury` and `Generic` selectable; `Amm` and `LendingMarket`
  show a "Coming soon" badge *inside the picker* — the platform framing starts at first use.
- Address list: paste Stellar addresses, validated client-side; max 20, deduped.

## 5. State & Hooks

| Hook | Source | Notes |
|---|---|---|
| `useWallet` | Freighter | Connected address, network check, sign helper |
| `useModules` | Engine `/modules` | Session-cached; degraded banner on failure |
| `useEntities` | Contract reads | Refetch on write confirmation |
| `useReports(entityId, type, period)` | Engine | React Query-style caching; refetch on period change |
| `useAttestations(entityId)` | Contract reads | Refetch after submit lands |

**After any successful write** (register/update/attest), the affected hook refetches
immediately; polling fallback every 30s for active queries (same pattern Accord uses).

## 6. Token & Amount Handling

- All amounts from the engine arrive as strings in the asset's smallest unit (`bigint`).
- Never render raw smallest-unit numbers: format via `fromBaseUnit(amount, decimals)`
  using each asset's decimals (XLM: 7 stroop; SEP-41 tokens: query `decimals()` once and
  cache).
- Use `Intl.NumberFormat` for display; never concatenate floats into displays.

## 7. Environment Variables

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | RPC endpoint for reads + submits |
| `NEXT_PUBLIC_NETWORK_PASSPHRASE` | Must match the RPC network |
| `NEXT_PUBLIC_ENGINE_URL` | Engine base URL (same network expectations) |
| `NEXT_PUBLIC_ENTITY_REGISTRY_ADDRESS` | Deployed entity-registry contract id |
| `NEXT_PUBLIC_ATTESTATION_ADDRESS` | Deployed attestation contract id |
| `NEXT_PUBLIC_SIM_SOURCE` | Public key for read-only simulations (never signs) |

## 8. Related Documents

| Document | Description |
|---|---|
| [SETUP.md](SETUP.md) | Developer setup |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Deployment + Vercel notes |
| [DESIGN.md](DESIGN.md) | Design decisions / visual direction |
| [FAQ.md](FAQ.md) | User + contributor Q&A |
| [GLOSSARY.md](GLOSSARY.md) | Terms used across the docs |
| [guides/](guides/) | End-user guides |
| [tutorials/](tutorials/) | Step-by-step walkthroughs |
| engine [API.md](https://github.com/Solv0ra/solvora-engine/blob/main/docs/API.md) | Engine endpoints this dashboard consumes |
| contracts [CONTRACT_API.md](https://github.com/Solv0ra/solvora-contracts/blob/main/docs/CONTRACT_API.md) | Contract functions this dashboard calls |