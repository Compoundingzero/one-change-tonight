# QA report

Date: 2026-09-07. Scope: local release candidate and deployed preview.

This report is completed from command output, browser automation, screenshot inspection, and live response checks. It must not be read as real-user, real-device, clinical, or assistive-technology validation.

## Automated checks

The final release gate covers format, lint, strict typecheck, 41 unit regressions (including a 24,696-case decision enumeration, canonical server redirects, and post-tracker language), dependency advisories, content/source validation, links, rendered SEO rules, privacy source/bundle scans, required-artifact inventory, the static preview build, bundle budgets, 14 Chromium journey/visual/performance checks, and seven axe scenarios. The production preflight was also exercised negatively: it correctly refused to build without an owner-controlled root domain, legal identity, jurisdiction, and monitored contact address, and it rejects platform-preview hostnames.

The live-preview section below is filled only after the immutable release commit is deployed and checked.

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

Pending the final Railway deployment. Verify the URL, deploy status, response/security headers, compression, asset caching, real 404 status, `robots.txt`, empty preview sitemap, no canonical, mobile assessment, refresh restoration, and complete local deletion here after deployment.
