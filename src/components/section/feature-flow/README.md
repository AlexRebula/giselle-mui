# FeatureFlowSection

## Why it exists

Marketing and portfolio home pages often need a scrollable list of feature/expertise
items paired with a sticky image column that reacts to hover and scroll, plus an
expandable detail panel per item (metrics, tech stack, highlight cards). Building this
from scratch means re-implementing scroll-direction detection, a hover-driven image
crossfade sequence, image preloading, and expand/collapse panel orchestration every time.

## Why it belongs in giselle-mui

The layout — item list, sticky crossfading image, click-to-expand detail panel, floating
sub-nav between expanded panels — is a generic content-presentation pattern, not tied to
any specific product's data model. All data enters through plain props (`items`, `image`);
the component owns no app-specific asset paths or icon lookup tables.

## Planned API

| Prop                  | Type                           | Default                        | Description                                                   |
| --------------------- | ------------------------------ | ------------------------------ | ------------------------------------------------------------- |
| `items`               | `FeatureFlowItem[]`            | —                              | The list of feature items rendered in the description column. |
| `image`               | `FeatureFlowImage`             | —                              | The sticky image column's source(s).                          |
| `caption`             | `string`                       | —                              | Small label above the title.                                  |
| `title`               | `string`                       | —                              | Section heading.                                              |
| `txtGradient`         | `string`                       | —                              | Gradient-accent word appended after `title`.                  |
| `description`         | `ReactNode`                    | —                              | Supporting copy below the title.                              |
| `layoutDirection`     | `'left' \| 'right'`            | `'left'`                       | Which side the description column renders on.                 |
| `columnSpacing`       | `{ xs?: number; md?: number }` | —                              | Grid column spacing override.                                 |
| `descriptionGridSize` | `{ xs?; md?; lg? }`            | derived from `layoutDirection` | Description column grid size override.                        |
| `imageGridSize`       | `{ xs?; md?; lg? }`            | derived from `layoutDirection` | Image column grid size override.                              |
| `sx`                  | `SxProps<Theme>`               | —                              | MUI sx forwarded to root.                                     |

`FeatureFlowItem` fields: `id`, `icon`, `title`, `description`, `subtitle?`, `imgUrl?`,
`longDescription?`, `technologies?: { name: string; icon: string }[]`, `metrics?`,
`highlightCards?`. An item with none of the "expansion" fields set is rendered as
non-interactive (no click affordance, no detail panel).

## Design decisions

- Tech icon resolution is the consumer's responsibility: each `technologies` entry
  carries its own `{ name, icon }` pair, so the component never owns an app-specific
  icon lookup map or asset directory.
- No per-item full-section override slot: the detail panel always renders from the
  item's own fields. This keeps the component's behaviour fully determined by props.
- The hover-step crossfade timing and the scroll-idle timeout are fixed internal
  constants, not configurable props — they are implementation details of the
  crossfade behaviour, not something a consumer should need to tune.
- Image preloading/prewarming (SSR `preload` hint + idle-time client prewarm) is
  always-on internal behaviour, not exposed as configuration.
- The floating sub-nav (`FloatingSubNav` from `components/material/navigation/floating-sub-nav`)
  is an existing, already-public giselle-mui component — this component consumes it
  rather than shipping its own duplicate.
- The highlight-card carousel, the sticky image column, and the expanded detail panel
  are internal sub-components colocated in this folder. They are not exported from the
  package barrel: they only make sense as part of `FeatureFlowSection` and are not
  reusable in isolation.
- Scroll direction is tracked with a plain `window` scroll listener
  (`useScrollDirection` in `feature-flow-section.utils.ts`) rather than framer-motion's
  `useScroll`, keeping the scroll/idle state machine simple to unit test.

## Quality status — 28 Aug 2026

| Dimension        | Score | Open items                                                                                                    |
| ---------------- | ----- | --------------------------------------------------------------------------------------------------------------- |
| DoD (Scenario B) | 19/20 | `feature-flow-section.const.ts`'s timing constants are intentionally not re-exported (fixed, not configurable) |
| Best practices   | 10/13 | No `Responsive` story · crossfade transitions don't respect `prefers-reduced-motion` · default story doesn't demonstrate the scroll-direction image swap (`scrollImages` unset) |

## Phase

Phase: `Section` | Priority tier: `T2`

## File structure

```
src/components/section/feature-flow/
  feature-flow-section.tsx                : public component — state orchestration, item list, detail panel wiring
  feature-flow-section.styles.ts           : shared style functions for this component
  feature-flow-section.styles.test.ts      : style-function tests
  feature-flow-section.const.ts            : fixed hover-step and scroll-idle timing constants
  feature-flow-section.utils.ts            : hasExpansionData, image preload/prewarm hooks, useScrollDirection
  feature-flow-section.stories.tsx         : Storybook stories
  feature-flow-section.test.ts             : unit tests for the main component
  types.ts                                 : public prop types, shared across sub-components
  index.ts                                 : barrel export (public API + sub-components)
  README.md                                : this file
  roadmap.md                               : open improvements and completed tasks

  image-column/                            : internal sub-component — sticky crossfading image column (presentational)
    feature-flow-image-column.tsx
    feature-flow-image-column.test.ts
    types.ts                               : FeatureFlowImageColumnProps
    index.ts

  item-detail/                             : internal sub-component — expanded detail panel (metrics, tech chips, highlight carousel)
    feature-flow-item-detail.tsx
    feature-flow-item-detail.test.ts
    types.ts                               : FeatureFlowItemDetailProps
    index.ts

  highlight-carousel/                      : internal sub-component — self-contained highlight-card carousel
    feature-flow-highlight-carousel.tsx
    feature-flow-highlight-carousel.test.ts
    types.ts                               : FeatureFlowHighlightCarouselProps
    index.ts
```

Each sub-component folder follows the nesting policy in `docs/components/cleanup-workflow.md`
Scenario A — the pattern established by `TimelineTwoColumn`'s `milestone-badge/`,
`phase-card/`, etc. Style factories used by a sub-component but not shared with
siblings remain in the parent's `feature-flow-section.styles.ts`.
