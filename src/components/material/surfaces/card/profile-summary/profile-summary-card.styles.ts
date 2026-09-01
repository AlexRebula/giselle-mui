import type { SxProps, Theme } from '@mui/material/styles';

/** Root `Paper` — centred padding for the avatar/name/role/stats stack. */
export const profileSummaryCardPaperSx: SxProps<Theme> = {
  p: 3,
  textAlign: 'center',
};

export const avatarSx: SxProps<Theme> = {
  width: 64,
  height: 64,
  mx: 'auto',
  mb: 2,
};

/** Role label beneath the name — adds breathing room before the stats row. */
export const roleSx: SxProps<Theme> = {
  mb: 2,
};

/** Wraps the stat cells in a centred horizontal row. */
export const statsRowSlotSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
};

/** One stat cell: value + label, separated from its siblings by a Divider. */
export const statCellSlotSx: SxProps<Theme> = {
  px: 2,
};
