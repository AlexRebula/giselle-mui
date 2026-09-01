import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

export type SectionCaptionProps = Omit<BoxProps, 'title'> & {
  /** Overline label text. */
  title: ReactNode;
};
