# Security Policy — Solvora Dashboard

## Supported Versions

| Version | Supported |
|---|---|
| testnet (current) | Yes |
| mainnet | Not yet deployed — audit pending |

## Threat Model

The dashboard is a client. It holds no funds and no secrets; signatures always originate
from the user's own Freighter wallet.

| Asset | Risk | Mitigation |
|---|---|---|
| **Wallet signatures** | Malicious page tricks user into signing something unintended | Every write flow shows a Freighter preview of the exact call (contract, function, args); no blind signing helpers |
| **Displayed data integrity** | Compromised engine serves false reports | All amounts display smallest-unit strings; report hash verification UI compares against on-chain anchors; entity truth always from the contract |
| **XSS** | User-visible strings (entity labels, descriptions) | Labels rendered as text, never `dangerouslySetInnerHTML`; engine `description` fields treated as untrusted |
| **Supply chain** | Malicious npm package | `npm audit` in CI, lockfile committed, no unvetted deps |

## Reporting a Vulnerability

Report privately via GitHub Security Advisories on this repository — do **not** open a
public issue. Include: page/component affected, minimal repro, impact. Acknowledgment
within 72 hours.

## Related

- [ARCHITECTURE.md](./ARCHITECTURE.md) — data sources and trust boundaries
- engine [SECURITY.md](https://github.com/Solv0ra/solvora-engine/blob/main/docs/SECURITY.md) — backend threat model
- contracts [SECURITY.md](https://github.com/Solv0ra/solvora-contracts/blob/main/docs/SECURITY.md) — on-chain threat model