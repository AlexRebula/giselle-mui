import type { SxProps, Theme } from '@mui/material/styles';

import { channelAlpha } from '../../../utils/theme/theme-utils/theme-utils';

// ----------------------------------------------------------------------

const COMMON_BLACK_CHANNEL = 'var(--mui-palette-common-blackChannel)';
const COMMON_WHITE_CHANNEL = 'var(--mui-palette-common-whiteChannel)';

export const HIGHLIGHT_CAROUSEL_HEIGHT = 570;

export const highlightCarouselRootSx: SxProps<Theme> = {
  position: 'relative',
  height: HIGHLIGHT_CAROUSEL_HEIGHT,
  borderRadius: 2,
  overflow: 'hidden',
};

/** Absolutely-stacked slide image: crossfades via opacity, never slides. */
export const highlightSlideImageSx = (isActive: boolean): SxProps<Theme> => ({
  position: 'absolute',
  inset: 0,
  width: 1,
  height: 1,
  objectFit: 'cover',
  objectPosition: 'center top',
  opacity: isActive ? 1 : 0,
  transition: 'opacity 0.5s ease',
});

/** Fixed gradient scrim — sits above the images, never slides. */
export const highlightScrimSx: SxProps<Theme> = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background: `linear-gradient(to top, ${channelAlpha(COMMON_BLACK_CHANNEL, 1)} 0%, ${channelAlpha(COMMON_BLACK_CHANNEL, 0.5)} 40%, transparent 69%)`,
};

export const highlightTextSlotSx: SxProps<Theme> = {
  position: 'relative',
  height: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  px: { xs: 3, md: 4 },
  pb: { xs: 3, md: 4 },
  color: 'common.white',
};

export const highlightControlsRowSx: SxProps<Theme> = {
  position: 'absolute',
  top: 16,
  right: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

/** Detail text under the headline — slightly translucent white, matches the scrim's dark backdrop. */
export const highlightDetailTextSx: SxProps<Theme> = {
  color: channelAlpha(COMMON_WHITE_CHANNEL, 0.9),
  lineHeight: 1.7,
};

export const highlightIndexLabelSx: SxProps<Theme> = {
  color: 'common.white',
  minWidth: 32,
  textAlign: 'center',
};

/** Prev/next arrow buttons — translucent white pill over the dark scrim. */
export const highlightArrowButtonSx: SxProps<Theme> = {
  color: 'common.white',
  bgcolor: channelAlpha(COMMON_WHITE_CHANNEL, 0.12),
};
