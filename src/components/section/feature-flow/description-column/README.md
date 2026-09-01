# FeatureFlowDescriptionColumn

## Why it exists

`FeatureFlowSection`'s description column renders an optional section title followed
by the list of `FeatureFlowItemRow`s, wiring each row's hover/focus/click callbacks to
index-based state the parent owns (`selectedItemIndex`, `activeItemIndex`,
`expandedItemId`). That composition and its focus-management logic (see
`onBlur` below) is worth isolating from `FeatureFlowSection`'s own render.

## Why it's split out

Matches `FeatureFlowImageColumn`'s own sub-component split for the opposite column —
`FeatureFlowSection` composes two independent column halves side by side, and each
gets its own tested unit rather than one large combined render function.

## Planned API

| Prop                | Type                              | Default | Description                                                            |
| -------------------- | ----------------------------------- | ------- | -------------------------------------------------------------------------- |
| `caption`            | `string`                            | —       | `SectionTitle`'s overline label.                                       |
| `title`              | `string`                            | —       | Section heading. When omitted, no `SectionTitle` renders at all.       |
| `txtGradient`        | `string`                            | —       | Gradient-accent word appended after `title`.                           |
| `description`        | `ReactNode`                         | —       | `SectionTitle`'s supporting copy.                                      |
| `items`              | `readonly FeatureFlowItem[]`        | —       | The rows to render.                                                    |
| `selectedItemIndex`  | `number`                            | —       | Index of the last-clicked item.                                        |
| `activeItemIndex`    | `number`                            | —       | Index of the currently-previewed item (hover or focus).                |
| `expandedItemId`     | `string \| null`                    | —       | `id` of the item whose detail panel is open, if any.                   |
| `onItemHover`        | `(index: number) => void`           | —       | Fires on hover or focus of a row.                                      |
| `onItemSelect`       | `(item, index) => void`             | —       | Fires on click of an expandable row.                                   |
| `onLeave`            | `() => void`                        | —       | Resets the previewed item once focus/hover truly leaves the row group. |

No `sx`, no `ref`, no passthrough props — see **Design decisions** below for why.

## Design decisions

- **Deliberately fragment-rooted — no `forwardRef`, no `sx`, no `...other`.** This
  component has exactly one call site (`feature-flow-section.tsx`), with a completely
  fixed prop list; nothing passes a `ref` or `sx` today, and nothing plausibly would.
  Its `SectionTitle` and row-list `Stack` are meant to flow directly into the parent's
  own `Grid` item as siblings — wrapping them in a single root would add API surface
  nobody uses and change how they sit in that grid cell for no benefit. Contrast with
  its siblings (`item-row`, `item-detail`, `highlight-carousel`, `image-column`), each
  a single positionable/stylable unit a caller might reasonably want to nudge via `sx`.
  If a second call site or a real styling need ever appears, that's the trigger to
  revisit this, not before (mirrors the codebase's own "don't promote speculatively"
  rule for shared components).
- **`onBlur` only resets on a real group-exit, not a within-group focus move.** Tab-ing
  from one row to the next fires a `blur` on the row losing focus before the `focus`
  event on the next one — checking `event.relatedTarget` against
  `event.currentTarget.contains(...)` distinguishes "focus moved to the next row in
  this group" (do nothing) from "focus left the group entirely" (reset).

## Phase

Phase: `Section` | Priority tier: `T2`

## File structure

```
src/components/section/feature-flow/description-column/
  feature-flow-description-column.tsx           : component
  feature-flow-description-column.test.ts        : unit tests
  feature-flow-description-column.styles.ts      : sx constants
  feature-flow-description-column.styles.test.ts : style assertions
  feature-flow-description-column.stories.tsx    : Storybook stories
  types.ts                                       : FeatureFlowDescriptionColumnProps
  index.ts                                       : barrel export
  README.md                                      : this file
  roadmap.md                                     : open improvements and completed tasks
```
