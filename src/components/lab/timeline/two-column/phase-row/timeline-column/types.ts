import type { ReactNode } from 'react';

/** Props for the `TimelineColumn` internal layout component. @internal */
export type TimelineColumnProps = {
  /** Which physical column this is — determines padding direction and text alignment. */
  columnSide: 'left' | 'right';
  /**
   * Whether this column contains content for the current phase.
   * When false the column is hidden on mobile (`xs`) to avoid empty padding.
   * On desktop (`md+`) both columns always show.
   */
  hasContent: boolean;
  /**
   * Extra bottom padding (px) added below the card content.
   * Drives the consistent vertical gap between consecutive phase cards:
   * gap = bottomPadding + column top padding.
   */
  bottomPadding: number;
  children: ReactNode;
};
