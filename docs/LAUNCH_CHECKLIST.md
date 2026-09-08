# Launch checklist

## Automated release gate

- [ ] `pnpm audit:all` passes on the exact commit.
- [ ] Static build contains every public route and no personal-state route.
- [ ] Unit fixtures cover four primary patterns, modifiers, exclusions, premium fit, care reminder, migration, and deletion.
- [ ] Playwright and axe pass at representative states and widths.
- [ ] Preview build is noindex with no canonical and an empty sitemap.
- [ ] Live response headers, compression, caching, 404, robots, and OAI-SearchBot behavior are verified.

## Production owner gate

- [ ] Owner actions in `OWNER_ACTIONS.md` are complete.
- [ ] `pnpm owner:setup -- --check` passes.
- [ ] Final domain resolves to the exact tested artifact.
- [ ] Production pages are indexable, have correct self-canonicals, and appear in the sitemap.
- [ ] Privacy, terms, contact, funding, review status, sources, and corrections are accurate.
- [ ] No medical-review, clinical-validation, product-test, ranking, traffic, or adoption claim has been added without evidence.
