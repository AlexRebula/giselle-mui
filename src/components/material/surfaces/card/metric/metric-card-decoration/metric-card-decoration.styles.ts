import type { SxProps, Theme } from '@mui/material/styles';

import { METRIC_CARD_DECORATION_SIZE } from './metric-card-decoration.const';

// ----------------------------------------------------------------------

/**
 * Rotated gradient rectangle decoration for `MetricCardDecoration`.
 *
 * @param color - MUI palette key for the gradient colour.
 */
export const metricCardDecorationSx =
  (color: string): SxProps<Theme> =>
  (theme) => ({
    top: -40,
    right: -56,
    width: METRIC_CARD_DECORATION_SIZE,
    height: METRIC_CARD_DECORATION_SIZE,
    opacity: 0.1,
    borderRadius: 4,
    position: 'absolute',
    transform: 'rotate(40deg)',
    background: `linear-gradient(to right, ${
      (theme.vars!.palette as unknown as Record<string, { main: string }>)[color]?.main
    }, transparent)`,
  });
