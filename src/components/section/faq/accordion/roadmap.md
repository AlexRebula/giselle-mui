# FaqSection — Roadmap

> Last updated: 01 Sep 2026

## Status

`stable`

Fully audited. FAQ accordion section with animated expand/collapse; exported from `/motion` subpath.

## Open improvements

| Task                                                                                      | Priority | Status |
| ----------------------------------------------------------------------------------------- | -------- | ------ |
| Remove deprecated `FaqAccordion` re-export alias in a future minor version bump           | Low      | ⬜     |

## Known gaps

- The `FaqAccordion` export alias is still present to avoid breaking consumers. It should be removed once a semver bump is appropriate.
- SonarQube has not been re-run against the four restructured sub-components since the 28 Aug 2026 nesting change.

## Completed

| Task                       | Completed   |
| -------------------------- | ----------- |
| Initial component shipped  | 13 May 2026 |
| Renamed `FaqAccordion` → `FaqSection` (alias kept for backward compat) | 13 May 2026 |
| Full cleanup audit (21/21) | 13 May 2026 |
| Nested `bottom-lines`, `top-lines`, `motion-viewport`, `accordion-svg` sub-components into their own subfolders per the Scenario A policy reversal; added `displayName` to all four, `forwardRef` to the two (`motion-viewport`, `accordion-svg`) with a single ref-bearing root (giselle-mui#164) | 28 Aug 2026 |
| Extracted remaining inline `sx` in `faq-accordion.tsx`, `top-lines/faq-top-lines.tsx`, and `bottom-lines/faq-bottom-lines.tsx` to their `.styles.ts` files under the zero-tolerance policy; created `bottom-lines/faq-bottom-lines.styles.ts` (new) and merged the top/bottom edge variants in it into single factories (giselle-mui#201) | 01 Sep 2026 |
