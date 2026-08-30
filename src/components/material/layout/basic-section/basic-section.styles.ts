import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/** Only shows on very wide viewports — narrower ones have no room for a subtle frame. */
const DECORATION_MIN_WIDTH = 1440;

/** Inset (px) of each corner plus-mark from its nearest edges. */
export const CORNER_MARK_INSET = 72;

/** Inset (px) of the horizontal border lines from the top/bottom edges. */
export const HORIZONTAL_LINE_INSET = 80;

/** Inset (px) of the vertical border line from the left edge. */
export const VERTICAL_LINE_INSET = 80;

// ----------------------------------------------------------------------

export const basicSectionRootSx: SxProps<Theme> = {
  position: 'relative',
  overflowX: 'clip',
};

/** Shared base for every decorative piece: hidden below the min width, subtle grey, no interaction. */
const decorationBaseSx = (theme: Theme) => ({
  position: 'absolute' as const,
  display: 'none',
  color: 'grey.500',
  pointerEvents: 'none' as const,
  [theme.breakpoints.up(DECORATION_MIN_WIDTH)]: { display: 'block' },
});

export type CornerMarkPosition = 'top-left' | 'bottom-left';

const CORNER_MARK_OFFSETS: Record<
  CornerMarkPosition,
  { top?: number; bottom?: number; left: number }
> = {
  'top-left': { top: CORNER_MARK_INSET, left: CORNER_MARK_INSET },
  'bottom-left': { bottom: CORNER_MARK_INSET, left: CORNER_MARK_INSET },
};

/** A small plus-shaped corner mark, positioned at one of the section's corners. */
export const cornerMarkSx =
  (position: CornerMarkPosition): SxProps<Theme> =>
  (theme) => ({
    ...decorationBaseSx(theme),
    ...CORNER_MARK_OFFSETS[position],
    width: 16,
    height: 16,
  });

export type BorderLinePosition = 'top' | 'bottom' | 'left';

/** A subtle dashed line along one edge — horizontal at top/bottom, vertical at left. */
export const borderLineSx =
  (position: BorderLinePosition): SxProps<Theme> =>
  (theme) => {
    if (position === 'left') {
      return {
        ...decorationBaseSx(theme),
        opacity: 0.24,
        borderColor: 'currentColor',
        left: VERTICAL_LINE_INSET,
        top: 0,
        width: 0,
        height: 1,
        borderLeft: '1px dashed',
      };
    }

    return {
      ...decorationBaseSx(theme),
      opacity: 0.24,
      borderColor: 'currentColor',
      left: 0,
      [position]: HORIZONTAL_LINE_INSET,
      width: 1,
      height: 0,
      borderTop: '1px dashed',
    };
  };
