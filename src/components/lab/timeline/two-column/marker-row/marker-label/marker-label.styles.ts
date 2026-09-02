import type { SxProps, Theme } from '@mui/material/styles';

/** Caption `Typography` for the left/right floating label in a marker row. */
export const markerCaptionSx: SxProps<Theme> = {
  color: 'text.secondary',
  fontWeight: 600,
  whiteSpace: 'nowrap',
};

/** Inline date `Box` span appended to a marker label. */
export const markerDateSpanSx: SxProps<Theme> = {
  ml: 0.75,
  fontWeight: 400,
  opacity: 0.7,
};
