# Repository guide

- Preserve the comfort-tool boundary: never diagnose, infer menopause, prescribe, or call an experiment treatment.
- Keep assessment inputs, results, experiment IDs, and check-ins in the browser. Do not add outbound runtime requests without an explicit privacy redesign and review.
- Public explanatory content must remain statically rendered. No answer-combination URLs or indexable result states.
- Keep preview mode `noindex` with no canonical. Production must pass `src/config/site.ts` owner validation.
- Add health claims only with a registered authoritative source ID and explicit scope/uncertainty.
- Keep one change per experiment and visible stop conditions.
- Run `pnpm audit:all` before release. Do not weaken a gate to make it pass.
- Do not commit `.env*`, third-party research screenshots, or generated reports.
