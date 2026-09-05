# Tutorial: Your First Report End-to-End

This tutorial walks through the complete Solvora loop: connect a wallet, register an
entity, generate a report from real testnet data, and attest it on-chain. Expect ~10
minutes.

---

## Prerequisites

- Freighter installed and funded on testnet ([guide](../guides/connecting-your-wallet.md))
- A testnet address with some activity to analyze — e.g. your own funded wallet, or a
  public testnet treasury address

## Step 1 — Connect

Open the dashboard, click **Connect Wallet**, approve in Freighter. You should see your
address in the header.

## Step 2 — Register an entity

1. Click **Register new entity**.
2. Type: **Treasury** (selectable today).
3. Label: `My First Treasury`.
4. Addresses: paste the public key (or contract address) you want analyzed.
5. Confirm the Freighter popup.

You now have an entity — visible in the entity picker with its on-chain id.

## Step 3 — Generate a balance sheet

1. Select **My First Treasury** in the reporting module.
2. Report type: **Balance Sheet**.
3. Click **Generate**.

If the entity just started, the report may be empty until the indexer processes its
history — run the engine indexer (`npm run index` in solvora-engine) if it's your own
setup. For wallet addresses, any prior transfers appear as balance positions.

## Step 4 — Generate a cash flow report

Switch to **Cash Flow**, set a range covering your activity, and generate. You should see
inflows/outflows with totals.

## Step 5 — Attest the balance sheet

1. Back on the balance sheet, click **Attest on-chain**.
2. Confirm in Freighter.
3. Open **Attestation history**: your attestation is there with a hash and ledger sequence.

## Step 6 — Verify

Click **Verify** on that attestation — it should show **MATCH** (the recomputed canonical
hash equals the on-chain anchor).

## Done 🎉

You've completed the full Solvora loop: on-chain entity identity → off-chain report →
on-chain proof. Everything you did remains verifiable by anyone with the entity id.