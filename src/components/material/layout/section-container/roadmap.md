# SectionContainer — Roadmap

> Last updated: 01 Sep 2026

## Status

`stable`

Fully audited. MUI `Container` with consistent vertical padding and optional title/subtitle slot.
As of 31 Aug 2026, actually consumed: `BasicSection` wraps its `children` in this
unconditionally (`containerMaxWidth`/`containerPy`/`containerSx` forward to it) — before
that, this component had zero real consumers despite being marked stable and fully
audited (its own README's claim that `TwoColumnShowcaseRow` used it was stale; that
component doesn't import `Container` at all).

## Open improvements

| Task | Priority | Status |
| ---- | -------- | ------ |

None.

## Known gaps

None.

## Completed

| Task                       | Completed   |
| -------------------------- | ----------- |
| Initial component shipped  | 13 May 2026 |
| Full cleanup audit (21/21) | 13 May 2026 |
| Extracted the root `py` sx to new section-container.styles.ts (giselle-mui#201) | 01 Sep 2026 |
