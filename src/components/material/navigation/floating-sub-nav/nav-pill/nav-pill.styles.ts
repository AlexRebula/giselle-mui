import type { SxProps, Theme } from '@mui/material/styles';

import { channelAlpha } from '../../../../../utils/theme/theme-utils/theme-utils';

// Typed channel accessor helpers for palette entries not typed as Record<string, string>
const grey500Ch = (theme: Theme): string =>
  (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']!;
const blackCh = (theme: Theme): string =>
  (theme.vars!.palette.common as unknown as Record<string, string>)['blackChannel']!;

// ----------------------------------------------------------------------

/** Pill container — border, shadow, background. */
export const pillSx: SxProps<Theme> = (theme) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  p: 0.5,
  borderRadius: 2,
  bgcolor: 'background.paper',
  border: `1px solid ${channelAlpha(grey500Ch(theme), 0.14)}`,
  boxShadow: [
    `0 2px 8px 0 ${channelAlpha(grey500Ch(theme), 0.1)}`,
    `0 8px 32px -4px ${channelAlpha(grey500Ch(theme), 0.18)}`,
  ].join(', '),
  ...theme.applyStyles('dark', {
    border: `1px solid ${channelAlpha(grey500Ch(theme), 0.08)}`,
    boxShadow: `0 1px 4px 0 ${channelAlpha(blackCh(theme), 0.12)}`,
  }),
});
