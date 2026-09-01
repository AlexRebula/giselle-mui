import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// PortraitLayer sx constants
//
// Used only by this layer — not shared with `ArtisticLogoLayer` or `OriginalLogoLayer`.

/** Layer 3 — portrait image wrapper (positioned and scaled). */
export const portraitWrapperSx: SxProps<Theme> = {
  top: '50%',
  left: '50%',
  zIndex: 3,
  width: '100%',
  height: '100%',
  overflow: 'visible',
  objectFit: 'contain',
  objectPosition: 'center center',
  position: 'absolute',
  pointerEvents: 'none',
  transform: 'translate(-50%, -50%) scale(3.8)',
};

/** Inner `<img>` element inside the portrait wrapper. */
export const portraitImageSx: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  objectPosition: 'center center',
  display: 'block',
};
