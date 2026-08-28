import type { Theme, CSSObject } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Base decoration styles for float SVG elements.
 * Only visible at ≥1440 px — purely decorative, hidden on narrower viewports.
 */
export const floatDecorationBase = (theme: Theme): CSSObject => ({
  zIndex: 2,
  display: 'none',
  color: 'grey.500',
  position: 'absolute',
  '& line': { strokeDasharray: 3, stroke: 'currentColor' },
  '& path': { fill: 'currentColor', stroke: 'currentColor' },
  [theme.breakpoints.up(1440)]: { display: 'block' },
});
