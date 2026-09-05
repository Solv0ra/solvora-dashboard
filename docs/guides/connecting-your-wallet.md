# Connecting Your Wallet

Solvora uses the **Freighter** browser extension as its wallet. This guide sets you up.

---

## 1. Install Freighter

- Chrome / Edge / Brave: install from [freighter.app](https://freighter.app).

## 2. Create a wallet

1. Open Freighter and choose **Create a new wallet**.
2. Save the recovery phrase somewhere safe — it controls your testnet funds and your
   entity ownership.
3. Set a password.

## 3. Switch to Testnet

Solvora currently runs on **Stellar Testnet**. In Freighter:

1. Click the network selector (bottom-left).
2. Choose **Testnet** (passphrase `Test SDF Network ; September 2015`).

## 4. Fund your account

Stellar testnet accounts start empty. Fund yours:

1. Copy your public key (starts with `G`).
2. Visit [Friendbot](https://friendbot.stellar.org) and paste the address — it sends free
   XLM immediately.

## 5. Connect to Solvora

1. Open the Solvora dashboard.
2. Click **Connect Wallet** in the header.
3. Approve the connection request in the Freighter popup.

You should now see your address in the header and the entity picker will be ready.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Wrong network" banner | Freighter must be on Testnet (step 3) |
| Cannot fund | Friendbot requires a valid `G…` address; wait a few seconds if it says "account exists" (already funded) |
| No wallet popup | Refresh the page and click Connect Wallet again |

Next: [Registering an entity](./registering-an-entity.md)