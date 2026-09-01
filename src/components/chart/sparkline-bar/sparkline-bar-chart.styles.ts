import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Root `Box` — sized to the requested `width`/`height`, clipping any chart
 * overflow so the sparkline never bleeds into the surrounding stat tile.
 */
export const sparklineRootSx = (width: number, height: number): SxProps<Theme> => ({
  width,
  height,
  overflow: 'hidden',
});

/**
 * `Suspense` fallback shown while the ApexCharts bundle loads — matches the
 * root's own `width`/`height` so nothing shifts once the chart mounts.
 */
export const sparklineFallbackSx = (width: number, height: number): SxProps<Theme> => ({
  width,
  height,
});
