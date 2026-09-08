# Unscreen and current Canva audit

Inspected 2026-09-07. Direct observation: `https://unscreen.com` redirected to `https://www.canva.com/features/video-background-remover/`. The Canva landing page was inspected at 390 × 844 and its cookie notice was dismissed; no video was uploaded, no account was created and no Pro/editor/result state was entered.

## Current Canva flow — observed

The mobile page opens with Canva navigation, breadcrumbs and a large feature banner. The H1 is “Online Video Background Remover,” followed by a sentence explicitly naming Canva Pro and an Upload your video button. A link to upload requirements and the privacy policy sits immediately below the control. The first cookie notice initially obscured much of the H1/action.

Below the first action are related-tool links, three how-to steps, feature marketing, another upload CTA, FAQs, testimonials, many ecosystem links and a large footer. The current page is marketing/content-first around an upload entry, not the former standalone tool. The public steps describe upload, one-click removal within Tools and MP4 download, but those working states were not independently verified.

## Historic Unscreen — clearly historical evidence

The standalone interface no longer exists at its domain. Public historic material from the 2020 Product Hunt listing described “Remove video and GIF backgrounds 100% automatically”; a 2020 remove.bg/Kaleido announcement described picking a video or GIF and receiving the background-removed clip within seconds; formerly indexed Unscreen API documentation described submit, status and download stages. These sources support only a historic upload-first, automatically processed, output/download model. They do not establish current availability, current pricing, exact visual hierarchy, mobile behavior, error messages or present privacy behavior.

Historic sources:

- https://www.producthunt.com/products/unscreen
- https://www.remove.bg/fr/b/remove-video-backgrounds-100-automatically-with-unscreen
- https://www.unscreen.com/api.zst (formerly indexed material; root now redirects)

## Transfer

- Preserve the historic principle of a single obvious input leading to a concrete result.
- Put a specific data-handling link or statement beside the first action.
- Make completion stages understandable without requiring technical expertise.

## Do not import

- Do not pretend Unscreen is still a standalone live product.
- Do not import Canva’s large navigation, Pro gate, testimonials, repeated CTAs or cross-product ecosystem.
- Do not use upload language for personal answers or send health-adjacent answers to a server.
