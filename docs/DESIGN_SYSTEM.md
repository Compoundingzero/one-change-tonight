# Design system

The visual direction is calm editorial utility: warm paper-like light surfaces, ink/navy text, restrained teal action color, and a deep low-brightness palette. It is deliberately not clinical blue-white, wellness-pastel, glassmorphic, or patterned after any reference product.

Tokens in `src/styles/tokens.css` centralize color, spacing, readable widths, radii, shadows, and typography. System fonts avoid third-party requests and layout shift. Body text begins at a comfortable 17px with roughly 45–75-character lines. Controls have visible focus, text labels, and at least 44px touch height. Color never carries state alone.

Core primitives are the site header/footer, notice, review status, source list, article shell, question panel, answer card, result section, experiment card, comparison table, timeline, and diagram figure. Motion is short, nonessential, and removed under `prefers-reduced-motion`. Print rules remove navigation and controls while retaining result meaning, safety, and sources.
