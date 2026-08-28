import type { BoxProps } from '@mui/material/Box';

import type { FeatureFlowHighlightCard } from '../types';

// ----------------------------------------------------------------------

export interface FeatureFlowHighlightCarouselProps extends Omit<BoxProps, 'children'> {
  cards: readonly FeatureFlowHighlightCard[];
}
