import type { ReactNode } from 'react';
import type { HighlightedPaletteKey } from '../../types';

/** Props for the `CardDecoration` internal sub-component. @internal */
export type CardDecorationProps = {
  /** Effective palette key for the decoration colour (already resolved from phase.color). */
  color: HighlightedPaletteKey;
  /**
   * `true` when the phase is both overdue AND not yet done.
   * Switches the decoration and corner icon to the error (red) palette.
   */
  isOverduePending: boolean;
  /** Phase icon rendered in the corner. Accepts any ReactNode icon slot. */
  icon: ReactNode;
};
