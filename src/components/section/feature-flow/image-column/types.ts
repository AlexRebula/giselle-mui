import type { StackProps } from '@mui/material/Stack';

import type { FeatureFlowImageRevealStyle } from '../types';

// Re-export — `FeatureFlowImageRevealStyle` lives in the parent's `types.ts`
// (it's used directly by the main component too, not just this sub-component)
// but stays importable from here since it's part of this prop's own type.
export type { FeatureFlowImageRevealStyle } from '../types';

// ----------------------------------------------------------------------

export interface FeatureFlowImageColumnProps extends Omit<StackProps, 'children'> {
  /** The src that should be fully visible right now. */
  activeSrc: string;
  /** In-flow src used purely to give the sticky column its natural height. */
  ghostSrc: string;
  /** Every src this column may ever show — all permanently mounted, crossfaded via opacity. */
  allSrcs: readonly string[];
  alt: string;
  /**
   * Scroll-progress-driven entrance transform, computed by `FeatureFlowSection`
   * from this column's own scroll-into-view position.
   * @default { opacity: 1, y: 0, scale: 1, filter: 'none' } — fully revealed, at rest
   */
  revealStyle?: FeatureFlowImageRevealStyle;
}
