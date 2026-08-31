# FeatureFlowItemDetail

## Why it exists

`FeatureFlowSection` needs an expanded 2-column panel below the main grid whenever an
item with expansion data is clicked. That panel's markup (icon+title header, metrics
grid, long description, technology chips, highlight carousel), its own enter/exit
crossfade, and its cross-item layout-height transition are involved enough to warrant
their own tested component rather than living inline in the parent.

## Why it's split out

An always-mounted panel that owns its own `AnimatePresence` and `layout` transition
internally (rather than the parent conditionally rendering different children) is a
distinct unit of behaviour from the rest of `FeatureFlowSection` — extracting it keeps
that animation logic in one tested place.

## Planned API

| Prop        | Type                                                     | Default | Description                                                                        |
| ----------- | -------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------- |
| `item`      | `FeatureFlowItem \| null`                                | —       | The currently-expanded item, or `null` when none is expanded.                      |
| `onNodeRef` | `(itemId: string, node: HTMLDivElement \| null) => void` | —       | Fires with the inner per-item content node for scroll-into-view, on mount/unmount. |

Plus every other `BoxProps` attribute (`sx`, `className`, `data-*`, `aria-*`, etc.) via
`...other`, forwarded to the inner per-item content `Box`.

## Design decisions

- **Always mounted, regardless of `item`.** Owns its own `AnimatePresence` enter/exit
  crossfade and the outer `m.div layout` height transition between different items'
  panel heights, rather than the parent conditionally rendering it.
- **Deliberately not nested inside `FeatureFlowSection`'s `MotionViewport`/`BasicSection`
  tree** (see #193): framer-motion's `layout` prop keeps a persistent, non-`'none'`
  `transform` on that node even at rest, which makes it establish its own CSS stacking
  context. `FloatingSubNav`'s `zIndex: theme.zIndex.speedDial` would then only out-rank
  content _inside_ that context (like this panel) — it couldn't escape to out-rank the
  sticky image column, which lives entirely outside it. Rendering this as a sibling in
  the parent keeps it in the same stacking context as the image column, so
  `FloatingSubNav`'s explicit `zIndex` still wins where it needs to.
- **`ref` forwards to the outer `m.div layout` wrapper**, the one node that stays
  mounted regardless of which item (or none) is currently showing — distinct from
  `onNodeRef`, which targets the inner, per-item content `Box` and exists for a
  different purpose (scroll-into-view of whichever item is currently expanded). Both
  coexist: `ref` for the stable root, `onNodeRef` for the transient per-item content.
- **Entrance/exit slide distance collapses to `0` under `prefers-reduced-motion`**,
  matching the same pattern used by `FeatureFlowItemRow`'s own entrance slide and
  `FeatureFlowHighlightCarousel`'s text slide — `useReducedMotion()` gates the slide
  offset, rather than disabling the animation a different way per component.

## Phase

Phase: `Section` | Priority tier: `T2`

## File structure

```
src/components/section/feature-flow/item-detail/
  feature-flow-item-detail.tsx      : component
  feature-flow-item-detail.test.ts  : unit tests
  feature-flow-item-detail.styles.ts      : sx constants and factories
  feature-flow-item-detail.styles.test.ts : mock-theme assertions for style factories
  feature-flow-item-detail.stories.tsx : Storybook stories
  types.ts                          : FeatureFlowItemDetailProps
  index.ts                          : barrel export
  README.md                         : this file
  roadmap.md                        : open improvements and completed tasks
```
