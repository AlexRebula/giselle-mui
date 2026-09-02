import type { TimelineProps } from '@mui/lab/Timeline';

import type { ReactNode } from 'react';

// ----------------------------------------------------------------------

/**
 * A single flat step in a `RoadmapTimeline`.
 *
 * Unlike `TimelinePhase` (the nested `phases[]` → `milestones[]` data model
 * used by `TimelineTwoColumn`), `RoadmapTimeline` uses a flat `steps[]` array
 * with no nesting — one step, one entry, no milestones-within-phases.
 */
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
   * Icon to display in the `TimelineDot`.
   * `ReactNode` — consumer provides; the component never imports an icon library.
   */
  icon?: ReactNode;
  /**
   * Dot colour — follows the MUI palette key convention.
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  /** Whether this step has been completed. Affects dot and connector styling. */
  done?: boolean;
  /** Optional list of bullet-point detail strings shown below the description. */
  details?: string[];
  /**
   * Per-step override of which side the content renders on. Passed through to
   * this step's own `TimelineItem`, overriding the `RoadmapTimeline`-level
   * `position` prop for this one item — the same per-item override `@mui/lab`'s
   * own `TimelineItem` natively supports.
   */
  side?: 'left' | 'right';
  /**
   * If true, renders the step with a distinct "scenario" visual treatment
   * (dashed border, lighter opacity, label badge).
   */
  isScenario?: boolean;
  /** Label shown on the scenario badge, e.g. "Scenario A". */
  scenarioLabel?: string;
};

/**
 * Props for `RoadmapTimeline`.
 *
 * Deliberately straddles `docs/components/api-design-rules.md`'s Tier 2
 * (selective extension) and Tier 3 (composition props, data array):
 * `steps: TimelineStep[]` is the Tier 3 data-driven shape, but this component
 * still extends `@mui/lab`'s own `TimelineProps` (minus `children`, derived
 * from `steps`) — Tier 3's usual "do not extend a specific MUI base" is
 * intentionally not followed here, since `position`/`sx`/`className`/`classes`
 * passing through natively is the whole point of the "uses `@mui/lab` layout
 * props natively" design decision (see README.md).
 */
export interface RoadmapTimelineProps extends Omit<TimelineProps, 'children'> {
  /** The flat list of steps to render, in order. */
  steps: TimelineStep[];
}
