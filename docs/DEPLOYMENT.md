# Deployment

## Preview

The default build is a safe preview. Leave `PUBLIC_DEPLOY_CONTEXT=preview`; pages emit `noindex, nofollow`, canonical tags are omitted, and `/sitemap.xml` contains no public URLs. Railway builds with Railpack and serves `dist` through `node scripts/serve.mjs`.

The current verified preview is <https://one-change-tonight-production.up.railway.app>. Railway deployment `2cfc74b6-79b8-4269-af62-1cf6b302522a` reached `SUCCESS` from application commit `eee5872fad3364fa8b12e96b9908a823cb868a2c`. `RAILPACK_NODE_VERSION=22.12` is pinned and `PUBLIC_DEPLOY_CONTEXT=preview` is explicit. See `QA_REPORT.md` for live verification evidence.

```sh
railway up --detach -m "Deploy private preview"
railway deployment list --json
```

Do not call a queued build deployed. Wait for `SUCCESS`, then verify `/`, `/tool/`, `/robots.txt`, `/sitemap.xml`, a missing path, headers, compression, storage, deletion, and a 375px flow.

## Production

Production requires a real final domain, owner identity, public contact, jurisdiction, and explicit production configuration. Run `pnpm owner:setup`, then `pnpm build` with `PUBLIC_DEPLOY_CONTEXT=production`. The preflight rejects placeholders. Confirm the domain points to the exact tested deployment before changing indexability.

Portable alternatives are included: Vercel uses `vercel.json`; Cloudflare Pages can publish `dist` with the checked-in Wrangler configuration. A production deployment must repeat the entire live verification gate and must not use an arbitrary platform hostname as the claimed final domain.
