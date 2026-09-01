# ScrollParallax — Roadmap

> Last updated: 01 Sep 2026

## Status

`stable`

Section hero scroll parallax component.

## Open improvements

| Task | Priority | Status |
| ---- | -------- | ------ |

None.

## Known gaps

None.

## Completed

| Task                      | Completed    |
| ------------------------- | ------------ |
| Initial component shipped | 16 May 2026  |
| Nested `animated-hero-heading` into its own subfolder per the Scenario A policy; added `forwardRef` + `...other` passthrough on the `<h1>` Box (it had neither before) since it is independently barrel-exported and gets the full standalone-adjacent treatment; moved its single-use `scroll-parallax-hero.animations.ts` content and `headingH1Sx`/`headingHighlightSx` sx out of the shared parent files into its own subfolder; added a dedicated README and stories file (giselle-mui#162) | 01 Sep 2026 |
