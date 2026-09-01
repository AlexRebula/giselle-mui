import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// InteractiveHeroLogo sx constants
//
// Only styles genuinely shared across the three layer sub-components (or used
// by `InteractiveHeroLogo` itself) live here. Each layer's own single-use sx
// lives in its own subfolder's `*.styles.ts` (see `artistic-logo-layer/`,
// `original-logo-layer/`, `portrait-layer/`).

/** Stacking container for all three layers. */
export const innerContainerSx: SxProps<Theme> = {
  position: 'relative',
  display: 'inline-flex',
  width: 1,
  height: 1,
  overflow: 'visible',
  transformStyle: 'preserve-3d',
  transition: 'filter 240ms ease',
  mb: { xs: 0 },
};

/**
 * Outermost perspective root.
 * @param cursor - CSS cursor value driven by hover/drag state.
 */
export const rootBoxSx =
  (cursor: string): SxProps<Theme> =>
  () => ({
    perspective: 1200,
    cursor,
    overflow: 'visible',
  });

/** Relative positioning wrapper for the 3-D layer stack. */
export const logoStack3dWrapperSx: SxProps<Theme> = {
  position: 'relative',
  width: 1,
  height: 1,
};
