# Accessibility observations from reference research

These are bounded observations, not conformance audits. Direct browser inspection used the accessibility tree and visual captures where available.

## Transferable evidence

- Cleanup.pictures exposed its upload trigger as a named button and made the whole drop zone a large target. Its active state exposed brush size as a slider and Clean as a button.
- Ray exposed its source as an editable text area, output controls as labeled switches/radios, and export as a named button. On mobile the inspector moved below the preview.
- Squoosh labeled sample choices, compression selectors, quality slider, download links and the before/after panels. Its privacy statement had meaningful text, not an icon alone.
- Excalidraw labeled most tools with names and shortcuts, communicated the browser-storage caveat in text, and transformed its main toolbar for mobile.
- Carbon exposed theme/language controls, a named code editor and export controls; the default sample makes the editable region understandable without an upload.
- IT-Tools used ordinary links for utilities and editable numeric fields for conversion. The mobile menu collapses visually.

## Cautions observed

- Several references expose icon-only buttons with missing or weak accessible names (notably portions of Shots and Cleanup.pictures).
- Readme.so’s mobile accessibility tree included the long Sections inventory even when the visual editor view hid that panel; hidden/off-canvas content must not remain in the reading or tab order.
- Transform.tools’ narrow view left the desktop directory visible while the editor overflowed to the right; reflow, not horizontal scrolling, is required.
- Canvas-first products can label the canvas but still leave the meaningful visual result difficult to interpret nonvisually. One Change Tonight must retain complete HTML explanations for every diagram/result.
- TinyPNG’s memorable visuals do not replace a nearby, explicit privacy statement; the current privacy retention answer sits deep in FAQ content.

## Requirements carried forward

Use native fieldset/legend and radio controls; move focus to the new question heading; announce progress and validation; keep Back before Continue in DOM order; preserve state; provide 44 px or larger targets; never encode state by color alone; support 320 px reflow, 200% zoom, reduced motion, visible focus in both themes, print output, and complete text equivalents for diagrams. Important result, safety, privacy and purchase-restraint content must never be hidden in tabs.
