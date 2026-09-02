import type { Task } from '../../types';

/** Props for the `CardDetailBullets` internal sub-component. @internal */
export type CardDetailBulletsProps = {
  /** Matches `aria-controls` on the parent Paper so screen readers wire the relationship. */
  id: string;
  details: Task[];
  in: boolean;
  /**
   * Done state keyed by task id (`String(task.key)`).
   * Implementations may also provide `idx-${n}` fallback keys for legacy list-index wiring.
   */
  taskDoneStates?: Record<string, boolean>;
  onToggleTask?: (taskIndex: number, done: boolean) => void;
};
