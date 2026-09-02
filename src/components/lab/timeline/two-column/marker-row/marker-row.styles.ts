import type { SxProps, Theme } from '@mui/material/styles';

// ── Marker phase row ──────────────────────────────────────────────────────────

/** `<li>` element for a `variant='marker'` phase — column-layout, min-height for dot. */
export const markerPhaseLiSx: SxProps<Theme> = {
  position: 'relative',
  overflow: 'visible',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1,
  minHeight: 40,
};

/**
 * Flex slot (layout container) that positions the left or right floating label
 * in a marker row.
 *
 * **Named `*SlotSx`, not `*LabelSx`:** this is a structural container, not the label
 * itself. The label (`MarkerLabel`, styled via `markerCaptionSx`) is the child content —
 * the slot only positions it against the spine. Naming by structural role (slot) rather
 * than by current child content (label) prevents the name from becoming misleading if the
 * slot ever holds a different child.
 *
 * **Unified into a factory:** the left and right variants differ only in alignment and
 * padding — identical in structure. Two static constants would duplicate that structure
 * and diverge silently during refactors. This follows the same pattern as `timelineColumnSx`
 * (in `../two-column.styles.ts`) and `msColumnBoxSx` (in `../milestone-row/milestone-row.styles.ts`):
 * every left/right pair is a single factory taking a `side` argument.
 *
 * @param side - `'left'` or `'right'`.
 */
export const markerLabelSlotSx = (side: 'left' | 'right'): SxProps<Theme> => ({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  // xs: left slot hidden — label shifts to the right slot on mobile.
  // Right slot is always visible.
  display: side === 'left' ? { xs: 'none', md: 'flex' } : 'flex',
  justifyContent: side === 'left' ? 'flex-end' : 'flex-start',
  alignItems: 'center',
  pr: side === 'left' ? 1.5 : 0,
  pl: side === 'right' ? 1.5 : 0,
});

/** Centre Box in a marker row — contains the dot and spine connector. */
export const markerCenterSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexShrink: 0,
  position: 'relative',
};

/** Inner flex row for a `variant='marker'` phase — horizontal, centred. */
export const markerRowInnerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};
