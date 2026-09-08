# readme.so audit

Inspected 2026-09-07: landing and editor at 390 × 844; editor at 1440 × 1000. Section inventory, reset, editor, Preview/Raw and Download were observed. Download and completed custom README were not exercised.

## First view and model

The landing page is a compact marketing gate: one H1, one sentence, one Get Started button and a product screenshot. The tool itself is a section builder. On desktop it uses three columns: section selection/reordering, dark editor and rendered preview. A default Title and Description gives the user a usable start.

The first meaningful editor action is adding or selecting a section. Search and a Custom Section option reduce the cost of a long inventory. Reset and Download are obvious. Registration is not required.

## Responsive behavior

Desktop clearly connects assembly, editing and output. At 390 px, however, the editor filled most of the visible page as a dark, apparently blank region; the section builder moved behind a menu and the preview context was not immediately obvious. The accessibility tree still exposed the long Sections inventory, suggesting visually hidden content may remain in reading/navigation order.

## Trust, accessibility and content

Buttons and sections were largely named, and drag-to-reorder had a label. Reordering remains a potentially difficult interaction without a documented keyboard alternative. Privacy was not prominent. A floating donation widget competes with the small mobile editor. Preview/Raw tabs are reasonable for a developer artifact but not for One Change Tonight’s primary explanation.

## Transfer

- Build a complex whole from small understandable units.
- Keep a default starting point and a safe reset.
- Let a user see how selected pieces contribute to the final output.

## Do not import

- Do not require a Get Started marketing gate before the first question.
- Do not use three-pane editing, drag reordering, hidden mobile sidebars or dark code-editor surfaces.
- Do not hide important result meaning behind Preview/Raw-style tabs.
