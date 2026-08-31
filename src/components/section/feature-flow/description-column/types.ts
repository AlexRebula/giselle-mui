import type { ReactNode } from 'react';

import type { FeatureFlowItem } from '../types';

// ----------------------------------------------------------------------

export interface FeatureFlowDescriptionColumnProps {
  caption?: string;
  title?: string;
  /** Gradient-accent word appended after `title`, rendered on its own span. */
  txtGradient?: string;
  description?: ReactNode;
  items: readonly FeatureFlowItem[];
  selectedItemIndex: number;
  activeItemIndex: number;
  expandedItemId: string | null;
  /** Fires on hover or focus of a row — makes it the previewed item. */
  onItemHover: (index: number) => void;
  /** Fires on click of an expandable row. */
  onItemSelect: (item: FeatureFlowItem, index: number) => void;
  /**
   * Resets the previewed item back to the last-selected one. Fires on
   * mouse-leave of the row group, or once keyboard focus truly leaves it
   * (not when it moves from one row to the next within it).
   */
  onLeave: () => void;
}
