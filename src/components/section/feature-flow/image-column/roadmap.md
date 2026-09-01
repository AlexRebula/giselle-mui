# FeatureFlowImageColumn: Component Roadmap

## Status

`stable`

Implemented: sticky positioning (md+), crossfade between all mounted sources,
scroll-linked entrance reveal transform, explicit `zIndex` so it paints correctly
against the detail panel (#193). Forwards native `Stack` attributes and merges a
caller `sx` array-safely.

## Open improvements

_None currently._

## Completed tasks

| Task                                                                                         | Completed   |
| ----------------------------------------------------------------------------------------------- | ----------- |
| Initial component shipped, as part of `FeatureFlowSection` (#155/PR #159)                       | 31 Aug 2026 |
| Explicit `zIndex` fix so the sticky image paints above the detail panel (#193)                  | 31 Aug 2026 |
| Brought to full compliance — README, roadmap, stories, own `.styles.ts` (#203)                  | 1 Sep 2026  |
| Inline `sx` extracted to `feature-flow-image-column.styles.ts` per the zero-tolerance policy    | 1 Sep 2026  |
