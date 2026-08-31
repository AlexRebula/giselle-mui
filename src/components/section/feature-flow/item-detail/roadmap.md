# FeatureFlowItemDetail: Component Roadmap

## Status

`stable`

Implemented: always-mounted panel, owning its own enter/exit crossfade and cross-item
`layout` height transition. Forwards `ref` to the stable outer wrapper (distinct from
`onNodeRef`'s per-item content node), and its enter/exit slide distance respects
`prefers-reduced-motion`.

## Open improvements

_None currently._

## Completed tasks

| Task                                                                                                                   | Completed   |
| ---------------------------------------------------------------------------------------------------------------------- | ----------- |
| Extracted from `FeatureFlowSection`, always mounted, owns its own `AnimatePresence`/`layout`                           | 31 Aug 2026 |
| `forwardRef` restored, targeting the stable outer `m.div layout` wrapper                                               | 31 Aug 2026 |
| Enter/exit slide distance zeroes under `prefers-reduced-motion`                                                        | 31 Aug 2026 |
| Inline `sx` extracted to `feature-flow-item-detail.styles.ts` per the zero-tolerance sx policy (`cleanup-workflow.md`) | 31 Aug 2026 |
