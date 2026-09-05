# Deployment Guide

This guide covers shipping Solvora Dashboard to Vercel (or any Node host) against deployed
contracts and a running engine.

## Prerequisites

- Deployed contracts (contracts repo `docs/DEPLOYMENT.md`) and a running engine
  (engine repo `docs/DEPLOYMENT.md`)
- The dashboard repo pushed to GitHub

---

## Option A — Vercel (recommended)

1. Import the repo at vercel.com and add these environment variables (project settings):

```env
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_ENGINE_URL=<deployed engine URL>
NEXT_PUBLIC_ENTITY_REGISTRY_ADDRESS=<entity-registry id>
NEXT_PUBLIC_ATTESTATION_ADDRESS=<attestation id>
NEXT_PUBLIC_SIM_SOURCE=<funded testnet public key>
```

2. Deploy. The `vercel.json` SPA rewrites (if present) must keep `/modules` and API
   fetches proxied correctly — this project makes **no** server-side fetch calls, so no
   rewrites are required by default.

3. Set the same variables in GitHub Actions if you use Preview deploys.

## Option B — Self-hosted

```bash
npm ci
npm run build
npm start   # serves the Next.js production build
```

Put it behind HTTPS (Caddy/nginx) — wallet connections over HTTP are rejected by Freighter
on testnet in some builds.

---

## Post-deploy checklist

- [ ] `GET /modules` resolves from the browser (engine reachable, no CORS errors)
- [ ] Freighter connects and reads testnet entities
- [ ] Registering an entity lands on-chain (visible in stellar.expert)
- [ ] Balance sheet / cash flow render from indexed data
- [ ] Attest button anchors a hash; attestation history shows it

## Rollback

Vercel: revert to the previous deployment. Self-hosted: `git checkout <tag>` and rebuild.
The dashboard is stateless — no database rollback involved.

---

## CI

`.github/workflows/ci-frontend.yml` runs lint, typecheck, and a production build on every
PR and push to `main`. Keep the build green before deploying.