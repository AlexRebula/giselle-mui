import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/** The section title above the row list. */
export const descriptionColumnTitleSx: SxProps<Theme> = {
  mb: { xs: 5, md: 8 },
  textAlign: { xs: 'center', md: 'left' },
};

/** The row-list `Stack` — capped width so rows don't stretch full-column-width on wide viewports. */
export const descriptionColumnRowListSx: SxProps<Theme> = {
  maxWidth: { sm: 560, md: 400 },
  mx: { xs: 'auto', md: 'unset' },
};
