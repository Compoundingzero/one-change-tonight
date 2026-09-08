# Launch checklist

## Automated release gate

- [x] `pnpm audit:all` passes on the release commit.
- [x] Static build contains every public route and no personal-state route.
- [x] Unit fixtures cover four primary patterns, modifiers, exclusions, premium fit, care reminder, migration, and deletion.
- [x] Playwright and axe pass at representative states and widths, locally and against the deployed preview.
- [x] Preview build is noindex with no canonical and an empty sitemap.
- [x] Live response headers, compression, caching, 404, robots, and preview crawler blocking are verified.

## Production owner gate

- [ ] Owner actions in `OWNER_ACTIONS.md` are complete.
- [ ] `pnpm owner:setup -- --check` passes.
- [ ] Final domain resolves to the exact tested artifact.
- [ ] Production pages are indexable, have correct self-canonicals, and appear in the sitemap.
- [ ] Privacy, terms, contact, review status, sources, and corrections are accurate.
- [ ] No medical-review, clinical-validation, product-test, ranking, traffic, or adoption claim has been added without evidence.
