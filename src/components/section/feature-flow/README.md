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

| Prop                   | Type                                                              | Default                        | Description                                                                                                                                                                                                                                                  |
| ---------------------- | ----------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `items`                | `FeatureFlowItem[]`                                               | —                              | The list of feature items rendered in the description column.                                                                                                                                                                                                |
| `image`                | `FeatureFlowImage`                                                | —                              | The sticky image column's source(s).                                                                                                                                                                                                                         |
| `caption`              | `string`                                                          | —                              | Small label above the title.                                                                                                                                                                                                                                 |
| `title`                | `string`                                                          | —                              | Section heading.                                                                                                                                                                                                                                             |
| `txtGradient`          | `string`                                                          | —                              | Gradient-accent word appended after `title`.                                                                                                                                                                                                                 |
| `description`          | `ReactNode`                                                       | —                              | Supporting copy below the title.                                                                                                                                                                                                                             |
| `layoutDirection`      | `'left' \| 'right'`                                               | `'left'`                       | Which side the description column renders on.                                                                                                                                                                                                                |
| `columnSpacing`        | `{ xs?: number; md?: number }`                                    | —                              | Grid column spacing override.                                                                                                                                                                                                                                |
| `descriptionGridSize`  | `{ xs?; md?; lg? }`                                               | derived from `layoutDirection` | Description column grid size override.                                                                                                                                                                                                                       |
| `imageGridSize`        | `{ xs?; md?; lg? }`                                               | derived from `layoutDirection` | Image column grid size override.                                                                                                                                                                                                                             |
| `decoration`           | `boolean`                                                         | `true`                         | Renders `BasicSection`'s standard decorative frame around the whole section.                                                                                                                                                                                 |
| `renderRightPanel`     | `(item: FeatureFlowItem, isActiveExpanded: boolean) => ReactNode` | —                              | Overrides the image column entirely — e.g. a non-image, documentation-style right panel. Falls back to the built-in `FeatureFlowImageColumn` (driven by `image`) when omitted.                                                                               |
| `renderHighlightPanel` | `(item: FeatureFlowItem) => ReactNode`                            | —                              | Overrides the expanded detail panel's right column entirely — e.g. one `Accordion` per highlight card instead of the built-in one-at-a-time carousel. Falls back to `FeatureFlowHighlightCarousel` (gated on `highlightCards` being non-empty) when omitted. |
| `detailPanelColor`     | `'primary' \| 'secondary' \| 'info' \| 'success' \| 'warning' \| 'error' \| 'grey'` | `'primary'` | Palette colour the expanded detail panel's background/border-top are tinted with (`channelAlpha(mainChannel, …)`, same technique as `HeroSection`'s `color` prop) — `'grey'` gives a neutral tint that reads as part of the page instead of the brand colour. |
| `itemDetailSx`         | `SxProps<Theme>`                                                  | —                              | Merged onto the expanded detail panel's own root, after `detailPanelSx` — overrides anything `detailPanelColor` sets, or any other built-in style, without needing a full `renderHighlightPanel` override just to change the panel's own chrome.               |
| `sx`                   | `SxProps<Theme>`                                                  | —                              | MUI sx forwarded to root.                                                                                                                                                                                                                                    |

`FeatureFlowItem` fields: `id`, `icon`, `title`, `description`, `subtitle?`, `imgUrl?`,
`longDescription?`, `technologies?: { name: string; icon: string }[]`, `metrics?`,
`highlightCards?: FeatureFlowHighlightCard[]`. An item with none of the "expansion"
fields set is rendered as non-interactive (no click affordance, no detail panel).

`FeatureFlowHighlightCard` fields: `title`, `description`, `media?` (background image),
`href?` (rendered as a "Learn more" link) — deliberately generic, not marketing-specific:
this is any documentation content presented as a carousel slide, not just a highlight.

## Design decisions

- Tech icon resolution is the consumer's responsibility: each `technologies` entry
  carries its own `{ name, icon }` pair, so the component never owns an app-specific
  icon lookup map or asset directory.
- `renderHighlightPanel` is a render-prop, same rationale as `renderRightPanel`: a
  documentation consumer's own right-column content (e.g. an `Accordion` list) isn't
  tied to any particular data shape beyond `FeatureFlowItem` itself, so the consumer
  builds it from `item.highlightCards` directly rather than the component prescribing
  one fixed presentation for every consumer.
- The hover-step crossfade timing and the scroll-idle timeout are fixed internal
  constants, not configurable props — they are implementation details of the
  crossfade behaviour, not something a consumer should need to tune.
- Image preloading/prewarming (SSR `preload` hint + idle-time client prewarm) is
  always-on internal behaviour, not exposed as configuration.
- The floating sub-nav (`FloatingSubNav` from `components/material/navigation/floating-sub-nav`)
  is an existing, already-public giselle-mui component — this component consumes it
  rather than shipping its own duplicate.
- The highlight-card carousel, the sticky image column, the description column, and the
  expanded detail panel are internal sub-components colocated in this folder. They are
  not exported from the package barrel: they only make sense as part of
  `FeatureFlowSection` and are not reusable in isolation.
- `renderRightPanel` is a render-prop, not a plain `ReactNode` slot: the right column's
  content needs to react to which row is hovered/active/expanded, and that state lives
  inside `FeatureFlowSection` — a static node can't respond to it without the consumer
  re-deriving the same hover tracking this component already does.
- Scroll direction is tracked with a plain `window` scroll listener
  (`useScrollDirection` in `feature-flow-section.utils.ts`) rather than framer-motion's
  `useScroll`, keeping the scroll/idle state machine simple to unit test.

## Quality status — 02 Sep 2026

| Dimension              | Score | Open items |
| ---------------------- | ----- | ---------- |
| DoD (Scenario B)       | 18/22 | SonarQube not verified (no SonarQube tooling in this repo) · size-constant regression tests missing · not all six palette keys in stories · no Responsive story · previously noted: `feature-flow-section.const.ts`'s timing constants are intentionally not re-exported (fixed, not configurable) |
| Best practices         | 10/13 | No `Responsive` story · crossfade transitions don't respect `prefers-reduced-motion` · default story doesn't demonstrate the scroll-direction image swap (`scrollImages` unset) |

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

  description-column/                      : internal sub-component — title + interactive row list (presentational)
    feature-flow-description-column.tsx
    feature-flow-description-column.test.ts
    types.ts                               : FeatureFlowDescriptionColumnProps
    index.ts

  item-row/                                : internal sub-component — one row in the description column
    feature-flow-item-row.tsx
    feature-flow-item-row.test.ts
    types.ts                               : FeatureFlowItemRowProps
    index.ts

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
