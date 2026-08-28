import type { SxProps, Theme } from '@mui/material/styles';

import { channelAlpha } from '../../../../utils/theme/theme-utils/theme-utils';
import { FAQ_CONTENT_MAX_WIDTH } from './faq-accordion.const';

// ----------------------------------------------------------------------

/**
 * Wrapper box containing the scrollable accordion list.
 * Centred with a max-width cap and equal top/bottom margins.
 */
export const contentBoxSx: SxProps<Theme> = {
  mt: 8,
  gap: 1,
  mx: 'auto',
  maxWidth: FAQ_CONTENT_MAX_WIDTH,
  display: 'flex',
  mb: { xs: 5, md: 8 },
  flexDirection: 'column',
};

/**
 * Per-accordion item: hover + expanded state receive a subtle grey tint.
 * Uses the MUI v7 CSS-variable channel via `channelAlpha` to stay theme-aware.
 */
export const accordionItemSx: SxProps<Theme> = (theme) => ({
  transition: theme.transitions.create(['background-color'], {
    duration: theme.transitions.duration.shorter,
  }),
  py: 1,
  px: 2.5,
  border: 'none',
  borderRadius: 2,
  '&:hover': {
    bgcolor: channelAlpha('var(--mui-palette-grey-500Channel)', 0.08),
  },
  '&.MuiAccordion-expanded': {
    bgcolor: channelAlpha('var(--mui-palette-grey-500Channel)', 0.08),
  },
});

/**
 * Contact footer block: gradient background tinted with grey channel.
 */
export const contactSectionSx: SxProps<Theme> = {
  px: 3,
  py: 8,
  textAlign: 'center',
  background: `linear-gradient(to left, ${channelAlpha('var(--mui-palette-grey-500Channel)', 0.08)}, transparent)`,
};
