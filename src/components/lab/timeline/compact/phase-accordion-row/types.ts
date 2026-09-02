import type { TimelineMilestone, TimelinePhase } from '../../two-column/types';
import type { TimelineCompactProps } from '../types';

// ----------------------------------------------------------------------

export interface PhaseAccordionRowProps {
  phase: TimelinePhase;
  sortedMilestones: TimelineMilestone[];
  checklist: boolean;
  taskDoneMap: Record<string, boolean>;
  onTaskToggle: (phaseKey: number, milestoneIndex: number | null, taskIndex: number) => void;
  onMarkViewed?: TimelineCompactProps['onMarkViewed'];
  onTogglePhaseDone?: TimelineCompactProps['onTogglePhaseDone'];
  onToggleMilestoneDone?: TimelineCompactProps['onToggleMilestoneDone'];
  expandedPhaseKey: number | null;
  onToggleExpanded: (key: number) => void;
}
