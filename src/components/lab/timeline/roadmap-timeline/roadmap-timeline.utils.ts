import type { TimelineStep } from './types';

// ----------------------------------------------------------------------

/**
 * Resolves a step's `TimelineDot` color.
 *
 * `done=true` always returns `'success'` (green checkmark convention, shared
 * with `TimelineTwoColumn`'s `resolveCompactColor`). Falls back to `'primary'`
 * when no color is set.
 */
export function resolveStepColor(
  step: Pick<TimelineStep, 'color' | 'done'>
): NonNullable<TimelineStep['color']> {
  if (step.done) return 'success';
  return step.color ?? 'primary';
}
