import type { SxProps, Theme } from '@mui/material/styles';
import type React from 'react';

import type { ShowcaseRowOrientation } from './types';

// ----------------------------------------------------------------------

/**
 * Root `Grid` container — mirrors `orientation` into the desktop
 * `flexDirection`; `xs` always stacks via the `'column'` fallback baked
 * into the media-query object regardless of `orientation`.
 */
export const showcaseRowRootSx = (orientation: ShowcaseRowOrientation): SxProps<Theme> => ({
  flexDirection: { xs: 'column', md: orientation },
});

/** Text column `Stack` — caps line length at a comfortable reading width. */
export const textColumnSx: SxProps<Theme> = {
  maxWidth: 520,
};

/** Overline label rendered above the text column's heading. */
export const overlineSx: SxProps<Theme> = {
  color: 'text.secondary',
};

/** Controls column `Grid` item — allows its content to shrink below intrinsic width. */
export const controlsGridItemSx: SxProps<Theme> = {
  minWidth: 0,
};

/**
 * Controls column `Stack` — aligns children per the `controlsAlign` prop
 * and fills the column width.
 */
export const controlsStackSx = (
  controlsAlign: React.CSSProperties['alignItems']
): SxProps<Theme> => ({
  alignItems: controlsAlign,
  width: 1,
  minWidth: 0,
});

/** Slot `Box` wrapping the `controls` node — full width, allows shrinking. */
export const controlsSlotSx: SxProps<Theme> = {
  width: 1,
  minWidth: 0,
};
