import type { SxProps, Theme } from '@mui/material/styles';

import type { DecorationElement } from './types';

// ----------------------------------------------------------------------

/** Only shows on very wide viewports — narrower ones have no room for a subtle frame. */
const DECORATION_MIN_WIDTH = 1440;

/** Inset (px) of each corner plus/x-mark from its nearest edges, in the canonical frame. */
export const CORNER_MARK_INSET = 72;

/** Inset (px) of the horizontal border lines from the top/bottom edges, in the canonical frame. */
export const HORIZONTAL_LINE_INSET = 80;

/** Inset (px) of the vertical border line from the left edge, in the canonical frame. */
export const VERTICAL_LINE_INSET = 80;

/**
 * `decoration: true` expands to this — the exact frame every section used
 * before `BasicSection` existed (2 corner plus-marks, 3 border lines).
 */
export const CANONICAL_FRAME: DecorationElement[] = [
  { kind: 'corner-plus', sx: { top: CORNER_MARK_INSET, left: CORNER_MARK_INSET } },
  { kind: 'corner-plus', sx: { bottom: CORNER_MARK_INSET, left: CORNER_MARK_INSET } },
  { kind: 'border-line', sx: { top: HORIZONTAL_LINE_INSET, left: 0 } },
  { kind: 'border-line', sx: { bottom: HORIZONTAL_LINE_INSET, left: 0 } },
  { kind: 'border-line', vertical: true, sx: { top: 0, left: VERTICAL_LINE_INSET } },
];

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

/** Small plus-shaped corner mark (`FloatPlusIcon`'s original shape). */
export const cornerPlusSx: SxProps<Theme> = (theme) => ({
  ...decorationBaseSx(theme),
  width: 16,
  height: 16,
});

/** Small X-shaped corner mark (`FloatXIcon`'s original shape). */
export const cornerXSx: SxProps<Theme> = (theme) => ({
  ...decorationBaseSx(theme),
  width: 16,
  height: 16,
});

/** A subtle dashed line — horizontal by default, vertical when `vertical` is set. */
export const borderLineSx =
  (vertical = false): SxProps<Theme> =>
  (theme) => ({
    ...decorationBaseSx(theme),
    opacity: 0.24,
    borderColor: 'currentColor',
    ...(vertical
      ? { width: 0, height: 1, borderLeft: '1px dashed' }
      : { width: 1, height: 0, borderTop: '1px dashed' }),
  });

/** Left-pointing triangle accent (`FloatTriangleLeftIcon`'s original shape). */
export const triangleLeftSx: SxProps<Theme> = (theme) => ({
  ...decorationBaseSx(theme),
  width: 10,
  height: 20,
});

/** Downward-pointing triangle accent (`FloatTriangleDownIcon`'s original shape). */
export const triangleDownSx: SxProps<Theme> = (theme) => ({
  ...decorationBaseSx(theme),
  width: 20,
  height: 10,
});

/** Small filled dot accent (`FloatDotIcon`'s original shape). */
export const dotSx: SxProps<Theme> = (theme) => ({
  ...decorationBaseSx(theme),
  width: 12,
  height: 12,
  borderRadius: '50%',
  bgcolor: 'currentColor',
});
