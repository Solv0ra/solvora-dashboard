# Contributing to Solvora Dashboard

Thank you for contributing! This guide covers the full contributor workflow: environment setup, finding work, opening pull requests, and code standards.

Read the [README](../README.md) and [Architecture](./ARCHITECTURE.md) for product context first.

---

## Ways to contribute

- **Screens & flows** — entity picker, onboarding wizard, reporting module, attestation
- **Components** — ModuleCard, LockedModuleCard, ReportTable, AttestButton, charts, CSV export
- **Polish** — loading skeletons, empty states, accessibility, responsive layouts
- **Tests** — component tests, E2E with Playwright, canonicalization fixtures
- **Docs** — guides, tutorials, FAQ, glossary

## Finding work

Issues are coordinated through **solvora-meta**
([issues.md](https://github.com/thegreatfeez/solvora-meta/blob/main/issues.md),
[issue-tracker.md](https://github.com/thegreatfeez/solvora-meta/blob/main/issue-tracker.md)).
Pick an issue labeled `frontend`, claim it, and follow the workflow below.

## Development workflow

```bash
git clone https://github.com/thegreatfeez/solvora-dashboard.git
cd solvora-dashboard
cp .env.example .env.local
npm ci

git checkout -b feat/123-report-table-csv
npm run lint
npm run typecheck
npm run build
git commit -m "feat: add CSV export to report table"
git push -u origin feat/123-report-table-csv
```

## Branch naming and commits

Branches: `<type>/<issue-number>-<short-slug>` (`feat/`, `fix/`, `docs/`, `test/`, `chore/`).
Commits: Conventional Commits, imperative mood, lowercase.

## Code standards

- TypeScript strict; no `any`.
- Amounts are always strings/bigint from smallest units — never floats (see ARCHITECTURE §6).
- All user-visible strings are rendered as text — no `dangerouslySetInnerHTML` for entity
  labels or engine descriptions.
- New screens must handle: loading, empty, and error states (the design system has
  components for all three).
- Locked modules and locked entity types stay locked in the UI — never enable them
  prematurely.

## Testing

```bash
npm run lint
npm run typecheck
npm test           # vitest
npm run build
```

UI changes should include component tests for the new interaction. Changes touching the
canonical hash must update (or add) the shared fixture and re-verify against the engine's
fixture.

## CI checks that must pass

| Check | Command (CI) |
|---|---|
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Build | `npm run build` |

The CI workflow is `.github/workflows/ci-frontend.yml`. Fix failures before requesting review.