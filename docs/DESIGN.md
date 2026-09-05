# Solvora Dashboard — Design Decisions

This document records the reasoning behind key choices in Solvora Dashboard. Its purpose is
to help contributors evaluate proposed changes against original intent.

---

## 1. Module switcher first, features second

**Decision:** the app shell renders every module from the engine's `/modules` registry,
with locked modules shown as designed cards — before the reporting feature itself shipped.

**Why:** Solvora is a platform, and the first impression must communicate "a platform with
more coming", not "a reporting app". A user (including a wave reviewer) who opens the app
should immediately see the roadmap encoded in the UI. Locked modules get real copy and a
designed state — never greyed-out placeholders or dead routes.

**Trade-off:** the shell ships before the live module has full polish; mitigated by
sequencing (switcher first, reporting immediately after).

## 2. Backend-driven modules, never hardcoded

**Decision:** the dashboard fetches `GET /modules` and renders whatever it returns; module
status lives in the engine's registry.

**Why:** frontend/backend drift is the classic failure mode of "coming soon" features. One
source of truth means promoting a module to live is a backend change + new routes, not a
frontend redesign.

**Trade-off:** an endpoint dependency at boot; degraded-banner behavior covers engine outage
without breaking the shell.

## 3. Client-side canonical hashing, shared with the engine

**Decision:** the Attest button computes the canonical report hash in the browser with
`src/lib/canonicalize.ts`, using exactly the engine's canonicalization rules (ARCHITECTURE
§4 of the engine repo).

**Why:** the user sees the exact bytes that get anchored; no hidden server-side
transformation. The implementation must match the engine byte-for-byte or verification
fails — a cross-repo test fixture keeps them honest.

**Trade-off:** duplicated logic across repos; mitigated by a shared fixture file and a
cross-repo CI check (Wave 2 issue).

## 4. Wallet for writes only, RPC/engine for reads

**Decision:** reads use `simulateTransaction` (no wallet, no fees) and the engine REST API;
only register/update/attest go through Freighter signing.

**Why:** a wallet prompt for every read is poor UX and costs fees; read-only simulation
keeps browsing free. The user's wallet is the only signer of writes — the app never holds
keys.

## 5. Entity-type picker shows "coming soon" at first use

**Decision:** the onboarding wizard renders `Amm` and `LendingMarket` types with a "Coming
soon" badge, selectable only once the engine ships those adapters.

**Why:** the platform framing must hold at the point of first use, not just the nav. It also
telegraphs the extension surface to contributors.

**Trade-off:** slightly more UI work in the wizard; worth it for framing consistency.

## 6. Amounts as strings/bigint end-to-end

**Decision:** all amounts render from smallest-unit strings via formatters; no float math
on chain-derived values anywhere in the UI.

**Why:** Stellar amounts are 7+ decimal places; floats corrupt them. This is a correctness
requirement for a financial product, not a nicety.

---

## Related Documents

- [ARCHITECTURE.md](ARCHITECTURE.md) — screens, hooks, data mapping
- [GLOSSARY.md](GLOSSARY.md) — terms used across the docs
- [guides/](guides/) — end-user guides