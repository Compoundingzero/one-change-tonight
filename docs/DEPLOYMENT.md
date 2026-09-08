# Deployment

## Preview

The default build is a safe preview. Leave `PUBLIC_DEPLOY_CONTEXT=preview`; pages emit `noindex, nofollow`, canonical tags are omitted, and `/sitemap.xml` contains no public URLs. Railway builds with Railpack and serves `dist` through `node scripts/serve.mjs`.

```sh
railway up --detach -m "Deploy private preview"
railway deployment list --json
```

Do not call a queued build deployed. Wait for `SUCCESS`, then verify `/`, `/tool/`, `/robots.txt`, `/sitemap.xml`, a missing path, headers, compression, storage, deletion, and a 375px flow.

## Production

Production requires a real final domain, owner identity, public contact, jurisdiction, and explicit production configuration. Run `pnpm owner:setup`, then `pnpm build` with `PUBLIC_DEPLOY_CONTEXT=production`. The preflight rejects placeholders. Confirm the domain points to the exact tested deployment before changing indexability.

Portable alternatives are included: Vercel uses `vercel.json`; Cloudflare Pages can publish `dist` with the checked-in Wrangler configuration. A production deployment must repeat the entire live verification gate and must not use an arbitrary platform hostname as the claimed final domain.
