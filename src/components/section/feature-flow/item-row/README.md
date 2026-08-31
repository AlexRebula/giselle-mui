# FeatureFlowItemRow

## Why it exists

`FeatureFlowSection`'s description column renders a list of items, each needing the
same row markup (icon, title, description) and the same interaction contract (hover
and focus preview the item; click expands it, when it has expansion data). Extracting
this out of the parent's `.map()` loop keeps that markup and its accessibility/animation
behaviour in one tested place, instead of duplicated inline JSX.

## Why it's split out

An earlier version of `FeatureFlowSection` rendered two different element types for
this row — a real `ButtonBase` for items with expansion data, a plain `Box` for items
without — inline in the parent's `.map()`. That was both a real accessibility gap (see
`FeatureFlowItemButtonState.expandable`'s own docs: hovering/focusing _any_ row already
has a real effect, so a non-button element never made sense) and a duplication
candidate. Every row is now a real `ButtonBase` regardless, extracted into its own
component so that always-a-button behaviour is tested once.

## Planned API

| Prop          | Type             | Default | Description                                                              |
| ------------- | ---------------- | ------- | ------------------------------------------------------------------------ |
| `icon`        | `string`         | —       | Solar icon name, rendered at the row's leading edge.                     |
| `title`       | `string`         | —       | Row heading.                                                             |
| `description` | `string`         | —       | Row supporting copy.                                                     |
| `expandable`  | `boolean`        | —       | Gates the visual hover/press/selected/expanded treatment and `onSelect`. |
| `isSelected`  | `boolean`        | —       | Persistent: this is the last-clicked item.                               |
| `isActive`    | `boolean`        | —       | Transient: this is the currently-previewed item.                         |
| `isExpanded`  | `boolean`        | —       | This item's detail panel is currently open.                              |
| `onHover`     | `() => void`     | —       | Fires on mouse enter.                                                    |
| `onFocus`     | `() => void`     | —       | Fires on focus (keyboard equivalent of `onHover`).                       |
| `onSelect`    | `() => void`     | —       | Fires on click. Only wired when `expandable`.                            |
| `sx`          | `SxProps<Theme>` | —       | Merged with the row's own computed styles.                               |

Plus every other native `<button>` attribute (`className`, `disabled`, `data-*`,
`aria-*`, etc.) except `title`/`children` (repurposed above) and `onFocus`/`onClick`/
`onMouseEnter` (fully owned, driven by `onHover`/`onSelect` instead).

## Design decisions

- **Always a real `ButtonBase`, regardless of `expandable`.** Hovering or focusing any
  row already has a real effect (it drives what the image column shows) — a
  non-interactive element type never matched the actual behaviour. `expandable` only
  gates the _visual_ treatment and whether `onClick`/`aria-pressed` are wired (see #198).
- **Event handlers excluded wholesale from the passthrough type, not case-by-case.**
  `component={m.button}` gives the root framer-motion's own gesture/lifecycle
  signatures for several natively-named handlers (`onDrag*`, `onAnimationStart`, and
  more), which conflict with the native DOM event of the same name if a consumer's
  handler type flows through unfiltered. Rather than list conflicts as they're
  discovered, every `on*`-prefixed key is dropped from the extended native button
  props, then reintroduced explicitly only for the three this component actually needs
  (`onHover`, `onFocus`, `onSelect`) under different, non-colliding names.
- **The entrance slide distance collapses to `0` under `prefers-reduced-motion`**,
  mirroring the pattern already used by `FeatureFlowHighlightCarousel`'s own text
  slide — `useReducedMotion()` gates the `distance` option passed to `fade()`, rather
  than disabling the animation a different way per component.

## Phase

Phase: `Section` | Priority tier: `T2`

## File structure

```
src/components/section/feature-flow/item-row/
  feature-flow-item-row.tsx      : component
  feature-flow-item-row.test.ts  : unit tests
  feature-flow-item-row.styles.ts      : sx constants
  feature-flow-item-row.styles.test.ts : style assertions
  feature-flow-item-row.stories.tsx : Storybook stories
  types.ts                       : FeatureFlowItemRowProps
  index.ts                       : barrel export
  README.md                      : this file
  roadmap.md                     : open improvements and completed tasks
```
