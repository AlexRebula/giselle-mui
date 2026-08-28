import type { StackProps } from '@mui/material/Stack';

// ----------------------------------------------------------------------

export interface FeatureFlowImageColumnProps extends Omit<StackProps, 'children'> {
  /** The src that should be fully visible right now. */
  activeSrc: string;
  /** In-flow src used purely to give the sticky column its natural height. */
  ghostSrc: string;
  /** Every src this column may ever show — all permanently mounted, crossfaded via opacity. */
  allSrcs: readonly string[];
  alt: string;
}
