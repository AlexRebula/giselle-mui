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

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `items` | `FeatureFlowItem[]` | — | The list of feature items rendered in the description column. |
| `image` | `FeatureFlowImage` | — | The sticky image column's source(s). |
| `caption` | `string` | — | Small label above the title. |
| `title` | `string` | — | Section heading. |
| `txtGradient` | `string` | — | Gradient-accent word appended after `title`. |
| `description` | `ReactNode` | — | Supporting copy below the title. |
| `layoutDirection` | `'left' \| 'right'` | `'left'` | Which side the description column renders on. |
| `columnSpacing` | `{ xs?: number; md?: number }` | — | Grid column spacing override. |
| `descriptionGridSize` | `{ xs?; md?; lg? }` | derived from `layoutDirection` | Description column grid size override. |
| `imageGridSize` | `{ xs?; md?; lg? }` | derived from `layoutDirection` | Image column grid size override. |
| `sx` | `SxProps<Theme>` | — | MUI sx forwarded to root. |

`FeatureFlowItem` fields: `id`, `icon`, `title`, `description`, `subtitle?`, `imgUrl?`,
`longDescription?`, `technologies?: { name: string; icon: string }[]`, `metrics?`,
`highlightCards?`, `ctaLabel?`, `ctaHref?`. An item with none of the "expansion" fields
set is rendered as non-interactive (no click affordance, no detail panel).

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

## Phase

Phase: `Section` | Priority tier: `T2`

## File structure

_Filled in when implementation begins._
