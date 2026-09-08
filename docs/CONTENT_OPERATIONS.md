# Content operations

1. Start from a recorded user question in `docs/research/query-map.csv`; consolidate wording variants unless the decision and answer are materially distinct.
2. Define the direct answer, uncertainty, and useful next action before drafting.
3. Bind every health or performance-adjacent factual claim to IDs in `src/data/sources/sources.ts`. Manufacturer specifications must be labeled as manufacturer claims and never treated as independent effectiveness evidence.
4. Run editorial review for doorway-page risk, overlap, safety, neutrality, and next-question links.
5. Update `published`/`reviewed`, source register, sitemap, and change log for material revisions.
6. Run `pnpm content:validate`, `pnpm links:check`, and `pnpm seo:audit` before merge.

Health sources are rechecked at least annually and sooner after a source update, correction, broken link, policy change, or credible challenge. Search pages are improved from real query/impression evidence; new variants are not created merely to expand page count.
