# IT-Tools audit

Inspected 2026-09-07: mobile directory and temperature converter at 390 × 844; temperature converter at 1440 × 1000. No account, error or reset flow was exercised.

## First view and model

The homepage begins with navigation/search, a prominent donation card and an “All the tools” card directory. The first meaningful interaction is search or choosing a utility. It is a search-and-select directory, not a single-purpose tool. The number of visible actions is very high.

An individual route such as `/temperature-converter` changes the model to a simple form. A descriptive H1 and one-sentence explanation precede aligned editable fields. All derived units are visible at once, so accepted input and output relationship are immediate. No sign-up is required.

## Responsive behavior

Desktop keeps a very long category sidebar and global search beside a focused content column. Mobile collapses the sidebar and turns the converter into a clean single column with readable rows. The target utility remains obvious, although a donation control remains near the header. No horizontal overflow was observed in the tested converter.

## Trust, accessibility and content

Links use descriptive utility names and the tested fields were exposed as editable controls. Dark/light toggle and search were labeled. Privacy handling was not prominent on the tested route. Route-specific titles and ordinary crawlable links are useful, but the directory scale would be harmful for One Change Tonight.

## Transfer

- Use one stable route for each genuinely distinct user need.
- Make inputs and their consequence visibly related.
- Reuse a consistent component grammar across questions without showing the entire content taxonomy.

## Do not import

- Do not import the dense directory, favorites, developer taxonomy or persistent desktop sidebar.
- Do not place donation, commercial or community CTAs near a distressed user’s primary action.
- Do not display all possible environmental patterns as selectable “tools” before assessment.
