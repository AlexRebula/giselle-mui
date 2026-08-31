# FeatureFlowItemRow: Component Roadmap

## Status

`stable`

Implemented: always renders a real, focusable `ButtonBase`. `expandable` gates only the
visual hover/press/selected/expanded treatment and whether `onClick`/`aria-pressed` are
wired. Forwards native button attributes (except the handful repurposed or fully owned
by this component's own props) and merges a caller `sx` array-safely. Entrance slide
distance respects `prefers-reduced-motion`.

## Open improvements

_None currently._

## Completed tasks

| Task                                                                                                                          | Completed   |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Extracted from `FeatureFlowSection`'s inline `.map()` loop; every row a real `ButtonBase` regardless of expansion data (#198) | 31 Aug 2026 |
| `...other` passthrough (native button attributes, minus repurposed/owned ones) and array-safe `sx` merge                      | 31 Aug 2026 |
| Entrance slide distance zeroes under `prefers-reduced-motion`, matching `FeatureFlowHighlightCarousel`'s own pattern          | 31 Aug 2026 |
| Inline `sx` extracted to `feature-flow-item-row.styles.ts` per the zero-tolerance sx policy (`cleanup-workflow.md`)           | 31 Aug 2026 |
