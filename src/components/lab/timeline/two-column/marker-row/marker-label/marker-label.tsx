import type { MarkerLabelProps } from './types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { markerCaptionSx, markerDateSpanSx } from './marker-label.styles';

// ----------------------------------------------------------------------

/**
 * Floating text label for a `variant='marker'` phase row.
 *
 * Renders a semi-bold caption with an optional inline date, separated by a middle dot.
 * Used in both the left and right label slots of `MarkerRow` — extracted to eliminate
 * duplicated JSX and ensure the label format is always consistent across both slots.
 *
 * **Quality status (02 Sep 2026):** DoD 12/12 · Best practices 13/13
 */
export function MarkerLabel({ title, date }: MarkerLabelProps) {
  return (
    <Typography variant="caption" sx={markerCaptionSx}>
      {title}
      {date && (
        <Box component="span" sx={markerDateSpanSx}>
          · {date}
        </Box>
      )}
    </Typography>
  );
}
