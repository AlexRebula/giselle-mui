import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/** Header row: leading icon + title, laid out inline. */
export const itemDetailHeaderSlotSx: SxProps<Theme> = {
  alignItems: 'center',
};

/** The header icon's tint. */
export const itemDetailHeaderIconSx: SxProps<Theme> = {
  color: 'primary.main',
};

/**
 * The metrics grid: one column on mobile, up to `metricsCount` columns (max 3)
 * on `sm+`, so 1–2 metrics never stretch as wide as a 3-column row would.
 */
export const itemDetailMetricsGridSx = (metricsCount: number): SxProps<Theme> => ({
  display: 'grid',
  gap: 2,
  gridTemplateColumns: {
    xs: 'repeat(1, 1fr)',
    sm: `repeat(${Math.min(metricsCount, 3)}, 1fr)`,
  },
});

/** The long-description prose, when it falls back to plain body text. */
export const itemDetailLongDescriptionSx: SxProps<Theme> = {
  color: 'text.secondary',
  lineHeight: 1.8,
};
