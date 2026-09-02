import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Floats the viewed-state toggle button outside the card, at the bottom on
 * the outer edge (mirrors `CardCornerAlertBadge`'s outer-edge placement).
 *
 * @param opts.columnSide - `'left'` pins the button to the left outer edge; `'right'` to the right.
 * @param opts.isViewed - Controls color and hover state.
 * @param opts.minSize - Minimum tap target size in px. Defaults to 28 (`EYE_BUTTON_MIN_SIZE`).
 */
export const eyeButtonSx = (opts: {
  columnSide: 'left' | 'right';
  isViewed: boolean;
  minSize?: number;
}): SxProps<Theme> => ({
  position: 'absolute',
  bottom: 0,
  ...(opts.columnSide === 'left' ? { left: 0 } : { right: 0 }),
  transform: 'translate(0, calc(100% + 8px))',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: opts.minSize ?? 28,
  minHeight: opts.minSize ?? 28,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  p: 0,
  color: opts.isViewed ? 'success.main' : 'text.secondary',
  transition: 'color 0.15s',
  '&:hover': { color: opts.isViewed ? 'success.dark' : 'text.primary' },
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: opts.isViewed ? 'success.main' : 'primary.main',
    outlineOffset: 2,
    borderRadius: 0.5,
  },
});
