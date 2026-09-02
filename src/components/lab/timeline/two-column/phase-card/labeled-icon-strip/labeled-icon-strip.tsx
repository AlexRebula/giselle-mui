import type { LabeledIconStripProps } from './types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { labeledIconStripLabelSx, labeledIconStripWrapperSx } from './labeled-icon-strip.styles';

/**
 * A labelled group: an optional overline label above any icon/logo strip.
 * Handles the repeated pattern across platforms, clients, and projects.
 *
 * **Quality status (02 Sep 2026):** DoD 11/12 · Best practices 13/13 — SonarQube not verified
 */
export function LabeledIconStrip({ label, children }: LabeledIconStripProps) {
  return (
    <Box sx={labeledIconStripWrapperSx}>
      {label && (
        <Typography variant="overline" sx={labeledIconStripLabelSx}>
          {label}
        </Typography>
      )}
      {children}
    </Box>
  );
}
