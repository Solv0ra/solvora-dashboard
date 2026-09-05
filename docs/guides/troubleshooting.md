# Troubleshooting

Common problems and fixes for the Solvora dashboard.

## Wallet

| Problem | Fix |
|---|---|
| Freighter not detected | Install the extension and refresh; the app checks on mount |
| Wrong network error | Freighter must be on **Testnet** (see [connecting-your-wallet.md](./connecting-your-wallet.md)) |
| "Account not found" | Fund the account via Friendbot first; reads need an existing account |

## Entities

| Problem | Fix |
|---|---|
| Entity list empty | Either no entities are registered for this wallet, or the contract IDs in `.env.local` are wrong — verify against the contracts repo deployment |
| Cannot register | Check label length (≤ 60) and address validity; Freighter must be unlocked |

## Reports

| Problem | Fix |
|---|---|
| "INDEXER_LAGGING" | Engine indexer hasn't processed the entity yet — wait for the next pass or run `npm run index` |
| 501 on report type | That report type is a roadmap stub (income statement, consolidation) |
| 404 entity | The entity exists on-chain but not in the engine cache — indexing re-syncs on read |

## Attestation

| Problem | Fix |
|---|---|
| "Unauthorized" / 403 | Only the entity owner's wallet can attest — connect the wallet that registered the entity |
| Verification mismatch | Re-check the canonicalization version: the dashboard and engine must agree on the canonical spec (engine ARCHITECTURE §4) — both should be on `main` |

## Environment

| Problem | Fix |
|---|---|
| CORS errors | The engine must allow this origin; local dev uses `cors()` with permissive defaults (engine repo) |
| Stale data | Hard-refresh (Cmd+Shift+R); the app caches modules/entities per session |

Still stuck? Open a question in the
[solvora-meta discussions](https://github.com/thegreatfeez/solvora-meta/discussions) with the
console output and network (testnet) info.