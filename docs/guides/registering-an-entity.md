# Registering an Entity

An **entity** is the on-chain subject of every Solvora tool: a named, owned set of Stellar
addresses. This guide walks through registering one.

---

## What you need

- A connected wallet (see [connecting-your-wallet.md](./connecting-your-wallet.md))
- Ideally, the address(es) of the treasury, multisig, or protocol contracts you want
  analyzed (can also be added later)

## Steps

1. Open the dashboard and connect your wallet.
2. On the landing page, click **Register new entity**.
3. **Pick an entity type.** Today only **Treasury** and **Generic** are selectable; AMM and
   LendingMarket are marked "Coming soon" (their adapters are on the roadmap).
4. **Name it.** A short label (e.g. "Acme DAO Treasury") — max 60 characters.
5. **Add addresses.** Paste Stellar addresses (each starting with `G` or `C`), one per
   line, up to 20. Duplicates are removed automatically.
6. **Review and confirm.** Freighter shows the exact `register_entity` call — check the
   address list, then approve.

Approve the transaction, wait for confirmation, and the entity appears in your list.

## Tips

- Addresses **can be added later**: `update_entity` is owner-only, from the entity's
  settings page.
- The owner is whatever wallet signed the registration — keep that wallet safe; owner
  transfer is a planned feature, not yet available.
- Empty address lists are allowed (e.g. registering a planned treasury now, adding
  contracts after deployment).

## Troubleshooting

| Problem | Fix |
|---|---|
| "Unauthorized" on update | Only the wallet that registered the entity can update it |
| Address validation error | Stellar addresses are 56 chars (public) or 56 (contract); copy full addresses from stellar.expert |
| Transaction stuck | Testnet may lag; retry after 30s — no funds were moved until confirmation |

Next: [Reading financial reports](./reading-financial-reports.md)