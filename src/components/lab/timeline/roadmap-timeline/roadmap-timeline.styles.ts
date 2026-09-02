import type { SxProps, Theme } from '@mui/material/styles';

import { channelAlpha } from '../../../../utils/theme/theme-utils/theme-utils';

// ----------------------------------------------------------------------
// Static sx — created once at module load

export const stepTitleRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  flexWrap: 'wrap',
};

export const stepTitleSx: SxProps<Theme> = {
  fontWeight: 600,
};

export const stepDateSx: SxProps<Theme> = {
  color: 'text.secondary',
};

export const stepDescriptionSx: SxProps<Theme> = {
  color: 'text.secondary',
  mt: 0.5,
};

export const stepDetailListSx: SxProps<Theme> = {
  m: 0,
  mt: 1,
  pl: 2.5,
  color: 'text.secondary',
};

export const stepDetailItemSx: SxProps<Theme> = {
  '&::marker': { color: 'text.disabled' },
};

// ----------------------------------------------------------------------
// Dynamic sx factories — accept resolved props, return SxProps

/**
 * `TimelineContent` sx factory.
 *
 * Scenario steps get a dashed-border, lightly-tinted card treatment
 * (per the "scenario visual treatment" design decision); regular steps
 * get plain padding with no decoration.
 *
 * SSR-safe: uses the CSS custom property string directly (no theme callback).
 */
export const stepContentSx = (isScenario: boolean): SxProps<Theme> =>
  isScenario
    ? {
        py: 1.5,
        px: 1.5,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: channelAlpha('var(--mui-palette-grey-500Channel)', 0.06),
      }
    : { py: 1.5 };

/**
 * Scenario label badge sx — small pill shown next to a scenario step's title.
 */
export const scenarioBadgeSx: SxProps<Theme> = {
  fontSize: '0.6875rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
  color: 'text.secondary',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 0.75,
  px: 0.75,
  py: 0.125,
};

/** Done steps fade slightly, matching the same convention used across the timeline family. */
export const stepOpacitySx = (done: boolean): SxProps<Theme> => ({
  opacity: done ? 0.72 : 1,
});
