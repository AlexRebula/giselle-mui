import type { BoxProps } from '@mui/material/Box';

import type { FeatureFlowItem } from '../types';

// ----------------------------------------------------------------------

export interface FeatureFlowItemDetailProps extends Omit<BoxProps, 'children'> {
  /**
   * The currently-expanded item, or `null` when none is expanded. This
   * component is always mounted — it owns its own enter/exit animation and
   * layout-height transition internally, rather than the parent
   * conditionally rendering it.
   */
  item: FeatureFlowItem | null;
  /**
   * Fires with the rendered panel's DOM node (and its item's id) once
   * mounted, and with `null` once it unmounts. Lets the parent scroll a
   * newly-expanded panel into view without holding a ref to this component
   * itself — there's no single stable root to ref, since which item is
   * showing changes over time and at most one is ever mounted.
   */
  onNodeRef?: (itemId: string, node: HTMLDivElement | null) => void;
}
