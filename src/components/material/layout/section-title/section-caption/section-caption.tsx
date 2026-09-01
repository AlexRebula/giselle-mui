import React from 'react';

import Box from '@mui/material/Box';

import { sectionCaptionSx } from './section-caption.styles';
import type { SectionCaptionProps } from './types';

// ----------------------------------------------------------------------

/**
 * `SectionCaption` renders the overline label above the section heading.
 * Exported so consumers can use it standalone when they need just the overline.
 *
 * **Quality status (13 May 2026):** DoD 9/9 · Best practices 13/13
 */
export const SectionCaption = React.forwardRef<HTMLSpanElement, SectionCaptionProps>(
  function SectionCaption({ title, sx, ...other }, ref) {
    return (
      <Box
        ref={ref}
        component="span"
        sx={[sectionCaptionSx, ...(Array.isArray(sx) ? sx : [sx])]}
        {...other}
      >
        {title}
      </Box>
    );
  }
);

SectionCaption.displayName = 'SectionCaption';
