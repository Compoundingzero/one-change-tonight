# SEO and generative-search specification

Research and review date: 2026-09-07

## Outcome

Build one crawlable, people-first information system around the room–bed–timing–moisture–partner decision. Do not create a parallel “GEO content” layer. Google's current guidance says generative features use the core Search index and ordinary SEO quality systems; it explicitly warns against pages for every wording variation and says no special AI markup or `llms.txt` is required for Google Search ([Google's generative-search guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)).

For this health-adjacent product, search quality depends on four things:

1. direct usefulness for a tired person;
2. truthful scope, review status, evidence, and uncertainty;
3. stable crawl/index/canonical behavior;
4. an original decision tool and experiment method rather than rewritten cause lists.

The detailed research basis is in [query-map.csv](./research/query-map.csv), [serp-gap-analysis.md](./research/serp-gap-analysis.md), and [source-register.md](./research/source-register.md).

## Query and page strategy

The 25 required query families resolve to 19 canonical landing pages. The consolidation plan is intentional:

- “room is cold,” “AC is on,” and “I still wake hot/sweaty” variants share `/why/waking-sweaty-in-a-cold-room/`;
- “mattress hot” is addressed inside `/why/bed-hot-room-cool/` until evidence shows a distinct page job;
- “wife hot / husband cold” resolves to the inclusive `/why/hot-while-partner-is-cold/`;
- “quiet one-sided” is a noise-sensitive section of `/guides/how-to-cool-one-side-of-a-bed/`;
- first-touch versus all-night cooling remains separate from the failed-sheets page because it teaches a distinct mechanism.

Do not make state/city, age, gender-pairing, brand-versus-brand, or tiny wording-variant pages. Add language to the canonical page when Search Console reveals a variant; create a new URL only when it supports a genuinely different user decision and substantial original content.

## Search landing-page template

Every indexable guide/comparison should render the important content in static HTML in this order:

1. descriptive H1 that matches the page's decision job;
2. audience sentence without demographic exclusion;
3. truthful editorial review label and reviewed date;
4. direct answer in 1–3 sentences;
5. unresolved uncertainty in the same first content block;
6. medical boundary on health-adjacent pages;
7. observable “fits / may not fit” signals;
8. decision table or mechanism comparison;
9. one reversible experiment: change, constants, steps, morning record, stop conditions;
10. “Do Not Buy Yet” and centralized no-commission disclosure;
11. what the result does not establish;
12. assessment CTA with privacy statement;
13. descriptive internal next-question links;
14. visible source list, source type, and update date.

Do not bury the direct answer below biography, newsletter capture, ads, or a long definition. Do not copy query wording unnaturally through headings. Synonyms and natural phrasing are sufficient.

## Titles and descriptions

- Use one unique, literal title per canonical page. Lead with the user's question or comparison, then append the site name in the base layout.
- Keep descriptions specific to the decision and uncertainty; avoid “best,” “cure,” “stop,” “treat,” “diagnose,” “clinically proven,” and unsupported superlatives.
- Titles must not imply that a page can determine whether the user has menopause or why sweating occurs.
- Comparison titles name mechanisms, not brands. “Worth it” pages describe the decision gate and costs, not a winner.
- A reviewed date should change only after meaningful editorial/source review—not on every build.

## Trust and health-content requirements

This is YMYL-adjacent content even though the tool is intentionally nonmedical. Follow [Google's people-first content questions](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): original analysis, complete answers, clear authorship/site background, visible sources, and no easily verified errors.

Required:

- “Editorial evidence review completed. Not independently medically reviewed.” until a real named credentialed reviewer completes and approves a documented review.
- Organization/owner, editorial policy, methodology, medical boundary, privacy, corrections, contact, and source pages discoverable from content and footer.
- Health claims trace to government agencies, professional organizations, or appropriate peer-reviewed work.
- Manufacturer sources identified as specifications/claims, never independent efficacy evidence.
- No testimonials, clinician personas, advisory boards, clinical validation, or product testing unless real and documented.
- No recommendation, ranking, prescribing, or discouraging of medicines, supplements, hormone therapy, or clinician-directed care.
- Care pages link directly to current authoritative guidance and do not synthesize an improvised red-flag algorithm.

## Technical implementation: observed state

Read-only review of the repository on 2026-09-07 found:

- Astro static generation for public pages, with content collections and a small Preact assessment island.
- Unique titles/descriptions/paths checked by `scripts/audit-seo.ts`.
- Production-only absolute canonicals with normalized trailing slashes.
- Preview mode emits `noindex, nofollow, noarchive` and withholds production canonicals.
- Open Graph/Twitter metadata and JSON-LD are generated by `BaseLayout.astro`.
- Article pages pass publication/review dates; the tool uses accurate `WebApplication`/`LifestyleApplication` markup.
- A generated XML sitemap and human-readable sitemap exist.
- Static public answers do not depend on the assessment JavaScript.
- `robots.txt` has explicit Googlebot, Bingbot, OAI-SearchBot, GPTBot, and wildcard groups.

### Resolved indexing decision

- In a validated production build, `/tool/` is crawlable and indexable for all intended crawlers, has a stable self-canonical, and appears in the XML sitemap because its explanatory shell is useful static content.
- `/awake-and-hot/` remains reachable and crawlable but carries page-level `noindex`; it is omitted from the XML sitemap, allowing compliant crawlers to read the exclusion.
- Preview builds apply page-level `noindex, nofollow, noarchive`, omit canonicals, publish an empty sitemap, and use `Disallow: /` because preview discovery is never intended.
- Production sitemap `lastmod` appears only for entries with a meaningful reviewed date; undated core routes omit it rather than fabricating a universal modification time.
- The rendered-output audit checks this policy across every generated HTML file, `robots.txt`, and `sitemap.xml` in both preview-safe and production-configured modes.

### Ongoing technical rules

- Include only production-canonical, indexable, successful-200 URLs. Exclude `/awake-and-hot/`, 404, and previews.
- Keep one canonical scheme: HTTPS, production hostname, lowercase route, trailing slash, no answer/query state.
- Redirect alternate host/protocol and accidental duplicate paths at the platform edge where possible.
- Return genuine 404 status for unknown routes; do not soft-404 to the homepage.
- Keep assessment state out of query strings, fragments that generate alternate content URLs, server logs, and share URLs.
- Validate the built output, not just source templates, in Search Console URL Inspection and Rich Results Test.

Google's minimum technical eligibility is crawl access, a successful response, and indexable content; compliance never guarantees indexing ([technical requirements](https://developers.google.com/search/docs/essentials/technical)).

## JavaScript rendering policy

Google can render JavaScript, but static/server rendering is simpler and more robust ([JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)). Preserve these boundaries:

- public direct answers, comparisons, safety copy, sources, and internal links are static HTML;
- only assessment interaction, local state, check-ins, theme preference, and print preparation hydrate;
- result states are personal UI, not indexable URLs or pre-rendered doorway pages;
- no hash state should be treated as a distinct canonical page;
- provide a static explanation of the tool on `/tool/` even if scripting/storage is unavailable.

## Canonical and sitemap policy

Use self-referencing canonicals on all production indexable pages and link internally to the canonical form. Google treats redirects and `rel="canonical"` as strong signals and sitemap inclusion as weaker; align all three ([canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)).

The sitemap should:

- contain `/`, `/tool/`, core hubs/trust pages intended for search, and the 19 canonical query pages;
- use absolute production URLs;
- list each URL once;
- expose an accurate `lastmod` only for meaningful changes;
- be referenced from `robots.txt` and submitted in Search Console/Bing Webmaster Tools;
- remain a discovery hint, not a substitute for internal links ([sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)).

## Structured data

Use structured data to describe visible content accurately, not as a GEO hack. Google's current guide says there is no special generative-search schema and not to overfocus on markup.

Recommended graph:

- Home: `WebSite` + real `Organization` after owner identity is complete.
- Guides/comparisons: `Article` (or plain `WebPage` when authorship/date semantics are not truly article-like), with visible `headline/name`, `description`, `datePublished`, `dateModified`, organization author, canonical URL, and representative image where available.
- Tool: `WebApplication` with `applicationCategory: LifestyleApplication`; retain the explicit non-diagnostic description. Do not mark it as a `MedicalWebPage`, `MedicalDevice`, diagnostic tool, or treatment application.
- Breadcrumbs: add `BreadcrumbList` only when equivalent breadcrumbs are visible in the interface.

Do not add FAQ markup unless the page has a visible FAQ and the type is currently supported/appropriate. Do not add review, product, rating, physician, medical-clinic, or efficacy schema. Validate against [Google's supported structured-data gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery), and remember eligibility does not guarantee a rich result.

## Image discovery

Mechanism diagrams are more useful and more distinctive than stock photography. For every diagram:

- provide descriptive `alt` when the image contributes meaning and `alt=""` when decorative;
- repeat the essential explanation in adjacent HTML so the image is not the only source;
- use stable descriptive filenames and intrinsic dimensions to prevent layout shift;
- keep SVG text legible but do not rely on text inside the SVG as the only indexable explanation;
- provide high-quality social/preview images that do not imply a clinical product;
- state licensing/ownership for original assets where appropriate.

See [Google Images guidance](https://developers.google.com/search/docs/appearance/google-images).

## OpenAI and other AI discovery

[OpenAI's current publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq) separates discovery from training:

| Crawler/control      | Recommended production policy                      | Reason                                                                            |
| -------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------- |
| `OAI-SearchBot`      | Allow public indexable pages                       | Enables content to be discovered, summarized, cited, and linked in ChatGPT search |
| `GPTBot`             | Owner choice, centralized in config                | Controls potential training use separately from search discovery                  |
| Page-level `noindex` | Use on non-search experiences while allowing crawl | Lets eligible crawlers read the exclusion                                         |
| ARIA/semantic HTML   | Required for users; beneficial to browser agents   | Clear names, roles, states, landmarks, and visible labels aid both                |

Do not create `llms.txt` for Google visibility; Google explicitly says it neither helps nor harms there. Only add such a file if a named downstream consumer documents a real use and the owner accepts the maintenance burden.

## IndexNow and Bing

After the production hostname is owned and stable, the owner may generate an IndexNow key, host the UTF-8 key file on that host, and submit only added/updated/deleted canonical URLs. A 200 response confirms receipt, not indexing ([IndexNow documentation](https://www.indexnow.org/documentation)).

The required Bing Webmaster Guidelines URL was checked on 2026-09-07, but the research extractor returned no body text. Before launch, an owner should open it in a normal browser, verify the current rules, add the Bing verification token, and inspect sitemap/index coverage. Do not claim a completed Bing-guideline audit until that happens.

## Performance and page experience

Aim for the current Core Web Vitals “good” thresholds at the 75th percentile of mobile and desktop visits: LCP ≤2.5 seconds, INP ≤200 milliseconds, CLS ≤0.1 ([web.dev](https://web.dev/articles/vitals)).

Implementation priorities:

- keep public content static and the Preact island small;
- ensure the embedded homepage tool reserves its final layout before hydration;
- avoid remote font, ad, tag-manager, session-replay, and hero-image dependencies;
- set dimensions/aspect ratios for diagrams and social imagery;
- test low-end mobile CPU/network and both light/night first paint;
- distinguish lab checks from real-user field data; do not claim passing CWV until field data exists.

## Internal links

Follow [INTERNAL_LINK_MAP.md](./INTERNAL_LINK_MAP.md). Rules:

- use descriptive anchors that state the next question, not “read more”;
- every indexable query page links to `/tool/`, one broader concept, one next question, `/evidence/`, and care guidance where relevant;
- comparison pages link back to assessment/affected-area guidance before deeper commerce-adjacent pages;
- care pages link to each other and directly to current authoritative external sources;
- keep sitewide footer links for policy/trust, but do not rely on the footer as the only inbound link to an important page;
- run broken-link/orphan checks on built HTML.

## Measurement and privacy

Owner-controlled setup after production URL selection:

1. set the real production hostname and organization/legal/contact details;
2. verify Google Search Console and Bing Webmaster Tools;
3. submit the sitemap and inspect representative rendered/canonical URLs;
4. monitor query-to-page mapping, indexing, manual actions, CWV, and crawl errors;
5. annotate meaningful content/source releases.

Search Console and Webmaster Tools provide useful aggregate acquisition data without sending assessment answers. Do not add advertising pixels. Do not send question selections, pattern scores, result labels, frequency/new-worsening modifiers, experiment choices, care reminders, or local check-ins to analytics. Any future analytics plan requires a new privacy/data-flow review and updated disclosure before implementation.

## Update cadence

- Medical safety pages: monthly pre-launch, then at least quarterly and immediately after a named source changes.
- P0 search-result sample: quarterly in the primary locale/device.
- Product mechanism specifications/prices/policies: quarterly if published; otherwise avoid time-sensitive specifics.
- Technical search/AI crawler guidance: quarterly and before major launch/migration.
- Content `dateModified`: only after a meaningful reviewed change.
- Annual full consolidation/cannibalization review using real query/page data.

## Definition of SEO/GEO done

- Nineteen canonical pages cover all 25 families without doorway duplication.
- Each landing page answers immediately, states uncertainty, supplies a safe experiment, and links to evidence/care.
- Production canonicals, sitemap, robots, status codes, and noindex policy agree.
- `/tool/` has a deliberate crawl/index decision and no answer-bearing URL state.
- Structured data matches visible truth and passes syntax validation.
- OAI-SearchBot policy and independent GPTBot policy are implemented as the owner intends.
- No fabricated review, credentials, search volume, product testing, clinical claim, or commercial relationship appears.
- Built HTML passes link/SEO checks; accessibility and performance are tested on representative pages.
- Owner completes production identity, contact, jurisdiction, hostname, and webmaster verification.
