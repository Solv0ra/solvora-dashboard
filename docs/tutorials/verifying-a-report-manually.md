# Tutorial: Verifying a Report Manually

For auditors and the technically inclined: verify an attestation without the dashboard,
using only the public chain and a shell.

---

## What you need

- `node` (any version)
- The attestation's entity id and attestation id — visible in the dashboard's
  **Attestation history**
- The report JSON you generated (the dashboard's export includes it, or re-generate and
  export CSV — for hashing you need the canonical JSON, which the export embeds)

## Step 1 — Fetch the attestation from the chain

Via Soroban RPC `simulateTransaction` (or stellar.expert's contract viewer):

```bash
# Contract view call, e.g. with stellar CLI:
stellar contract invoke \
  --network testnet \
  --id <ATTESTATION_CONTRACT_ID> \
  -- get_attestation \
  --attestation_id <ID>
```

Note the returned `report_hash` and `ledger_sequence`.

## Step 2 — Recompute the canonical hash

```bash
node -e '
  const crypto = require("crypto");
  const report = require("./report.json"); // your exported report
  const canonical = JSON.stringify({
    entity_id: 1,                 // your entity id
    ledger_sequence: 123456,      // the ledger from the attestation
    report_type: "balance_sheet",
    report_json: report
  }, Object.keys(report).sort());
  console.log(crypto.createHash("sha256").update(canonical).digest("hex"));
'
```

Canonicalization rules (must match exactly):

1. Keys sorted lexicographically, recursively
2. Numbers as strings in smallest unit — no scientific notation, no trailing zeros
3. UTF-8, no BOM
4. `ledger_sequence` is the snapshot ledger, not the submission ledger

## Step 3 — Compare

- Equal → the report is authentic (the owner anchored exactly this content at that ledger).
- Different → the report differs from what was anchored; do not trust it.

## Step 4 — Check TTL health

Attestations expire if untouched for ~30 days (bump-on-access). Check the attestation's
TTL via stellar.expert; if it's approaching expiry, the entity owner should re-attest with
a fresh ledger anchor.

---

## Why this matters

This is the full integrity loop: **on-chain identity** (who owns the entity), **off-chain
computation** (the report), and **on-chain proof** (the hash anchor). No third party needs
to be trusted — the math is public.