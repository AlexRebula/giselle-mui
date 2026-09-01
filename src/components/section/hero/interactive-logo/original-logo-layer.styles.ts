import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// OriginalLogoLayer sx constants
//
// Specific to this layer only — `ArtisticLogoLayer` and `PortraitLayer` each
// have their own single-image sx already defined in `interactive-logo.styles.ts`
// (`artisticLogoSx`, `portraitImageSx`); this one has no sibling counterpart.

/** The `activeFrame` `<img>` — fills its parent layer box exactly. */
export const activeFrameImageSx: SxProps<Theme> = {
  width: 1,
  height: 1,
};
