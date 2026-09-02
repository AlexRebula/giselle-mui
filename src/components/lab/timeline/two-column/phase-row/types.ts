import type * as React from 'react';
import type { ReactNode } from 'react';
import type { HighlightedPaletteKey, TimelinePhase } from '../types';

/** Props for the `PhaseRow` internal sub-component. @internal */
export type PhaseRowProps = {
  /** The phase data for this row. */
  phase: TimelinePhase;
  /** When `true`, this row should appear blurred/dimmed because another card is open. */
  isSuppressed: boolean;
  /** Gap (px) added below the phase card — passed through to `TimelineColumn`. */
  phaseCardGap: number;
  /** Pre-built phase card node — computed by the parent and passed through as a slot. */
  phaseCardNode: ReactNode;
  /** Resolved dot colour for this phase. */
  dotColor: HighlightedPaletteKey;
  /** Whether this phase is marked done. */
  isDone: boolean;
  /** Whether this is the last visible phase — suppresses the spine connector below. */
  isLastPhase: boolean;
  /** Year boundary value shown on the spine connector, or `null` when no boundary exists. */
  yearLabelValue: string | null;
  /** Bottom offset (px) of the year-boundary label chip — passed through to `SpineConnector`. */
  yearLabelMarginBottom: number;
  /** Whether the timeline is in interactive checklist mode. */
  checklist: boolean;
  /** Click handler for the phase dot — `undefined` in read-only mode. */
  dotClickAction: (() => void) | undefined;
  /** Keyboard handler for the phase dot — `undefined` in read-only mode. */
  dotKeyDownHandler: ((e: React.KeyboardEvent) => void) | undefined;
  /** Accessible label for the phase dot — `undefined` in read-only mode. */
  dotAriaLabel: string | undefined;
  /** Per-phase toggle counts — drives the pulse animation on the dot. */
  phaseToggleCounts: Record<string, number>;
  /** Controlled selected phase key — drives the active dot state. */
  selectedPhaseKey: number | undefined;
  /** Whether the viewport is below the md breakpoint — collapses to single-column layout. */
  isMobile: boolean;
};
