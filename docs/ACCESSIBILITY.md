# Accessibility

Target: WCAG 2.2 AA. Semantic headings, landmarks, fieldsets, legends, radios, checkboxes, selects, lists, tables, links, and buttons carry the interaction. Each question supports keyboard operation, retains selection on Back, does not auto-submit, and receives programmatic focus at its legend. Progress and storage feedback are polite status updates.

The design supplies visible focus, 44px targets, readable line lengths, non-color selection cues, reduced-motion rules, high-contrast-aware borders, dark-theme contrast, alt text plus captions for diagrams, and print styles. Tables remain semantic and become horizontally scrollable or stacked only through CSS without losing relationships. No primary meaning is hover-only or hidden in tabs.

Automated axe coverage includes home, tool states, result/tracker, comparison, search article, awake flow, and privacy. Browser checks cover 320, 375, 430, 768, 1024, and 1440 widths plus overflow. Manual keyboard/DOM review is recorded in `QA_REPORT.md`. Physical-device and named-screen-reader sessions remain unverified until conducted by people with those environments.
