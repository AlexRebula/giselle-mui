# TimelineTwoColumn — Roadmap

> Last updated: 01 Sep 2026

## Status

`stable`

The flagship component of this library. Fully audited two-column phase/milestone timeline with sub-components `PhaseCard`, `MilestoneBadge`, `TimelineDot`, `SpineConnector`. Encodes non-obvious rules: column inversion, marker side semantics, done-dot colour enforcement, corner badge column-side positioning, WCAG eye-button accessibility, z-index stacking.

## Open improvements

| Task | Priority | Status |
| ---- | -------- | ------ |

None.

## Known gaps

None.

## Completed

| Task                                                              | Completed   |
| ----------------------------------------------------------------- | ----------- |
| Initial component shipped                                         | 13 May 2026 |
| Done-dot colour enforcement (green always, no grayscale override) | 13 May 2026 |
| Corner badge column-side positioning rule                         | 13 May 2026 |
| Eye button WCAG accessibility (aria-pressed, min 20px icon)       | 13 May 2026 |
| MilestoneBadge column alignment rule (left-column right-aligns)   | 13 May 2026 |
| Full cleanup audit (21/21)                                        | 13 May 2026 |
| Extracted remaining inline `sx` on the root compact/full view wrappers to a unified `timelineViewSlotSx` factory in `two-column.styles.ts` (#201) | 01 Sep 2026 |
