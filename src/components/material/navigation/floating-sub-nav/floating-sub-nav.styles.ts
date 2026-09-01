import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/** Sticky outer wrapper — zero-height overflow-visible anchor. */
export const stickyWrapperSx: SxProps<Theme> = (theme) => ({
  position: 'sticky',
  bottom: { xs: 32, sm: 32, md: 40 },
  height: 0,
  overflow: 'visible',
  display: 'flex',
  justifyContent: 'center',
  zIndex: theme.zIndex.speedDial,
  pointerEvents: 'none',
});

/**
 * Inner box for the sticky variant — floats the pill above the zero-height anchor
 * via `translateY(-100%)` while restoring pointer events on this element only.
 */
export const stickyInnerSx: SxProps<Theme> = {
  transform: 'translateY(-100%)',
  pointerEvents: 'auto',
  pb: { xs: '23px', md: '31px' },
};

/** Fixed outer wrapper — viewport-anchored, centred. */
export const fixedWrapperSx: SxProps<Theme> = (theme) => ({
  position: 'fixed',
  bottom: { xs: 16, md: 24 },
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: theme.zIndex.speedDial,
});
