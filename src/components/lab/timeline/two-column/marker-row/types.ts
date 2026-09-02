import type * as React from 'react';
import type { HighlightedPaletteKey, TimelinePhase } from '../types';

/** Props for the `MarkerRow` internal sub-component. @internal */
export type MarkerRowProps = {
  /** The phase data for this marker. `variant` must be `'marker'`. */
  phase: TimelinePhase;
  /** Whether this is the last visible phase — suppresses the spine connector below. */
  isLastPhase: boolean;
  /** Resolved dot colour for this phase (accounts for overdue, done, and data colour). */
  dotColor: HighlightedPaletteKey;
  /** Whether this phase is marked done. */
  isDone: boolean;
  /** Whether the timeline is in interactive checklist mode. */
  checklist: boolean;
  /** Year boundary value shown on the spine connector, or `null` when no boundary exists. */
  yearLabelValue: string | null;
  /**
   * Whether the viewport is below the md breakpoint.
   *
   * When `true`, the left label slot is hidden via CSS (`markerLabelSlotSx('left') display.xs='none'`)
   * and the right slot also renders the label for `side='left'` phases — mirroring the
   * column-collapse behaviour of full phase cards on mobile. This ensures the label is
   * always visible regardless of viewport width.
   */
  isMobile: boolean;
} & React.HTMLAttributes<HTMLLIElement>;
