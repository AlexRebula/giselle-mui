import type { SxProps, Theme } from '@mui/material/styles';

import type { SectionContainerProps } from './types';

// ----------------------------------------------------------------------

/** Root `Container` — applies the section's vertical rhythm via `py`. */
export const sectionContainerSx = (py: SectionContainerProps['py']): SxProps<Theme> => ({
  py,
});
