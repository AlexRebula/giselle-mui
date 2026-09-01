import type { SxProps, Theme } from '@mui/material/styles';

import { channelAlpha } from '../../../../../utils/theme/theme-utils/theme-utils';
import { SUB_NAV_BUTTON_SIZE } from './sub-nav-button.const';

// Typed channel accessor helpers for palette entries not typed as Record<string, string>
const grey500Ch = (theme: Theme): string =>
  (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']!;

// ----------------------------------------------------------------------

/**
 * Button sx factory — encodes the active/idle/hover/active states.
 * Returns a new object per call; wrap in `useMemo` at the call site if needed.
 */
export const subNavButtonSx =
  (isActive: boolean): SxProps<Theme> =>
  (theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: SUB_NAV_BUTTON_SIZE,
    height: SUB_NAV_BUTTON_SIZE,
    p: 0,
    borderRadius: 1.5,
    border: `solid 1px transparent`,
    color: 'text.disabled',
    outline: 'none',
    transition: theme.transitions.create(
      ['background-color', 'box-shadow', 'border-color', 'color', 'opacity'],
      { duration: theme.transitions.duration.shorter }
    ),
    '&:focus-visible': {
      outline: `2px dashed ${theme.vars!.palette.primary.main}`,
      outlineOffset: 2,
    },
    '&:hover': {
      opacity: 0.72,
      color: 'text.primary',
      bgcolor: channelAlpha(grey500Ch(theme), 0.08),
    },
    '&:active': {
      opacity: 0.56,
      bgcolor: channelAlpha(grey500Ch(theme), 0.12),
    },
    ...(isActive && {
      color: 'primary.main',
      bgcolor: channelAlpha(theme.vars!.palette.primary.mainChannel, 0.08),
      borderColor: channelAlpha(theme.vars!.palette.primary.mainChannel, 0.24),
      '&:hover': {
        opacity: 1,
        bgcolor: channelAlpha(theme.vars!.palette.primary.mainChannel, 0.12),
      },
      '&:active': {
        opacity: 1,
        bgcolor: channelAlpha(theme.vars!.palette.primary.mainChannel, 0.16),
      },
    }),
  });
