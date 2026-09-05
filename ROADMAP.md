# Roadmap

Solvora Dashboard is the product surface of the Solvora platform. Priorities in order:
platform framing first (module switcher), then the live module's depth, then breadth. Each
milestone ships only when every acceptance criterion is met.

## Current status

Working toward **v0.1.0** (below). Issues tracked in
[solvora-meta issue-tracker](https://github.com/thegreatfeez/solvora-meta/blob/main/issue-tracker.md).

---

## v0.1.0 — Platform shell + Financial Reporting (MVP)

**Theme:** the switcher exists from day one; reporting is the first live module.

**Targeted features:**

- Wallet connect via Freighter + entity picker + registration wizard
- Module switcher rendering the engine's `/modules` (reporting live; two locked)
- Reporting module: balance sheet + cash flow viewers, attest button, CSV export
- Attestation history + verify

**Acceptance criteria:**

- [ ] A user can connect, register a treasury/generic entity, and see it listed
- [ ] The switcher renders all three modules from the backend — two designed locked cards
- [ ] Balance sheet and cash flow render from real engine data
- [ ] Attest anchors on-chain and history shows it; verify returns MATCH
- [ ] Lint, typecheck, and production build pass

## v0.2.0 — Verification & usability

**Targeted features:**

- Verify-panel with TTL warnings
- Report links (shareable public URLs)
- Loading skeletons, empty states, accessibility pass
- Mobile responsiveness

## v0.3.0 — Breadth

**Targeted features:**

- Invariant Monitor tab (backed by engine Wave 2 module)
- Income statement + consolidation viewers
- i18n

## v1.0.0 — Mainnet

**Targeted features:**

- Proof of Reserve dashboard
- Mainnet deployment + monitoring

---

## Explicit non-goals (MVP)

- Locked modules being clickable before their backend exists
- Client-side token/account custody of any kind
- Rendering amounts as floats (always smallest-unit strings)