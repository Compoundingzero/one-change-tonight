# Excalidraw audit

Inspected 2026-09-07 at 390 × 844 and 1440 × 1000. Empty-state teaching, toolbars, storage warning, optional account/collaboration links and undo/redo controls were observed. Drawing, collaboration and export completion were not exercised.

## First view and model

Excalidraw is an infinite canvas with toolbar and contextual inspector. The center teaches the empty state: drawings are saved in browser storage, storage can be cleared, and the user should save a file. Open, Help, Live collaboration and Sign up are visible but do not prevent drawing. On desktop, hand-drawn arrows point to the menu, shapes and help.

The canvas occupies almost the entire page. Controls are compact around its edges. Undo/redo are visible and disabled until applicable. A new user can start by choosing a labeled shape; expert shortcuts are shown without requiring them.

## Responsive behavior

At 390 px the shapes toolbar becomes a bottom dock and the menu/library remain in the corners. The central storage message stays readable. At 1440 px, contextual instructions use whitespace rather than additional panels. This is effective for creation but would be too open-ended for a tired decision task.

## Trust and accessibility

The storage caveat is unusually honest and placed before work. Most tools have accessible names and shortcut help. The meaningful artifact still lives in a visual canvas; “Drawing canvas” alone is not an equivalent description. Optional sign-up and paid collaboration are present but not gates.

## Transfer

- Explain local-storage benefits and limits at the moment they matter.
- Teach an empty state with brief contextual prompts.
- Keep actions reversible and preserve generous desktop whitespace.

## Do not import

- Do not import an infinite canvas, drawing toolbar, hand-drawn brand language or expert shortcuts.
- Do not make the user assemble their own medical-looking model.
- Do not rely on visual diagrams without complete HTML text equivalents.
