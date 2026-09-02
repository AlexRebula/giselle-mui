import type { BoxProps } from '@mui/material/Box';

import type { ReactNode } from 'react';

import type { Task } from '../../two-column/types';

// ----------------------------------------------------------------------

export interface TaskDetailsRendererProps extends BoxProps {
  task: Task;
  checklist?: boolean;
  /** Index-based done state array — position `i` maps to the task at index `i`. Use `Record<string, boolean>` shape for keyed components like `MilestoneBadge`. */
  taskDoneState?: boolean[];
  onTaskToggle?: (taskIdx: number) => void;
  emptyState?: ReactNode;
}
