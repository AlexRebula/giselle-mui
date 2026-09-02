import type { SxProps, Theme } from '@mui/material/styles';

// ── TimelineColumn helper ─────────────────────────────────────────────────────

/**
 * Column Box inside the `TimelineColumn` layout helper.
 *
 * - Left column: right-aligned text, right padding, always hidden on xs (cards shift to right slot on mobile).
 * - Right column: left-aligned text, left padding, always visible on xs.
 * - Both columns always `display:block` on md — an empty column must stay in the
 *   flex row so the centre spine remains equidistant from both edges. Hiding it via
 *   `display:none` removes the column from flow and shifts the spine off-centre.
 *
 * @param columnSide - `'left'` or `'right'`.
 * @param hasContent - Passed through from the parent; content rendering is guarded
 *   by the caller, but the column box itself is always in the flex row on md.
 * @param bottomPadding - Phase-card gap (px) added via `paddingBottom`.
 */
export const timelineColumnSx = (
  columnSide: 'left' | 'right',
  _hasContent: boolean,
  bottomPadding: number
): SxProps<Theme> => ({
  flex: 1,
  minWidth: 0,
  textAlign: columnSide === 'left' ? 'right' : 'left',
  pr: columnSide === 'left' ? 2 : 0,
  pl: columnSide === 'right' ? 2 : 0,
  pt: 0.75,
  paddingBottom: `${bottomPadding}px`,
  // xs: left column hidden (all cards move to right slot on mobile).
  // md: BOTH columns always in layout — keeps the centre spine centred.
  display: {
    xs: columnSide === 'left' ? 'none' : 'block',
    md: 'block',
  },
});
