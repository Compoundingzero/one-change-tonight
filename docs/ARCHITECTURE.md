# Architecture

```text
Astro static pages
├── content collections: 24 query-led articles
├── typed core pages and source register
├── Preact assessment island
│   ├── typed question schema
│   ├── deterministic scoring/explanation/selection engine
│   └── allowlisted versioned local storage
└── Preact awake-and-hot island

Build gates → dist/ → dependency-free static server → Railway preview
```

`src/lib/decision-engine` owns classification and explanation; UI components only render its output. `src/data/questions` and `src/data/experiments` are typed catalogs. `src/lib/storage` sanitizes every persisted field, migrates supported state, expires it after 90 days, and deletes all current/legacy/auxiliary keys. Public pages build to HTML. Personal result state exists only in the hydrated page and never becomes a route.

Browser CSP uses `connect-src 'none'`; no assessment request path exists. Build-time scripts validate content, sources, links, SEO, privacy invariants, artifacts, and performance budgets. CI adds browser and axe tests. Hosting remains portable through static `dist`, with Railway, Vercel, and Cloudflare Pages configuration.
