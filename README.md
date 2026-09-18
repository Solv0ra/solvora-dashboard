# Solvora Dashboard

The Solvora web app — a module switcher, financial reports, and on-chain attestation.
Built with Next.js + TypeScript + Tailwind.

## What it does

- **Landing / entity picker** — connect a wallet and see the modules you can run against an
  on-chain entity.
- **Module switcher** — renders every module from the engine's `/modules` registry; locked
  modules show a designed "Coming soon" card.
- **Reporting module** — pick a report type, view a report, and attest it on-chain via the
  `Attestation` contract.

Wallet connectivity uses any EIP-1193 injected provider (MetaMask, Rabby, …).

## Setup

```bash
cp .env.example .env.local
# set NEXT_PUBLIC_ENGINE_URL, NEXT_PUBLIC_ENTITY_REGISTRY_ADDRESS,
#      NEXT_PUBLIC_ATTESTATION_ADDRESS

npm install
npm run dev      # http://localhost:3001
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (port 3001) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | Type-check without emitting |

## Structure

```
dashboard/
├── src/app/                pages (/, /reporting)
├── src/components/         ConnectButton, ModuleCard
├── src/hooks/useWallet.ts  EIP-1193 wallet adapter
└── src/lib/modules.ts      module registry fetch + defaults
```

## Contract ↔ Frontend mapping

| UI action | Contract call |
|---|---|
| Register an entity | `EntityRegistry.registerEntity` |
| Update an entity | `EntityRegistry.updateEntity` |
| Attest a report | `Attestation.submitAttestation` |
