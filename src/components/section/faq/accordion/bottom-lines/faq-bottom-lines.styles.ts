import type { SxProps, Theme } from '@mui/material/styles';

import { FAQ_PLUS_ICON_LEFT } from './faq-bottom-lines.const';

// ----------------------------------------------------------------------

/**
 * Pins a `FaqFloatLine` flush with the left edge, at either the top or
 * bottom of the section.
 *
 * **Unified into a factory:** the top and bottom variants were two
 * near-identical constants differing only in which edge carries the `0`
 * offset. Follows the same left/right-factory pattern as `timelineColumnSx`
 * and `markerLabelSlotSx` in `two-column.styles.ts`.
 *
 * @param edge - `'top'` or `'bottom'`.
 */
export const floatLineEdgeSx = (edge: 'top' | 'bottom'): SxProps<Theme> => ({
  ...(edge === 'top' ? { top: 0 } : { bottom: 0 }),
  left: 0,
});

/**
 * Pins a `FaqFloatPlusIcon` near the top or bottom edge, offset 8px so it
 * straddles the boundary, at the shared `FAQ_PLUS_ICON_LEFT` inset.
 *
 * **Unified into a factory:** same reasoning as `floatLineEdgeSx` above —
 * the top and bottom variants differ only by which edge carries the offset.
 *
 * @param edge - `'top'` or `'bottom'`.
 */
export const floatPlusIconEdgeSx = (edge: 'top' | 'bottom'): SxProps<Theme> => ({
  ...(edge === 'top' ? { top: -8 } : { bottom: -8 }),
  left: FAQ_PLUS_ICON_LEFT,
});
