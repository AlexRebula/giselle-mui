import type { SxProps, Theme } from '@mui/material/styles';

// ── PlatformStrip ─────────────────────────────────────────────────────────────

/** One tooltip-wrapped item slot inside the platform strip — centres its icon or fallback label. */
export const platformStripItemSlotSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/** Fallback text label rendered when a platform item has no icon. */
export const platformStripItemLabelSx: SxProps<Theme> = {
  fontSize: 11,
  px: 0.5,
};
