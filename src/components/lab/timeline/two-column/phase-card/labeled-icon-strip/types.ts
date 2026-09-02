import type { ReactNode } from 'react';

/** Props for the `LabeledIconStrip` internal sub-component. @internal */
export type LabeledIconStripProps = {
  /** Optional overline label rendered above the strip. Omitted when undefined. */
  label?: string;
  children: ReactNode;
};
