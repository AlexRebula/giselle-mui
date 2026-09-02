import type { SxProps, Theme } from '@mui/material/styles';

// ── Milestone row ─────────────────────────────────────────────────────────────

/**
 * Outer absolutely-positioned row that places a milestone dot + cards.
 *
 * @param topPercent - Vertical position as a percentage of the parent `<li>` height.
 */
export const msRowSx = (topPercent: number): SxProps<Theme> => ({
  position: 'absolute',
  top: `${topPercent}%`,
  left: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
});

/**
 * Left or right column Box inside a milestone row.
 *
 * - Left column: always hidden on xs (milestone cards shift to the right slot on mobile).
 * - Right column: always visible on xs (receives all cards on mobile).
 * - Both columns always `display:block` on md — same reasoning as `timelineColumnSx`
 *   (in `../phase-row/timeline-column/timeline-column.styles.ts`): removing a column
 *   from flow shifts the centre spine off-centre.
 *
 * @param columnSide - `'left'` or `'right'`.
 * @param visible - Content rendering is guarded by the caller; the column box itself
 *   is always in the flex row on md so the spine stays centred.
 */
export const msColumnBoxSx = (columnSide: 'left' | 'right', _visible: boolean): SxProps<Theme> => ({
  flex: 1,
  minWidth: 0,
  position: 'relative',
  overflow: 'visible',
  display: {
    xs: columnSide === 'right' ? 'block' : 'none',
    md: 'block',
  },
});

/**
 * Wrapper around the milestone dot — applies the blur+dim animation when another
 * card is expanded.
 *
 * @param blurred - When true, applies the blur, dim, and scale-down transition.
 */
export const msDotWrapperSx = (blurred: boolean): SxProps<Theme> => ({
  position: 'relative',
  display: 'inline-flex',
  transition: 'filter 0.2s ease, opacity 0.2s ease, transform 0.2s ease',
  ...(blurred && {
    filter: 'blur(1.5px)',
    opacity: 0.38,
    transform: 'scale(0.97)',
    pointerEvents: 'none',
  }),
});

// ── Milestone card wrapper ────────────────────────────────────────────────────

/**
 * Absolutely-positioned Box that wraps a `MilestoneBadge`.
 *
 * - Floats the card to the left or right of the spine, centred vertically on its dot.
 * - `translateY(-50%)` aligns the card midpoint to the dot centre (dot height = 30px).
 * - When `suppressElevation` is true (another card is open), blurs and dims.
 * - `side='left'` offsets from the right edge (inward from spine); `'right'` from the left.
 *
 * @param isExpanded - True when this specific card is the currently open one.
 * @param suppressElevation - True when any other card is open.
 * @param side - Which column this card lives in — controls left/right inset.
 */
export const msCardWrapperSx =
  (isExpanded: boolean, suppressElevation: boolean, side: 'left' | 'right'): SxProps<Theme> =>
  (theme) => ({
    position: 'absolute',
    zIndex: isExpanded ? 1000 : 1,
    transition: 'filter 0.2s ease, opacity 0.2s ease, transform 0.2s ease',
    // Raise hovered card above adjacent phase cards so it is never overlapped.
    '&:hover': { zIndex: 999 },
    // translateY(-50%) centres the card vertically on its dot.
    transform: 'translateY(-50%)',
    ...(suppressElevation && {
      filter: 'blur(1.5px)',
      opacity: 0.38,
      transform: 'scale(0.97) translateY(-50%)',
      pointerEvents: 'none',
    }),
    top: '15px',
    left: side === 'right' ? theme.spacing(2) : 0,
    right: side === 'left' ? theme.spacing(2) : 0,
  });
