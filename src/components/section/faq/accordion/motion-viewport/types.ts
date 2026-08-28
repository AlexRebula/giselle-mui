import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/** @internal Props for the scroll-triggered animation container used by `FaqSection`. */
export type FaqMotionViewportProps = {
  children: ReactNode;
  sx?: SxProps<Theme>;
};
