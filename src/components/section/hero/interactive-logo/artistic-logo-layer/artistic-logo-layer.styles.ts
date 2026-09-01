import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// ArtisticLogoLayer sx constants
//
// Used only by this layer — not shared with `OriginalLogoLayer` or `PortraitLayer`.

/** Layer 2 — artistic / alternate logo overlay. */
export const artisticLogoSx: SxProps<Theme> = {
  inset: 0,
  zIndex: 2,
  width: 1,
  height: 1,
  objectFit: 'contain',
  objectPosition: 'center center',
  position: 'absolute',
  pointerEvents: 'none',
};
