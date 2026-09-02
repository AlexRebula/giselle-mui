import type { TimelinePhase } from '../../types';
import type { PhaseRange } from '../types';

/** Props for the `MiniGanttRuler` internal sub-component. @internal */
export type MiniGanttRulerProps = {
  axis: { min: number; max: number };
  conflictingPhases: TimelinePhase[];
  overrides: Map<number, PhaseRange>;
};
