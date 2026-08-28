import type { SxProps, Theme } from '@mui/material/styles';

import { channelAlpha } from '../../../utils/theme/theme-utils/theme-utils';

// ----------------------------------------------------------------------

const GREY_500_CHANNEL = 'var(--mui-palette-grey-500Channel)';
const COMMON_BLACK_CHANNEL = 'var(--mui-palette-common-blackChannel)';

// ----------------------------------------------------------------------

/** Root `<section>` — clips horizontal overflow without creating a scroll container. */
export const featureFlowRootSx: SxProps<Theme> = {
  overflowX: 'clip',
  position: 'relative',
  py: { xs: 10, md: 20 },
};

/**
 * The sticky image column's card — palette-tinted drop shadow, softened for dark mode.
 */
export const imageColumnCardSx: SxProps<Theme> = (theme) => ({
  top: 0,
  left: '50%',
  width: 720,
  maxWidth: '100%',
  borderRadius: 2,
  overflow: 'hidden',
  position: 'absolute',
  transform: 'translateX(-50%)',
  bgcolor: 'background.default',
  boxShadow: `-40px 40px 80px 0px ${channelAlpha(GREY_500_CHANNEL, 0.16)}`,
  ...theme.applyStyles('dark', {
    boxShadow: `-40px 40px 80px 0px ${channelAlpha(COMMON_BLACK_CHANNEL, 0.16)}`,
  }),
});

/** The expanded detail panel's tinted background + top border. */
export const detailPanelSx: SxProps<Theme> = {
  py: { xs: 6, md: 10 },
  overflow: 'hidden',
  position: 'relative',
  bgcolor: channelAlpha('var(--mui-palette-primary-mainChannel)', 0.04),
  borderTop: `1px solid ${channelAlpha('var(--mui-palette-primary-mainChannel)', 0.12)}`,
};

export type FeatureFlowItemButtonState = {
  isSelected: boolean;
  isActive: boolean;
  isExpanded: boolean;
  interactive: boolean;
};

/**
 * One item row in the description column.
 *
 * - `interactive: false` (no expansion data): quiet, no hover/press feedback, no cursor pointer.
 * - Non-selected, interactive: fades on hover; brightens fully when it's the hovered/active item.
 * - Selected (last-clicked) item: persistent elevated card, regardless of hover.
 * - Expanded item: a left inset accent shows its detail panel is open.
 */
export const featureFlowItemSx =
  ({ isSelected, isActive, isExpanded, interactive }: FeatureFlowItemButtonState): SxProps<Theme> =>
  (theme) => ({
    gap: 2,
    display: 'flex',
    alignItems: 'flex-start',
    textAlign: 'left',
    width: '100%',
    cursor: interactive ? 'pointer' : 'default',
    borderRadius: 1.5,
    py: 3,
    px: 2.5,
    border: 'solid 1px transparent',
    color: 'text.disabled',
    outline: 'none',
    transition: theme.transitions.create(
      ['background-color', 'box-shadow', 'border-color', 'opacity'],
      { duration: theme.transitions.duration.shorter }
    ),
    '&:focus-visible': {
      outline: `2px dashed ${theme.vars!.palette.primary.main}`,
      outlineOffset: 2,
    },
    ...(interactive &&
      !isSelected && {
        '&:hover': {
          opacity: 0.72,
          bgcolor: channelAlpha(GREY_500_CHANNEL, 0.08),
        },
        '&:active': {
          opacity: 0.56,
          bgcolor: channelAlpha(GREY_500_CHANNEL, 0.12),
        },
      }),
    ...(interactive &&
      !isSelected &&
      isActive && {
        opacity: 1,
      }),
    ...(interactive &&
      isSelected && {
        color: 'text.primary',
        bgcolor: 'background.paper',
        boxShadow: `-8px 8px 20px -4px ${channelAlpha(GREY_500_CHANNEL, 0.12)}`,
        '&:hover': {
          opacity: 1,
          boxShadow: `0 0 2px 0 ${channelAlpha(GREY_500_CHANNEL, 0.08)}, -8px 20px 40px -4px ${channelAlpha(GREY_500_CHANNEL, 0.24)}`,
        },
        ...theme.applyStyles('dark', {
          boxShadow: `-8px 8px 20px -4px ${channelAlpha(COMMON_BLACK_CHANNEL, 0.12)}`,
        }),
      }),
    ...(interactive &&
      isExpanded && {
        borderColor: channelAlpha('var(--mui-palette-primary-mainChannel)', 0.24),
        boxShadow: isSelected
          ? `inset 3px 0 0 ${theme.vars!.palette.primary.main}, -8px 8px 20px -4px ${channelAlpha(GREY_500_CHANNEL, 0.12)}`
          : `inset 3px 0 0 ${theme.vars!.palette.primary.main}`,
      }),
  });
