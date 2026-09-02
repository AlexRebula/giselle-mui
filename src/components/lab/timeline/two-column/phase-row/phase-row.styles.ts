import type { SxProps, Theme } from '@mui/material/styles';

// ── Phase row ─────────────────────────────────────────────────────────────────

/**
 * Flex row that holds the left column, centre spine, and right column for a phase.
 *
 * Applies the blur+dim transition when another phase card is expanded.
 *
 * @param blurred - When true, applies blur, dim, and scale-down effect.
 */
export const phaseRowSx = (blurred: boolean): SxProps<Theme> => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  minWidth: 0,
  transition: 'filter 0.2s ease, opacity 0.2s ease, transform 0.2s ease',
  ...(blurred && {
    filter: 'blur(1.5px)',
    opacity: 0.38,
    transform: 'scale(0.97)',
    pointerEvents: 'none',
  }),
  flex: 1,
});

// ── Phase dot ─────────────────────────────────────────────────────────────────

/**
 * Wrapper around the phase dot and its floating date pill.
 *
 * `position: relative` is required so the absolutely-positioned pill floats
 * above the dot without affecting the row's layout flow.
 * `display: inline-flex` keeps the wrapper tight to the dot's own size.
 */
export const phaseDotWrapperSx: SxProps<Theme> = {
  position: 'relative',
  display: 'inline-flex',
};
