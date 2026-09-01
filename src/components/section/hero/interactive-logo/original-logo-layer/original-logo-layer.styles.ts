import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// OriginalLogoLayer sx constants
//
// Used only by this layer — not shared with `ArtisticLogoLayer` or `PortraitLayer`.

/** Layer 1 — original logo / animated frame. */
export const originalLayerSx: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
  width: 1,
  height: 1,
  willChange: 'transform',
};

/** The `activeFrame` `<img>` — fills its parent layer box exactly. */
export const activeFrameImageSx: SxProps<Theme> = {
  width: 1,
  height: 1,
};
