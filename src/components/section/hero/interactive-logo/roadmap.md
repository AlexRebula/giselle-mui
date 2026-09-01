# InteractiveLogo — Roadmap

> Last updated: 01 Sep 2026

## Status

`stable`

Section hero interactive logo component.

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
| Extracted `original-logo-layer.tsx`'s remaining inline sx (active-frame image) into a new `original-logo-layer.styles.ts`, since it has no counterpart in the other two layers (giselle-mui#201) | 01 Sep 2026 |
| Nested `portrait-layer`, `artistic-logo-layer`, `original-logo-layer` into their own subfolders per the Scenario A policy; added `forwardRef` + `displayName` to all three; moved each layer's single-use sx and `Props` type out of the shared parent files into its own subfolder (giselle-mui#162) | 01 Sep 2026 |
