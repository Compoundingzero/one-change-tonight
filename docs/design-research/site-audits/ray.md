# Ray audit

Inspected 2026-09-07 at 390 × 844 and 1440 × 1000. The default working sample, responsive inspector, editable source, switches/radios and export controls were observed. Export completion and errors were not exercised.

## First view and model

Ray opens directly into a live-preview workspace rather than a marketing page. A prepared code sample produces a recognizable output before the user types. The output sits at the center of a large calm field. On desktop, a narrow top bar carries About, Format Code and Export; a compact inspector sits below the preview.

The model is live preview plus inspector. Controls include theme, background, dark mode, line numbers, padding and language. Basic success requires understanding only the editable sample and Export; optional styling remains secondary.

## Responsive behavior

At 390 px the preview remains above the inspector, and the most important toggles form a compact bottom row. At 1440 px the same composition breathes rather than filling the screen with side panels. The initial editor took a brief moment to appear, during which the mobile view was almost entirely black.

## Trust, accessibility and content

The source appeared as an editable text area; options were labeled switches, radios and comboboxes. Export was named. No explicit privacy/local-processing promise was observed. The root page contains very little static explanatory content, which is adequate for a developer utility but insufficient for health-adjacent search entry.

## Transfer

- Make the selected experiment, not explanatory prose, the visual center.
- Keep optional controls physically separate and reveal them after the core output.
- Use whitespace on desktop instead of adding panels.

## Do not import

- Do not import the code-editor darkness, gradient preview, tiny inspector labels or developer-tool tone.
- Do not expose theme/customization controls before the user has a result.
- Do not reduce static purpose, limitations and evidence to Ray’s minimal level.
