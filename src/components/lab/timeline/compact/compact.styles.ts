import { alpha, type SxProps, type Theme } from '@mui/material/styles';

import type { HighlightedPaletteKey } from '../two-column/types';

// ----------------------------------------------------------------------
// Static sx — created once at module load

export const accordionSummarySx: SxProps<Theme> = {
  minHeight: 56,
  py: 1,
  px: 2,
  display: 'flex',
  alignItems: 'center',
  '&.Mui-expanded': { minHeight: 56 },
  '& .MuiAccordionSummary-content': {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    my: 0,
    overflow: 'hidden',
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: 'text.secondary',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
  },
};

export const phaseTitleRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  overflow: 'hidden',
};

// ----------------------------------------------------------------------
// Dynamic sx factories — accept resolved props, return SxProps

/**
 * Accordion root sx factory — no border, hover background, done-fade opacity.
 * SSR-safe: uses CSS custom property string directly (no theme callback).
 *
 * Shared by `TimelineCompact` (default, non-expanded root) and `PhaseAccordionRow`
 * (full per-phase state) — stays in the parent folder's styles file.
 */
export const accordionRootSx =
  (done: boolean, active = false, expanded = false, color: HighlightedPaletteKey = 'primary') =>
  (theme: Theme) => {
    const neutralColor =
      typeof theme.palette.grey?.[500] === 'string' ? theme.palette.grey[500] : '#919eab';
    const activeColor = theme.palette[color].main;
    const neutralBg = alpha(neutralColor, 0.08);
    const activeBg = alpha(activeColor, 0.12);
    const activeBorder = alpha(activeColor, 0.24);
    const isActiveExpanded = active && expanded;
    const transitionDuration = theme.transitions?.duration?.shorter ?? 250;
    const colorTransition = theme.transitions?.create
      ? theme.transitions.create(['background-color', 'border-color'], {
          duration: transitionDuration,
        })
      : 'background-color 250ms, border-color 250ms';

    return {
      py: 1,
      px: 2.5,
      border: isActiveExpanded ? `1px solid ${activeBorder}` : 'none',
      borderRadius: 2,
      boxShadow: 'none',
      backgroundColor: isActiveExpanded ? activeBg : 'transparent',
      '&:before': { display: 'none' },
      '&.Mui-expanded': {
        margin: 0,
        bgcolor: isActiveExpanded ? activeBg : neutralBg,
        border: isActiveExpanded ? `1px solid ${activeBorder}` : 'none',
      },
      '&:hover': {
        bgcolor: neutralBg,
      },
      opacity: done ? 0.65 : 1,
      transition: `${colorTransition}, opacity 300ms`,
    };
  };
