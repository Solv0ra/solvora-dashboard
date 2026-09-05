# Reading Financial Reports

The **Financial Reporting** module turns indexed on-chain activity into readable
statements. This guide covers the two report types and how to read them.

---

## Report types

| Type | What it answers | View |
|---|---|---|
| **Balance sheet** | What does the entity hold *right now*? | "As of ledger N" |
| **Cash flow** | What moved in/out over a period? | Date-range table with totals |

In the Reporting module, pick an entity, choose a type, and press **Generate**.

## Reading a balance sheet

- One row per asset the entity holds (XLM, USDC, EURC, …).
- Amounts are displayed in familiar units, with the raw smallunit shown in a tooltip.
- The **As of ledger** line is the exact ledger the snapshot was computed from — this is
  the number the attestation binds to.

## Reading a cash flow report

- **Inflows** (money coming in) and **outflows** (money going out) per asset.
- Optional `from` / `to` filter (max 366 days).
- Totals row per asset; net position per asset.

## Exporting

Use **Export CSV** to download the current report as a spreadsheet. Every export includes
the source ledger sequence and the canonical hash (see
[attesting-and-verifying-reports.md](./attesting-and-verifying-reports.md)).

## What you won't see (yet)

- Income statement and consolidated reports are "Coming soon" — the engine returns a
  friendly 501, and the UI shows a designed empty state.
- AMM / lending-market entities produce no reports until their adapters ship (they can be
  registered, but are marked "coming soon" in the report picker).

## Troubleshooting

| Problem | Meaning / fix |
|---|---|
| "INDEXER_LAGGING" | No indexed data for this entity yet — the indexer has not processed it; check back after the next indexing pass |
| Empty report | The entity has no transfers in the selected period (or no addresses yet — add them via entity settings) |
| "REPORT_TYPE_NOT_IMPLEMENTED" | The type is a stubbed roadmap item, not a bug |

Next: [Attesting and verifying reports](./attesting-and-verifying-reports.md)