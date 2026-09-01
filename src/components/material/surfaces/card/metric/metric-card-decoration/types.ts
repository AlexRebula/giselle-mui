import type { BoxProps } from '@mui/material/Box';

import type { MetricCardColor } from '../types';

// ----------------------------------------------------------------------

export interface MetricCardDecorationProps extends BoxProps {
  /**
   * Palette color used for the gradient fill.
   * @default 'primary'
   */
  color?: MetricCardColor;
}
