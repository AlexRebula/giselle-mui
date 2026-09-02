import type { Milestone, MilestoneRowCtx } from '../types';

/** Props for the `MilestoneRow` internal sub-component. @internal */
export type MilestoneRowProps = {
  /** The milestone data to render. */
  ms: Milestone;
  /** Zero-based index of this milestone within its parent phase. */
  mi: number;
  /** Total number of milestones in the parent phase — used to compute vertical position. */
  totalMilestones: number;
  /** Shared context derived from the parent phase row. */
  ctx: MilestoneRowCtx;
  /** Whether the viewport is below the md breakpoint — collapses to single-column layout. */
  isMobile: boolean;
};
