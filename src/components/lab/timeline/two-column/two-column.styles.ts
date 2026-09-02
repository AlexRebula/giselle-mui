import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Styles for the `TimelineTwoColumn` root component and its local sub-components.
 *
 * Static constants are created once at module load — zero per-render allocation.
 * Dynamic factories create a new object on every call — memoize at the call site
 * if the component re-renders frequently with stable props.
 */

// ── Root layout switch ─────────────────────────────────────────────────────────

/**
 * CSS-only responsive layout switch between the compact accordion and the full
 * two-column spine — both trees are always mounted so the browser applies the
 * correct layout immediately via CSS, with no JS media-query round-trip.
 *
 * **Unified into a factory:** the two views are mutually-exclusive opposites of the
 * same `display` breakpoint toggle (mirrors `timelineColumnSx` in
 * `phase-row/timeline-column/timeline-column.styles.ts` and `msColumnBoxSx` in
 * `milestone-row/milestone-row.styles.ts`); only the full view additionally needs
 * `position: relative` as the positioning context for its absolutely-positioned
 * milestone cards.
 *
 * @param view - `'compact'` hides on md+, shows on xs. `'full'` is the inverse, plus `position: relative`.
 */
export const timelineViewSlotSx = (view: 'compact' | 'full'): SxProps<Theme> => ({
  display: view === 'compact' ? { xs: 'block', md: 'none' } : { xs: 'none', md: 'block' },
  ...(view === 'full' && { position: 'relative' as const }),
});

// ── Floating date pill ────────────────────────────────────────────────────────

/**
 * Date pill that floats above a phase or milestone dot.
 *
 * Always `display: 'none'` — made visible via JS/CSS at the call site when needed.
 * Used identically in the phase dot and the milestone dot.
 */
export const floatingDatePillSx: SxProps<Theme> = {
  position: 'absolute',
  bottom: 'calc(100% + 4px)',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '0.875rem',
  fontWeight: 800,
  color: 'common.white',
  bgcolor: 'grey.700',
  px: 0.75,
  py: 0.125,
  borderRadius: 0.75,
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  zIndex: 2,
  display: 'none',
};

// ── Phase <li> ────────────────────────────────────────────────────────────────

/**
 * The `<li>` wrapper for a full phase — flex column, z-index management, and
 * optional computed `minHeight` when milestones are present.
 *
 * @param zIndex - 1 when no milestone is expanded, 2 when one is.
 * @param computedMinHeight - Pre-computed min-height value. Pass `undefined` when no milestones.
 */
export const phaseLiSx = (opts: { zIndex: 1 | 2; computedMinHeight?: number }): SxProps<Theme> => ({
  position: 'relative',
  overflow: 'visible',
  display: 'flex',
  flexDirection: 'column',
  zIndex: opts.zIndex,
  // CSS :has() raises this <li> when any milestone card within it is hovered,
  // preventing the next <li>'s phase card from painting over the hovered card.
  // Supported: Chrome 121+, Firefox 121+, Safari 17+ (within browser support matrix).
  '&:has([data-ms-card]:hover)': { zIndex: 3 },
  ...(opts.computedMinHeight !== undefined && { minHeight: opts.computedMinHeight }),
});

// ── Centre column ─────────────────────────────────────────────────────────────

/**
 * Centre column Box — used for both the phase dot column and the milestone dot column.
 * Flex column with centred items; `flexShrink: 0` prevents the spine from being squeezed
 * at narrow viewport widths.
 */
export const centerColumnSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexShrink: 0,
};

// ── Timeline MUI root ─────────────────────────────────────────────────────────

/**
 * MUI `<Timeline>` root sx — resets default padding/margin and removes the
 * pseudo-element that MUI adds before every `TimelineItem`.
 */
export const timelineRootSx: SxProps<Theme> = {
  p: 0,
  m: 0,
  '& .MuiTimelineItem-root:before': { flex: 0, padding: 0 },
};
