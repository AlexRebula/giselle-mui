import type { BoxProps } from '@mui/material/Box';

import type { FeatureFlowItem } from '../types';

// ----------------------------------------------------------------------

export interface FeatureFlowItemDetailProps extends Omit<BoxProps, 'children'> {
  item: FeatureFlowItem;
}
