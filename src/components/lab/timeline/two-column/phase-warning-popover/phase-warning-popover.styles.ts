import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/** Popover Paper container — fixed width column layout. */
export const popoverPaperSx: SxProps<Theme> = {
  width: 340,
  p: 2,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
};

/** Slider row header — phase title left, date range right. */
export const sliderRowHeaderSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 0.25,
};

/** Actions row — sequential-fix button left, apply/cancel right. */
export const actionsRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 1,
};

// ── Popper ────────────────────────────────────────────────────────────────────

/** `Popper` stacking sx — floats above tooltips so the repair UI is never obscured. */
export const overlapPopperSx: SxProps<Theme> = (theme) => ({
  zIndex: theme.zIndex.tooltip + 1,
});

// ── Header ────────────────────────────────────────────────────────────────────

/** Header row Box — warning title left, close button right. */
export const warningHeaderRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

/** "⚠ N date overlaps" title Typography. */
export const warningTitleSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
};

/** Close (×) IconButton — pinned to the row's trailing edge. */
export const closeButtonSx: SxProps<Theme> = {
  ml: 'auto',
};

// ── Overlap summary ───────────────────────────────────────────────────────────

/** Overlap summary Typography — lists the conflicting phase titles. */
export const overlapSummarySx: SxProps<Theme> = {
  fontWeight: 500,
};

/** Hint caption Typography under the overlap summary. */
export const overlapHintSx: SxProps<Theme> = {
  mt: 0.5,
  display: 'block',
};

// ── Sliders ───────────────────────────────────────────────────────────────────

/** Column container that stacks one range slider per conflicting phase. */
export const slidersColumnSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
};

/** Phase title label inside a slider row header. */
export const sliderPhaseLabelSx: SxProps<Theme> = {
  fontWeight: 600,
};

// ── Actions ───────────────────────────────────────────────────────────────────

/** Apply/Cancel button row nested inside `actionsRowSx`. */
export const applyCancelRowSx: SxProps<Theme> = {
  display: 'flex',
  gap: 1,
};
