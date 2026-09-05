# Glossary

This glossary defines the Stellar, Soroban, and Solvora-specific terms used throughout this
repository's documentation, so contributors and users don't need prior blockchain experience
to follow along. Terms are grouped into three families: **Stellar network** concepts,
**Soroban platform** concepts, and **Solvora product** concepts. Where a term is explained
in more depth elsewhere, a "See also" link points there.

---

## Stellar Network Terms

**Ledger**
The fundamental unit of state and time on the Stellar network, similar to a "block" on other
blockchains. Validators close a new ledger roughly every 5 seconds; each has a sequence
number and a closing timestamp. Solvora reports are anchored to a specific ledger sequence.
See also: [Attestation](#attestation), [Ledger sequence](#ledger-sequence).

**Stroop**
The smallest unit of XLM: 1 stroop = 0.0000001 XLM = 10⁻⁷ XLM. All on-chain amounts in
Solvora are integers in the asset's smallest unit — never floats.

**Testnet**
A public Stellar network for development with free funds (via Friendbot). Solvora runs on
testnet throughout development; mainnet is a v1.0 milestone.

**TTL (Time-To-Live)**
Soroban storage rent mechanism: entries expire unless extended. Solvora uses a
threshold-and-bump pattern (extend on access), so active entities stay alive. If an entry
expires, the network deletes it permanently. See also:
[Entity](#entity), contracts [ARCHITECTURE.md §3.6](https://github.com/thegreatfeez/solvora-contracts/blob/main/docs/ARCHITECTURE.md#36-ttl-bump-strategy).

**WASM**
WebAssembly — the compiled form of Soroban contracts. Deploying a contract deploys its WASM;
upgrading replaces the WASM in place.

---

## Soroban Platform Terms

**Contract / Smart contract**
A program deployed on Soroban (e.g. Solvora's `entity-registry` and `attestation`). All
state lives in ledger entries and all writes require authorization.

**`require_auth`**
Soroban's built-in authorization mechanism: the caller must prove they control an `Address`
(e.g. via Freighter signing) before the contract performs an owner-gated action. Solvora
gates all writes on it.

**Simulate / `simulateTransaction`**
A way to run a contract call without submitting it — read-only and free. Solvora's
dashboard uses it for all reads.

**SEP-41**
Stellar protocol standard for fungible token contracts on Soroban (the successor of FTSO).
"Any Stellar token" in Solvora means any SEP-41-compatible contract.

**Soroban RPC**
The JSON-RPC endpoint (e.g. `soroban-testnet.stellar.org`) through which clients read and
write contract state, and query events.

**Event**
Data a contract publishes during execution (`env.events().publish()`). Solvora consumes
`registered`, `updated` (entity-registry) and `attested` (attestation) events for indexing
and dashboards.

---

## Solvora Product Terms

**Entity**
A registered reporting unit on-chain: an owned set of contract/account addresses with a
label and a type. The atomic subject of every Solvora tool. See also:
contracts [ARCHITECTURE.md §4](https://github.com/thegreatfeez/solvora-contracts/blob/main/docs/ARCHITECTURE.md#4-entity-lifecycle).

**EntityType**
`Treasury`, `Amm`, `LendingMarket`, or `Generic`. The value selects which engine adapter
parses the entity's events. See also: contracts [CONTRACT_API.md](https://github.com/thegreatfeez/solvora-contracts/blob/main/docs/CONTRACT_API.md).

**Adapter**
Engine component that maps raw Soroban events for an `EntityType` to `AccountingEntry`s.
The MVP ships a `GenericTreasuryAdapter`; AMM and lending adapters are roadmap items.
See also: engine [ARCHITECTURE.md §2.2](https://github.com/thegreatfeez/solvora-engine/blob/main/docs/ARCHITECTURE.md#22-adapter-framework).

**AccountingEntry**
A single derived financial fact — inflow, outflow, or balance change — with asset, amount
(smallest unit), counterparty, and ledger sequence.

**Report**
A derived statement produced by the accounting engine: `balance_sheet` (assets at a point
in time) or `cash_flow` (inflows/outflows over a period). Reports are stubbed types in
engine API until shipped (`501`).

**Attestation**
An on-chain record binding a report's canonical hash to an entity, a ledger sequence, a
report type, and the entity owner as signer. Read the flow in
[verifying-your-attestations.md](./guides/verifying-your-attestations.md) and contracts
[ARCHITECTURE.md §5](https://github.com/thegreatfeez/solvora-contracts/blob/main/docs/ARCHITECTURE.md#5-attestation-flow).

**Canonical hash**
SHA-256 over a deterministic serialization of a report (`{entity_id, ledger_sequence,
report_type, report_json}` with sorted keys and fixed number format). The exact bytes the
attestation contract anchors.

**Module**
A named tool in the product platform: **Financial Reporting** (live), **Invariant / Risk
Monitor** and **Proof of Reserve** (coming soon). The list and statuses come from the
engine's `/modules` registry — see engine [ARCHITECTURE.md §3](https://github.com/thegreatfeez/solvora-engine/blob/main/docs/ARCHITECTURE.md#3-module-registry-backend-driven).

**Module registry**
The engine endpoint (`GET /modules`) that tells the dashboard which modules exist and
their status. The single source of truth for live vs. coming-soon.

**Freighter**
The Stellar browser wallet extension Solvora uses for signing writes (register entity,
attest). See also: [connecting-your-wallet.md](./guides/connecting-your-wallet.md).