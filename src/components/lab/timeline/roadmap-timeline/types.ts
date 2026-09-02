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
 * Extends `@mui/lab`'s own `TimelineProps` (minus `children`, which this
 * component derives from `steps`) — `position`, `sx`, `className`, and
 * `classes` all pass through natively to the underlying `Timeline` root,
 * per the "uses `@mui/lab` layout props natively" design decision.
 */
export interface RoadmapTimelineProps extends Omit<TimelineProps, 'children'> {
  /** The flat list of steps to render, in order. */
  steps: TimelineStep[];
}
