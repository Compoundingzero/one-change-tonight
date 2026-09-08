# Source policy

Medical statements prioritize current government health services, major professional medical organizations, and peer-reviewed research. Search, accessibility, privacy, and platform behavior use first-party technical documentation. Access date, publication/update date when known, supported claims, and limitations are recorded.

Source hierarchy does not erase scope. A source about hot flashes cannot prove that a reader’s episode is a hot flash. A thermal-environment paper can support a bedding/room mechanism but not clinical treatment. Editorial experiments cite the internal method as editorial—not medical—evidence. Manufacturer material can describe a mechanism or specification only when clearly labeled; it cannot substantiate health effectiveness by itself.

Broken, materially changed, stale, contradicted, or withdrawn sources trigger review. Exact wording is paraphrased within copyright limits and direct links remain available on the source page.

`pnpm sources:check` follows each current external evidence URL, rejects broken responses, and flags redirects or publisher controls for editorial review. The 2026-09-07 release check resolved 15 of 16 URLs automatically; OpenAI's publisher FAQ returned HTTP 403 to the automated checker but was separately verified in an ordinary browser. Network availability and publisher bot policy can vary, so this review remains a separate, human-supervised release check rather than a deterministic build gate.
