# Development Setup

This guide walks through setting up Solvora Dashboard for local development on macOS, Linux, and Windows (WSL2).

---

## Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| **Git** | Any | Version control |
| **Node.js** | 20+ (LTS) | Runtime |
| **npm** | 10+ | Package manager |
| **Freighter** | Latest | Stellar wallet (Chrome/Edge extension) |

### 1. Install Node.js

Use [nvm](https://github.com/nvm-sh/nvm) or the official installer:

```bash
nvm install 20 && nvm use 20
```

### 2. Install Freighter

Install the [Freighter extension](https://freighter.app), create a wallet, and fund it on
testnet via [Friendbot](https://friendbot.stellar.org) — see
[docs/guides/connecting-your-wallet.md](./guides/connecting-your-wallet.md).

### 3. Clone and install

```bash
git clone https://github.com/thegreatfeez/solvora-dashboard.git
cd solvora-dashboard
cp .env.example .env.local
npm ci
```

### 4. Fill in `.env.local`

```env
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_ENGINE_URL=http://localhost:3000
NEXT_PUBLIC_ENTITY_REGISTRY_ADDRESS=<deployed entity-registry id>
NEXT_PUBLIC_ATTESTATION_ADDRESS=<deployed attestation id>
NEXT_PUBLIC_SIM_SOURCE=<any funded testnet public key>
```

`NEXT_PUBLIC_SIM_SOURCE` is a public key used to build read-only simulation transactions —
it never signs anything.

### 5. Run the dev server

```bash
npm run dev
```

Open http://localhost:3001 (or the port Next.js prints).

---

## Verification checklist

- [ ] `npm run dev` starts without errors
- [ ] The module switcher renders with Financial Reporting live and two locked modules
- [ ] Connecting Freighter shows your testnet entities (or the empty state)
- [ ] The engine API responds at `NEXT_PUBLIC_ENGINE_URL` (`/health`, `/modules`)

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Freighter shows "wrong network" | Switch Freighter to Testnet (network selector in the extension) — must match `NEXT_PUBLIC_NETWORK_PASSPHRASE` |
| Contract calls fail with `Not Found` | The contract IDs in `.env.local` must match deployed testnet contracts (contracts repo DEPLOYMENT.md) |
| Reports show "INDEXER_LAGGING" | Start the engine indexer (`npm run index` in solvora-engine) so data exists |
| Port conflict | `next dev -p 3001` |

Questions? Ask in the [solvora-meta discussions](https://github.com/thegreatfeez/solvora-meta/discussions).