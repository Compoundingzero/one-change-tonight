# Owner setup

Run `pnpm owner:setup` in an interactive terminal. It validates and writes `.env.local` with mode 0600; that file is ignored by Git.

Required for production: final HTTPS URL, organization name, legal owner name, public contact email, jurisdiction, contact method, and GPTBot policy. Optional values are Google and Bing verification tokens, IndexNow key, social URLs, and a future analytics configuration. Analytics remains false unless separately reviewed and enabled.

After configuration, run `pnpm owner:setup -- --check`, `PUBLIC_DEPLOY_CONTEXT=production pnpm audit:all`, and inspect the generated title, canonical, robots, sitemap, privacy, terms, contact, and source pages. If IndexNow is used, host the exact owner-generated key at `/{key}.txt`, verify it is reachable, then run `pnpm indexnow:submit -- --confirm`. Submission does not guarantee indexing or ranking.
