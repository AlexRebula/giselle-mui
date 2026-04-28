---
sidebar_position: 2
sidebar_label: 'RoadmapTimeline Plan'
---

# Timeline / Roadmap Component — Planning Notes

> **Status:** Planning phase. Not yet implemented.
> **Candidate component name:** `RoadmapTimeline`

---

## Variant architecture intent (Apr 2026)

The reference implementation in the private portfolio (`alexrebula`) has been split into focused sub-components — `PhaseCard`, `MilestoneBadge`, `SpineConnector`, `animations.ts` — all sharing a single `TimelinePhase` type as the data contract. This was done deliberately so that multiple layout variants can reuse the same card/badge primitives without forking the type or duplicating rendering logic.

Planned variants (portfolio → giselle-mui extraction candidates):

| Variant | giselle-mui candidate? | Blocker |
|---|---|---|
| `TimelineTwoColumn` (base, vertical alternating) | ✅ Yes | `varAlpha` + `Chip variant="soft"` (Minimals) must be replaced first |
| `TimelineHorizontal` (click/swipe, horizontal track) | ✅ Yes | Same Minimals blockers; no `framer-motion` needed |
| `TimelineCompact` (single-column, mobile/sidebar) | ✅ Yes | Cleanest — least Minimals surface |
| `TimelineAnimated` (Framer Motion + parallax) | ❌ No | `framer-motion` is not an allowed giselle-mui peer dep |

**The `TimelinePhase` type is the stable public API.** Extend additively (optional fields only). All variants accept `phases: TimelinePhase[]`.

---

## Why this component belongs in giselle-mui

A visually rich, alternating-side timeline is non-trivial to build correctly with
`@mui/lab` alone. The decisions about `done` state, scenario variants, icon rendering,
and responsive side-switching are easy to get wrong and worth encoding once for all
consumers. This is the same justification as every other component in this library.

**Reference implementation:** `alexrebula/src/sections/case-001/view.tsx` (private repo).
That file is the working source of truth for the visual pattern. The public component
will be rewritten from scratch — no code copied from the private repo.

---

## Required MUI peer dependencies

`@mui/lab` is needed for the Timeline primitives:

```ts
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import type { TimelineDotProps } from '@mui/lab/TimelineDot';
```

`@mui/lab` is part of the MUI ecosystem and is acceptable as a peer dependency in
`giselle-mui` under the zero-proprietary-dependencies rule.

---

## Step type design

```ts
export type TimelineStep = {
  /** Unique key — used as React key, also usable as anchor ID. */
  key: number | string;
  /** Short title shown in the main content area. */
  title: string;
  /** One-sentence description shown below the title. */
  description: string;
  /** Display date or date range, e.g. "28 Jun 2026" or "Jun–Aug 2026". */
  date: string;
  /**
   * Icon to display in the TimelineDot.
   * ReactNode — consumer provides; component never imports an icon library.
   */
  icon?: ReactNode;
  /**
   * Dot colour — follows MUI palette key convention.
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  /** Which side of the timeline the content appears on. */
  side: 'left' | 'right';
  /** Whether this step has been completed. Affects dot and connector styling. */
  done?: boolean;
  /** Optional list of bullet-point detail strings shown below the description. */
  details?: string[];
  /**
   * If true, renders the step with a distinct "scenario" visual treatment
   * (e.g. dashed border, lighter opacity, label badge).
   */
  isScenario?: boolean;
  /** Label shown on the scenario badge, e.g. "Scenario A". */
  scenarioLabel?: string;
};
```

**Why `ReactNode` for `icon`:** giselle-mui never imports an icon library internally.
The consumer is responsible for filling the icon slot — just like every other component
in this library. This follows the `ReactNode slots for icons and decoration` component rule.

**Why `isScenario` instead of `variant`:** Using a boolean flag is simpler and more
explicit for a two-state variant than a string enum. If more variants are needed later,
the type can be extended without a breaking change.

---

## `varAlpha` dependency

The component needs `varAlpha` for the scenario step background tint. Phase A of
`theming-roadmap.md` ships this as an internal utility:

```ts
import { varAlpha } from '../utils/theme';
```

Phase A is therefore a prerequisite for this component.

---

## Data workflow: MD → JSON → sections-api

The intended consumer workflow for a roadmap/timeline page:

```
1. Author writes timeline data in a structured JSON file:
   sections-api/roadmap/roadmap-data.ts

2. Factory function returns typed RoadmapProps:
   export function getRoadmapData(): RoadmapProps { return { steps: STEPS }; }

3. Page passes typed props to view:
   app/roadmap/page.tsx → sections/roadmap/view.tsx

4. View passes steps to RoadmapTimeline:
   <RoadmapTimeline steps={data.steps} />
```

There is no MD → JSON transformer in scope for v1. The consumer writes `TimelineStep[]`
directly in TypeScript. An MD → JSON transformer could be added later as a separate
utility package if the need arises across multiple consumer projects.

---

## Sections-api integration pattern

```ts
// sections-api/roadmap/types.ts
import type { TimelineStep } from '@alexrebula/giselle-mui';

export interface RoadmapSectionProps {
  title?: string;
  description?: string;
  steps: TimelineStep[];
}

// sections-api/roadmap/roadmap-data.ts
import type { RoadmapSectionProps } from './types';

const STEPS: TimelineStep[] = [
  {
    key: 1,
    title: 'Phase 1',
    description: 'Foundation work',
    date: 'Q1 2026',
    side: 'left',
    done: true,
    color: 'success',
  },
  // ...
];

export function getRoadmapData(): RoadmapSectionProps {
  return { steps: STEPS };
}
```

---

## File structure (when implemented)

```
src/components/roadmap-timeline/
  roadmap-timeline.tsx       — component + exported Props and TimelineStep interfaces
  index.ts                   — barrel
  README.md                  — why it exists, design decisions
  roadmap-timeline.test.ts   — Vitest unit tests
```

---

## Storybook story outline

```ts
// stories/RoadmapTimeline.stories.tsx
export default {
  title: 'Components/RoadmapTimeline',
  component: RoadmapTimeline,
  argTypes: {
    steps: { control: false },
    sx: { control: false },
  },
};

// Story: Default (mixed done/undone, with icons from @iconify/react)
// Story: AllDone
// Story: WithScenarios (isScenario steps mixed in)
// Story: SingleStep
```

---

## Related

- [theming-roadmap.md](./theming-roadmap.md) — Phase A (`varAlpha` utility) is a prerequisite
- [alexrebula docs/roadmap.md](../../rm/presentation/alexrebula/docs/roadmap.md) — milestone tracking
- `alexrebula/src/sections/ziga/view.tsx` — reference implementation (private repo, do not copy code)
