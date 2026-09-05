# Attesting and Verifying Reports

Attestation is how a Solvora report becomes *provably* tied to real on-chain state.
This guide covers anchoring a report and verifying it later.

---

## What an attestation is

An attestation is an on-chain record created by the Solvora `attestation` contract that
binds four things:

1. The **entity**
2. A **canonical hash** of the report
3. The **ledger sequence** the report was computed from
4. The **entity owner** as signer

Because only the entity owner can attest (contract-enforced), a verified attestation means:
*"The owner of this entity vouches that this report hash corresponds to ledger N."*

## Attesting a report

1. Generate a report (see [reading-financial-reports.md](./reading-financial-reports.md)).
2. Click **Attest on-chain**.
3. Freighter shows the `submit_attestation` call — confirm it.
4. The new attestation appears in **Attestation history** with its on-chain id.

## Verifying an attestation

1. Open **Attestation history** for the entity.
2. Pick an attestation and click **Verify**.
3. Solvora re-computes the canonical hash from the stored report and compares it to the
   on-chain `report_hash`:
   - **MATCH** — the report matches what the owner anchored.
   - **MISMATCH** — something changed; do not trust this report.

You can also verify manually against stellar.expert: fetch the attestation record and
compare `report_hash` with `sha256(canonical(…))` — see the engine's
[verification example](https://github.com/Solv0ra/solvora-engine/blob/main/docs/API.md#verification-example-re-verify-an-attestation).

## Caveats

- **TTL expiry:** on-chain entries expire if untouched for too long (see the contracts
  glossary entry for TTL). A long-lived report should be re-attested with a fresh ledger
  anchor before its anchor approaches expiry — the dashboard surfaces this window.
- **Verification ≠ truth:** an attestation proves the owner anchored *a* hash at *a*
  ledger; it does not prove the underlying accounting is correct. Adapter bugs are caught
  by reconciliation checks (roadmap) — not by attestation.

Next: [Troubleshooting](./troubleshooting.md)