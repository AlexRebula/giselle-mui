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
