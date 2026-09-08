# QA report

Date: 2026-09-07. Scope: local release candidate and deployed preview.

This report is completed from command output, browser automation, screenshot inspection, and live response checks. It must not be read as real-user, real-device, clinical, or assistive-technology validation.

## Automated checks

The final release gate covers format, lint, strict typecheck, 41 unit regressions (including a 24,696-case decision enumeration, canonical server redirects, and post-tracker language), dependency advisories, content/source validation, links, rendered SEO rules, privacy source/bundle scans, required-artifact inventory, the static preview build, bundle budgets, 14 Chromium journey/visual/performance checks, and seven axe scenarios. The production preflight was also exercised negatively: it correctly refused to build without an owner-controlled root domain, legal identity, jurisdiction, and monitored contact address, and it rejects platform-preview hostnames.

GitHub CI passed the complete gate on release commit `eee5872fad3364fa8b12e96b9908a823cb868a2c` before it was sent to Railway.

The first automatic Dependabot version-update job is separately red because GitHub's default three-day package cooldown encountered two transitive versions already locked on their release date (`@typescript-eslint/types@8.70.0` and `@clack/prompts@1.8.0`). This is not a vulnerability finding or product-CI failure. The cooldown remains enabled; the packages become eligible after 2026-09-10 20:15 UTC, and the scheduled update may retry then.

## Local browser performance equivalent

These are 2026-09-07 localhost Chromium lab observations from the generated static artifact, not field Core Web Vitals or a real-user network claim. The repeatable test asserts DOM-ready under 2 seconds, load under 3 seconds, CLS below 0.1, and no more than 20 resources; the separate bundle audit caps hydrated JavaScript and CSS.

| Route sample  | DOM ready |   Load | Observed LCP | CLS | Resources | Transferred |
| ------------- | --------: | -----: | -----------: | --: | --------: | ----------: |
| Homepage      |    283 ms | 284 ms |       300 ms |   0 |         8 |     35.4 KB |
| Tool          |    267 ms | 267 ms |       304 ms |   0 |         8 |     34.5 KB |
| Awake-and-hot |    246 ms | 246 ms |       284 ms |   0 |         8 |     20.5 KB |
| Search page   |    690 ms | 694 ms |       768 ms |   0 |         1 |      8.2 KB |
| Comparison    |    241 ms | 247 ms |       360 ms |   0 |         1 |      8.1 KB |

The static budget measured 84.0 KB of JavaScript and 12.4 KB of CSS uncompressed across generated assets, with no public asset over 200 KB. Lab observations cannot prove the 75th-percentile field thresholds; production field data does not yet exist.

## Manual review protocol

Keyboard: traverse header, question options, Why disclosure, Back/Continue, result actions, selects, source links, and footer; confirm visible focus and no trap. DOM: one H1 on public pages, logical headings/landmarks, fieldset/legend per question, labeled controls, progress status, result focus, and accessible figure captions. Responsive: inspect 320, 375, 430, 768, 1024, and 1440 widths; test 200% text/zoom-equivalent and reduced motion; check horizontal overflow, clipped progress, tables, diagrams, sticky overlap, dark mode, and print.

Physical devices, VoiceOver/NVDA/TalkBack, and moderated comprehension remain unverified and are named follow-up evidence, not automated-pass claims.

## Live noindex preview

Railway deployment `2cfc74b6-79b8-4269-af62-1cf6b302522a` reached `SUCCESS` for source commit `eee5872fad3364fa8b12e96b9908a823cb868a2c`. The verified URL is [one-change-tonight-production.up.railway.app](https://one-change-tonight-production.up.railway.app). The Railway environment happens to be named `production`, but the application build is intentionally and verifiably a **preview** through `PUBLIC_DEPLOY_CONTEXT=preview`; it must not be treated as the production launch.

| Live check                           | Result                                                                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage, tool, source, comparison   | `200`                                                                                                                                       |
| `/tool` and `/index.html`            | Canonical `308` redirects to `/tool/` and `/`                                                                                               |
| Missing route and unsupported `POST` | Real `404`; `405` with `Allow: GET, HEAD`                                                                                                   |
| Preview indexing                     | `noindex, nofollow, noarchive`; no canonical; `robots.txt` disallows all; XML sitemap has zero URLs                                         |
| Security                             | CSP blocks connections and framing; COOP, referrer, MIME-sniffing, frame, and permissions protections present                               |
| Transport and caching                | Gzip present when requested; hashed CSS is `public, max-age=31536000, immutable`                                                            |
| Path handling                        | Encoded traversal does not expose files; invalid UTF-8 receives `400`                                                                       |
| Live browser journey                 | 14/14 Chromium scenarios passed, including all results, local restore/deletion, tracker, print, night mode, contextual entry, and 320px fit |
| Live accessibility                   | 7/7 axe scenarios passed with no serious or critical findings                                                                               |

Warm-origin live lab observations were: homepage 2.160 s LCP, tool 2.332 s, awake-and-hot 1.588 s, search page 1.980 s, and comparison 1.576 s; CLS was zero. A separate cold connection from the test host took 3.429 s total, of which 2.280 s elapsed before TLS completed; four immediately following HTTP probes took 1.457–1.495 s total. These are small lab samples, not 75th-percentile field data. Railway's edge returns `502` for a syntactically malformed bare-percent URL before it reaches the application; the application itself returns `400` for a validly encoded invalid UTF-8 path, and neither response exposes content.
