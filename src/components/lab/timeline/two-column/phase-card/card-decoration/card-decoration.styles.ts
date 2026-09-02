import type { SxProps, Theme } from '@mui/material/styles';

import type { HighlightedPaletteKey } from '../../types';

// ── CardDecoration gradient ───────────────────────────────────────────────────

/**
 * Rotating gradient rectangle that sits in the top-right corner of a PhaseCard.
 *
 * @param color - MUI palette key for the gradient colour (already resolved from phase.color).
 * @param isOverduePending - When true, switches to the error palette and raises opacity.
 */
export const buildCardDecorationGradientSx =
  (color: string, isOverduePending: boolean): SxProps<Theme> =>
  (theme) => ({
    top: -40,
    right: -56,
    width: 140,
    height: 140,
    borderRadius: 4,
    position: 'absolute',
    transform: 'rotate(40deg)',
    pointerEvents: 'none',
    background: `linear-gradient(to right, ${
      theme.vars!.palette[isOverduePending ? 'error' : (color as HighlightedPaletteKey)]?.main ??
      theme.vars!.palette.primary.main
    }, transparent)`,
    opacity: isOverduePending ? 0.18 : 0.08,
  });

// ── Corner decorative icon ────────────────────────────────────────────────────

/**
 * Absolutely-positioned decorative icon Box in the top-right corner of a phase card.
 *
 * @param color - MUI palette key for the icon tint.
 * @param isOverduePending - When true, tints to error and reduces opacity.
 */
export const phaseCardIconBoxSx =
  (color: string, isOverduePending: boolean): SxProps<Theme> =>
  (theme) => ({
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    position: 'absolute',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Force the icon SVG to 32 × 32 via CSS instead of cloneElement,
    // so the icon element can remain an RSC-created React element.
    '& svg': { width: 32, height: 32 },
    color: isOverduePending
      ? theme.vars!.palette.error.main
      : ((theme.vars!.palette as unknown as Record<string, { main: string }>)[color]?.main ??
        theme.vars!.palette.primary.main),
    opacity: isOverduePending ? 0.55 : 0.35,
  });
