import type { SxProps, Theme } from '@mui/material/styles';

import { FAQ_FLOAT_LINE_LEFT } from './faq-top-lines.const';

// ----------------------------------------------------------------------

/**
 * Stack of two decorative triangles in the top-left corner of the section.
 * Positioned absolutely relative to the motion viewport.
 */
export const topTriangleStackSx: SxProps<Theme> = {
  alignItems: 'center',
  top: 64,
  left: FAQ_FLOAT_LINE_LEFT,
  position: 'absolute',
  transform: 'translateX(-50%)',
};

/**
 * Smaller of the two stacked triangles — slightly reduced and more opaque.
 */
export const smallTriangleSx: SxProps<Theme> = {
  width: 30,
  height: 15,
  opacity: 0.24,
  position: 'static',
};

/**
 * Larger, primary triangle at the top of the stack — full default icon size,
 * faint opacity. Not unified with `smallTriangleSx` into a single factory:
 * the two differ in more than one dimension (size and opacity both change),
 * so a factory would just relocate two hardcoded branches rather than remove
 * duplication.
 */
export const primaryTriangleSx: SxProps<Theme> = {
  position: 'static',
  opacity: 0.12,
};

/**
 * Decorative vertical float line on the left edge, flush with the top of
 * the section at the shared `FAQ_FLOAT_LINE_LEFT` offset.
 */
export const verticalFloatLineSx: SxProps<Theme> = {
  top: 0,
  left: FAQ_FLOAT_LINE_LEFT,
};
