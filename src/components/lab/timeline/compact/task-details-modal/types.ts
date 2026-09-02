import type { Task } from '../../two-column/types';

// ----------------------------------------------------------------------

export interface TaskDetailsModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  checklist?: boolean;
  /** Index-based done state array — position `i` maps to the task at index `i`. Use `Record<string, boolean>` shape for keyed components like `MilestoneBadge`. */
  taskDoneState?: boolean[];
  onTaskToggle?: (taskIdx: number) => void;
}
