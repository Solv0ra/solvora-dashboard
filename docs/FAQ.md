# Frequently Asked Questions

## For Users

### What is Solvora?
Solvora is an on-chain financial intelligence platform for Stellar Soroban. You pick an
on-chain entity (a treasury, a protocol, a multisig) and run tools against it — starting
with **Financial Reporting** (balance sheets and cash flow statements from real on-chain
data), with an **Invariant / Risk Monitor** and **Proof of Reserve** on the way. For the
full product story read the [README](../README.md).

### How do I connect my wallet?
Install the Freighter extension, create a wallet, fund it on testnet
([Friendbot](https://friendbot.stellar.org)), switch Freighter to Testnet, then click
**Connect Wallet**. Walkthrough: [connecting-your-wallet.md](./guides/connecting-your-wallet.md).

### What does "attest on-chain" mean?
Attesting anchors a cryptographic hash of a report on the Stellar network via the Solvora
`attestation` contract. Anyone can later re-compute the hash and verify the report really
corresponds to a specific ledger state. See
[verifying-your-attestations.md](./guides/verifying-your-attestations.md).

### Why are some modules locked?
Solvora is a platform being built in waves. Locked modules (Invariant/Risk Monitor, Proof
of Reserve) are scoped, designed, and tracked — they ship in later waves rather than being
stubbed forever.

### Which entity types can I register?
Today: **Treasury** and **Generic**. AMM and LendingMarket types exist on-chain but the
engine's adapters for them are on the roadmap — the picker shows them as "coming soon".

## For Developers

### Where do issues live?
All issues are coordinated in the solvora-meta coordination repository (kept local)
(`issues.md` backlog, `issue-tracker.md` ledger, `current-issue.md` template), grouped by
repo. Pick one labeled `frontend`.

### Why does the dashboard render modules from the engine?
So live vs. coming-soon status lives in one place (engine ARCHITECTURE §3). The dashboard
never hardcodes what's live — a backend change alone can promote a module.

### What does "canonical hash" mean and why does it matter?
The attestation anchor is SHA-256 over a *canonical serialization* of the report (sorted
keys, fixed number format). If we hashed raw JSON, the same report might hash differently
depending on serialization. The rule is shared with the engine
([ARCHITECTURE.md](https://github.com/Solv0ra/solvora-engine/blob/main/docs/ARCHITECTURE.md#4-data-model)).

### Why can't I delete an entity?
Entities are immutable in the MVP by design — deleting them would break the audit trail for
their attestations. Owner-transfer and deprecation flows are on the roadmap.

### Do I need the engine running to use the dashboard?
For reports and the module switcher, yes. Entity registration and attestation history are
contract reads and work with the engine offline (the switcher shows a degraded banner).

## More

- [GLOSSARY.md](./GLOSSARY.md) — terms used across the docs
- [guides/](./guides/README.md) — end-user guides
- [tutorials/](./tutorials/README.md) — step-by-step walkthroughs