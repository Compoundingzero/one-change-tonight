# One Change Tonight

One Change Tonight is a static-first, private-by-default decision aid for adults who wake hot at night. A deterministic browser-only assessment distinguishes four environmental observation patterns, chooses one reversible experiment, and supports a three-night local check-in. It does not diagnose, triage, prescribe treatment, or send answers to a server.

## Stack

- Astro 7, strict TypeScript, and Preact islands
- Zod schemas, Vitest, Playwright, and axe
- Static HTML output served by a tiny Node static server on Railway
- pnpm 10.18.3; Node 22.12+

Public explanations are rendered to HTML; JavaScript is used only for the assessment, night shortcut, local state, and small controls. The checked-in `.nvmrc` selects the supported Node runtime.

## Run

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Run the complete gate with `pnpm audit:all`. Individual checks include `pnpm test`, `pnpm typecheck`, `pnpm content:validate`, `pnpm links:check`, `pnpm seo:audit`, `pnpm privacy:audit`, `pnpm deps:audit`, `pnpm sources:check`, `pnpm test:e2e`, and `pnpm test:a11y`. The external-source check is intentionally separate from the deterministic gate because publisher bot controls and network availability can vary.

## Deployment states

Preview is the safe default: pages emit `noindex`, omit canonicals, and the sitemap is empty. Production builds intentionally fail until a real domain, legal owner, public contact, and jurisdiction are configured. Run `pnpm owner:setup`, then review [OWNER_SETUP.md](docs/OWNER_SETUP.md) and [DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Privacy and evidence

Answers and check-ins use a versioned allowlisted local-storage schema with 90-day expiry and complete deletion. The content security policy blocks browser connections by default. Health claims are bound to the public source register; comfort experiments are editorial observation protocols, not clinical evidence. See [PRIVACY_ARCHITECTURE.md](docs/PRIVACY_ARCHITECTURE.md), [DECISION_ENGINE.md](docs/DECISION_ENGINE.md), and [MEDICAL_BOUNDARIES.md](docs/MEDICAL_BOUNDARIES.md).

No affiliate links, ads, product rankings, runtime AI, remote fonts, trackers, or first-hand product-test claims are included.
