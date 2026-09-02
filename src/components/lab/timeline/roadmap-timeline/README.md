# RoadmapTimeline

## Why it exists

A lightweight, single-column timeline for roadmap pages, changelogs, and documentation
sites — the kind of thing you drop into a Docusaurus page beside prose. Building an
accessible, correctly-styled timeline with `@mui/lab`'s primitives alone (`Timeline` +
`TimelineItem` + `TimelineSeparator` + `TimelineConnector` + `TimelineContent` +
`TimelineDot`) is easy to get subtly wrong — dot colour resolution, done-state styling,
scenario variants, and connector placement are worth encoding once for every consumer.

## Why it belongs in giselle-mui

`RoadmapTimeline` and `TimelineTwoColumn` (`../two-column/`) solve different problems at
different scales, but both are timeline variants a consumer would otherwise hand-roll
per project. `TimelineTwoColumn` is the full-featured, two-column, nested-data showcase
component; `RoadmapTimeline` is the flat, single-column, `@mui/lab`-native counterpart
for supplementary/documentation contexts. See
[`docs/components/timeline/two-column/timeline-plan.md`](../../../../../../docs/components/timeline/two-column/timeline-plan.md)
for the full "why two timeline components" rationale.

**The deciding question:** if the timeline _is_ the page, use `TimelineTwoColumn`. If
the timeline is _on_ a page — supplementary context beside prose, a changelog, a simple
product roadmap — use `RoadmapTimeline`.

## Planned API

| Prop       | Type              | Default   | Description                                              |
| ---------- | ----------------- | --------- | ---------------------------------------------------------- |
| `steps`    | `TimelineStep[]`  | —         | The flat list of steps to render, in order.                 |
| `position` | `TimelineProps['position']` | `'right'` | Inherited from `@mui/lab`'s `Timeline` — passes through natively. |
| `sx`       | `SxProps<Theme>`  | —         | MUI sx forwarded to root.                                    |

`TimelineStep` fields: `key`, `title`, `description`, `date`, `icon?`, `color?`, `done?`,
`details?`, `side?`, `isScenario?`, `scenarioLabel?` — see `types.ts` for full JSDoc.

## Design decisions

- **Flat data model, no nesting.** Unlike `TimelinePhase` (`phases[]` → `milestones[]`),
  `TimelineStep` is a flat array. No milestones-within-phases — that belongs to
  `TimelineTwoColumn`.
- **`ReactNode` for `icon`.** giselle-mui never imports an icon library internally; the
  consumer fills the icon slot, matching every other component in this library.
- **`isScenario: boolean` instead of a `variant` string.** Simpler and more explicit for
  a two-state variant. Extensible additively later without a breaking change if more
  variants are needed.
- **Extends `@mui/lab`'s own `TimelineProps`** (minus `children`, derived from `steps`)
  rather than defining a parallel `position`-like prop — `position`, `sx`, `className`,
  and `classes` all pass through natively.
- **`TimelineStep.side` overrides per-item, not a parallel mechanism.** Passed straight
  to that step's own `TimelineItem`'s native `position` prop. Verified against `@mui/lab`'s
  own source (`TimelineItem.js`): `position: positionProp || positionContext || 'right'` —
  a per-item `position` cleanly overrides the root `Timeline`'s context-provided default
  with no conflict, exactly the mechanism `@mui/lab` ships this feature for.
- **`channelAlpha` for the scenario tint** — already shipped from
  `src/utils/theme/theme-utils/theme-utils.ts` (Phase A, 4 May 2026); no new utility
  dependency introduced.

## Phase

Phase: `roadmap` (per `docs/components/timeline/two-column/timeline-plan.md`'s planned-variants table) | Priority tier: T2

## File structure

```
src/components/lab/timeline/roadmap-timeline/
  roadmap-timeline.tsx             — component
  roadmap-timeline.styles.ts       — sx constants and factories
  roadmap-timeline.styles.test.ts  — style tests
  roadmap-timeline.utils.ts        — resolveStepColor pure helper
  roadmap-timeline.utils.test.ts   — util tests
  roadmap-timeline.test.ts         — component tests
  roadmap-timeline.stories.tsx     — Storybook stories
  types.ts                         — TimelineStep, RoadmapTimelineProps
  index.ts                         — barrel
  README.md                        — this file
  roadmap.md                       — open improvements and completed tasks
  __fixtures__/roadmap-timeline.fixtures.ts — Storybook demo data
```

## Quality status — 03 Sep 2026

| Dimension        | Score | Open items                                                      |
| ----------------- | ----- | ----------------------------------------------------------------- |
| DoD (Scenario B)  | 20/22 | SonarQube not run (no tool in this environment) · consuming-app validation not performed |
| Best practices    | not re-audited | — |

## Related

- [`../two-column/`](../two-column/README.md) — `TimelineTwoColumn`, the showcase counterpart
- [`docs/components/timeline/two-column/timeline-plan.md`](../../../../../../docs/components/timeline/two-column/timeline-plan.md) — full planning notes
