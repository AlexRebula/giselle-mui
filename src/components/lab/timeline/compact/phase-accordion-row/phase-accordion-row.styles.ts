import type { SxProps, Theme } from '@mui/material/styles';

import { channelAlpha } from '../../../../../utils/theme/theme-utils/theme-utils';
import type { HighlightedPaletteKey } from '../../two-column/types';
import { COMPACT_MILESTONE_DOT_SIZE, COMPACT_PHASE_DOT_SIZE } from '../compact.const';

// ----------------------------------------------------------------------
// Static sx — created once at module load

export const accordionDetailsSx: SxProps<Theme> = {
  pt: 0,
  pb: 2,
  px: 2,
};

export const phaseTitleSx: SxProps<Theme> = {
  flexGrow: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const dateSx: SxProps<Theme> = {
  color: 'text.secondary',
  flexShrink: 0,
  ml: 0.5,
};

export const descriptionSx: SxProps<Theme> = {
  color: 'text.secondary',
  mb: 1.5,
};

export const milestonesListSx: SxProps<Theme> = {
  m: 0,
  p: 0,
  mt: 1,
  listStyle: 'none',
};

export const milestoneItemSx = (interactive: boolean, done: boolean): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1.5,
  cursor: interactive ? 'pointer' : 'default',
  borderRadius: 1,
  opacity: done ? 0.72 : 1,
  ...(interactive
    ? {
        '&:hover': {
          bgcolor: channelAlpha('var(--mui-palette-grey-500Channel)', 0.06),
        },
      }
    : null),
  transition: 'background-color 150ms, opacity 150ms',
  py: 1,
  px: 0.5,
});

export const milestoneDotColumnSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexShrink: 0,
  width: COMPACT_MILESTONE_DOT_SIZE,
};

export const milestoneContentSx: SxProps<Theme> = {
  flexGrow: 1,
  overflow: 'hidden',
  pb: 0.5,
};

export const milestoneTitleSx: SxProps<Theme> = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const milestoneDescriptionPreviewSx: SxProps<Theme> = {
  color: 'text.secondary',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  mt: 0.25,
};

export const milestoneDateSx: SxProps<Theme> = {
  color: 'text.secondary',
  flexShrink: 0,
  mt: 0.25,
};

// ----------------------------------------------------------------------
// Dynamic sx factories — accept resolved props, return SxProps

/**
 * Background color for the phase summary dot.
 * Uses `theme.vars.palette[color].main` (CSS variables mode) with a fallback
 * to `theme.palette[color].main` for environments without CSS variables.
 */
export const phaseDotSx =
  (color: HighlightedPaletteKey): SxProps<Theme> =>
  (theme) => ({
    width: COMPACT_PHASE_DOT_SIZE,
    height: COMPACT_PHASE_DOT_SIZE,
    borderRadius: '50%',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    bgcolor: theme.vars?.palette[color].main ?? theme.palette[color].main,
    color: 'common.white',
  });

/**
 * Milestone dot — coloured circle with icon centered inside.
 */
export const milestoneDotSx =
  (color: HighlightedPaletteKey): SxProps<Theme> =>
  (theme) => ({
    width: COMPACT_MILESTONE_DOT_SIZE,
    height: COMPACT_MILESTONE_DOT_SIZE,
    borderRadius: '50%',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    bgcolor: theme.vars?.palette[color].main ?? theme.palette[color].main,
    color: 'common.white',
  });

/** Vertical connector line between milestone dots. */
export const milestoneConnectorLineSx: SxProps<Theme> = {
  width: 2,
  flexGrow: 1,
  minHeight: 16,
  bgcolor: 'divider',
  mt: 0.5,
};

/**
 * Overrides MUI `AccordionSummary` internals from the outside — used on the
 * wrapping `Accordion` component's own `sx` (which cannot pass `sx` down to
 * the `AccordionSummary` it renders internally).
 * Matches the compact timeline row height (56px).
 */
export const accordionSummaryOverrideSx = {
  '& .MuiAccordionSummary-root': { minHeight: 56 },
  '& .MuiAccordionSummary-root.Mui-expanded': { minHeight: 56 },
  '& .MuiAccordionSummary-content': { display: 'flex', alignItems: 'center', gap: 1.5 },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: 'text.secondary',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
  },
};

/**
 * Outlined check-circle icon shown on hover, before a done-toggle commits.
 * Shared shape for the phase dot (32px) and milestone dot (24px) hover
 * states — same color and glyph, differing only by the icon's footprint.
 */
export const checkHoverIconSx = (size: number): SxProps<Theme> => ({
  color: 'success.main',
  fontSize: size,
});
