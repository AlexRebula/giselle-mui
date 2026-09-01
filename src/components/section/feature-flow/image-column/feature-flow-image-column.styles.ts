import type { SxProps, Theme } from '@mui/material/styles';

import { channelAlpha } from '../../../../utils/theme/theme-utils/theme-utils';
import { crossfadeOpacitySx } from '../feature-flow-section.styles';

// ----------------------------------------------------------------------

const GREY_500_CHANNEL = 'var(--mui-palette-grey-500Channel)';
const COMMON_BLACK_CHANNEL = 'var(--mui-palette-common-blackChannel)';

// ----------------------------------------------------------------------

/**
 * The sticky image column's card — palette-tinted drop shadow, softened for dark mode.
 */
export const imageColumnCardSx: SxProps<Theme> = (theme) => ({
  top: 0,
  left: '50%',
  width: 720,
  maxWidth: '100%',
  borderRadius: 2,
  overflow: 'hidden',
  position: 'absolute',
  transform: 'translateX(-50%)',
  bgcolor: 'background.default',
  boxShadow: `-40px 40px 80px 0px ${channelAlpha(GREY_500_CHANNEL, 0.16)}`,
  ...theme.applyStyles('dark', {
    boxShadow: `-40px 40px 80px 0px ${channelAlpha(COMMON_BLACK_CHANNEL, 0.16)}`,
  }),
});

/**
 * Sticky within the tall grid track next to it (md+); static on mobile.
 *
 * `zIndex: 1` is required for the sticky photo to paint over
 * `FeatureFlowItemDetail` once they scroll into overlap (see #193). The true
 * DOM sibling pair at `<section>`'s level is `MotionViewport` (wraps this
 * image column, several levels down) and the `m.div layout` wrapping the
 * detail panel (see `DETAIL_PANEL_LAYOUT_TRANSITION`) — not this stack and
 * the detail panel directly. Neither `MotionViewport`'s rendered root nor
 * any ancestor between it and this stack sets an explicit `zIndex` or ends
 * up with a non-`none` transform (confirmed live, and guarded by the
 * regression test in `feature-flow-section.transition.test.ts` that renders
 * real framer-motion, not a mock) — so both `MotionViewport` and this stack
 * stay at the default `z-index: auto` level until this `zIndex: 1`, where
 * paint order otherwise falls back to DOM order, putting the later,
 * non-sticky detail panel on top instead of the sticky image. `1` is enough
 * to win against any `z-index: auto` sibling; it stays well under
 * `FloatingSubNav`'s `theme.zIndex.speedDial` so that still wins over both
 * (`FloatingSubNav` renders outside that same `m.div layout` for exactly
 * this reason — see the comment at its call site in `feature-flow-section.tsx`).
 */
export const imageColumnStickyStackSx: SxProps<Theme> = {
  position: { xs: 'relative', md: 'sticky' },
  top: { md: 80 },
  width: 1,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
};

/**
 * The outer, in-flow ghost image: invisible, purely gives the sticky Stack
 * its natural height so `position: sticky` has room to travel.
 */
export const imageColumnOuterGhostSx: SxProps<Theme> = {
  width: 720,
  maxWidth: '100%',
  display: 'block',
  visibility: 'hidden',
  pointerEvents: 'none',
  userSelect: 'none',
};

/**
 * The inner ghost image: gives the crossfade layer a reference box height so
 * it doesn't collapse (all the crossfaded images are `position: absolute`).
 */
export const imageColumnInnerGhostSx: SxProps<Theme> = {
  width: '100%',
  display: 'block',
  visibility: 'hidden',
  pointerEvents: 'none',
  userSelect: 'none',
};

/** One permanently-mounted image-column crossfade frame; only the active one is opaque. */
export const imageColumnFrameSx = (isActive: boolean): SxProps<Theme> => ({
  width: '100%',
  display: 'block',
  pointerEvents: 'none',
  userSelect: 'none',
  position: 'absolute',
  top: 0,
  left: 0,
  ...crossfadeOpacitySx(isActive, 0.4),
});

/**
 * The reveal-transform wrapper — one level in from the card (`imageColumnCardSx`)
 * itself. The scroll-linked reveal transform (`revealStyle`, computed by
 * `FeatureFlowSection`) composes into this element's own `transform`, so it
 * lives here rather than on the card above: that outer card owns
 * `imageColumnCardSx`'s own `transform` (`translateX(-50%)`, for horizontal
 * centering), and an inline motion `transform` would silently replace it if
 * applied to the same node.
 */
export const imageColumnRevealWrapperSx: SxProps<Theme> = {
  width: 1,
  position: 'relative',
};
