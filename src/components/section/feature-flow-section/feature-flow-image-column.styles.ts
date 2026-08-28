import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/** Sticky within the tall grid track next to it (md+); static on mobile. */
export const imageColumnStickyStackSx: SxProps<Theme> = {
  position: { xs: 'relative', md: 'sticky' },
  top: { md: 80 },
  width: 1,
  alignItems: 'center',
  justifyContent: 'center',
};

/**
 * The outer, in-flow ghost image: invisible, purely gives the sticky Stack
 * its natural height so `position: sticky` has room to travel.
 */
export const imageColumnOuterGhostSx: SxProps<Theme> = {
  width: 720,
  maxWidth: '100%',
  display: 'block',
  visibility: 'hidden',
  pointerEvents: 'none',
  userSelect: 'none',
};

/**
 * The inner ghost image: gives the crossfade layer a reference box height so
 * it doesn't collapse (all the crossfaded images are `position: absolute`).
 */
export const imageColumnInnerGhostSx: SxProps<Theme> = {
  width: '100%',
  display: 'block',
  visibility: 'hidden',
  pointerEvents: 'none',
  userSelect: 'none',
};

/** One permanently-mounted crossfade frame; only the active one is opaque. */
export const imageColumnFrameSx = (isActive: boolean): SxProps<Theme> => ({
  width: '100%',
  display: 'block',
  pointerEvents: 'none',
  userSelect: 'none',
  position: 'absolute',
  top: 0,
  left: 0,
  opacity: isActive ? 1 : 0,
  transition: 'opacity 0.4s ease',
});
