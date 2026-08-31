import type { SxProps, Theme } from '@mui/material/styles';

import { channelAlpha } from '../../../utils/theme/theme-utils/theme-utils';
import type { FeatureFlowDetailColorKey, FeatureFlowItemButtonState } from './types';

// ----------------------------------------------------------------------

const GREY_500_CHANNEL = 'var(--mui-palette-grey-500Channel)';
const COMMON_BLACK_CHANNEL = 'var(--mui-palette-common-blackChannel)';
const COMMON_WHITE_CHANNEL = 'var(--mui-palette-common-whiteChannel)';

export const HIGHLIGHT_CAROUSEL_HEIGHT = 570;

// ----------------------------------------------------------------------

/** Selected item's `:hover` box-shadow shape — same offsets for light and dark, differing only in channel + alpha. */
const selectedHoverShadow = (channel: string, innerAlpha: number, outerAlpha: number) =>
  `0 0 2px 0 ${channelAlpha(channel, innerAlpha)}, -8px 20px 40px -4px ${channelAlpha(channel, outerAlpha)}`;

/** Selected item's `:active` box-shadow shape — tighter than `:hover`, same offsets for light and dark. */
const selectedActiveShadow = (channel: string, innerAlpha: number, outerAlpha: number) =>
  `0 0 1px 0 ${channelAlpha(channel, innerAlpha)}, -1px 2px 4px -1px ${channelAlpha(channel, outerAlpha)}`;

// ----------------------------------------------------------------------

/**
 * Root `<section>` additions on top of `BasicSection`'s own base
 * (`position: relative`, `overflowX: clip` — no need to repeat those here).
 *
 * `pb` drops to a fixed, smaller value while a detail panel is expanded:
 * `detailPanelSx`'s own `py` already gives space after the panel/sub-nav
 * that renders below the main grid in that state, so the section's own
 * full (responsive) bottom padding would just double up past it. Computed
 * directly here (one set of rules) rather than layered on as a separate
 * `sx` array entry meant to out-cascade this — that relies on
 * array/insertion order beating a same-specificity responsive rule, which
 * isn't guaranteed.
 */
export const featureFlowRootSx = (isExpanded: boolean): SxProps<Theme> => ({
  pt: { xs: 10, md: 20 },
  pb: isExpanded ? 10 : { xs: 10, md: 20 },
});

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
 * Resolves a `FeatureFlowDetailColorKey` to its CSS-variable channel string.
 * `'grey'` is the one key with no `.main`/`.mainChannel` shape (it isn't a
 * standard MUI `PaletteColor`), so it maps to the already-defined
 * `GREY_500_CHANNEL` instead of the templated `--mui-palette-<key>-mainChannel`
 * the other six share.
 */
const detailPanelChannel = (color: FeatureFlowDetailColorKey): string =>
  color === 'grey' ? GREY_500_CHANNEL : `var(--mui-palette-${color}-mainChannel)`;

/**
 * The expanded detail panel's tinted background + top border, using the
 * same `channelAlpha(mainChannel, …)` technique `HeroSection`'s own `color`
 * prop uses — works in light and dark mode with no hardcoded hex values.
 * @param color @default 'primary'
 */
export const detailPanelSx = (color: FeatureFlowDetailColorKey = 'primary'): SxProps<Theme> => {
  const channel = detailPanelChannel(color);
  return {
    py: { xs: 6, md: 10 },
    overflow: 'hidden',
    position: 'relative',
    bgcolor: channelAlpha(channel, 0.04),
    borderTop: `1px solid ${channelAlpha(channel, 0.12)}`,
  };
};

/**
 * One item row in the description column. Every row is a real, focusable
 * `ButtonBase` regardless of `expandable` (see #198) — this only gates the
 * *visual* treatment:
 *
 * - `expandable: false` (no expansion data): quiet, no hover/press feedback, no cursor pointer.
 * - Non-selected, expandable: fades on hover; brightens fully when it's the hovered/active item.
 * - Selected (last-clicked) item: persistent elevated card, regardless of hover.
 * - Expanded item: a left inset accent shows its detail panel is open.
 */
export const featureFlowItemSx =
  ({ isSelected, isActive, isExpanded, expandable }: FeatureFlowItemButtonState): SxProps<Theme> =>
  (theme) => ({
    gap: 2,
    display: 'flex',
    alignItems: 'flex-start',
    textAlign: 'left',
    width: '100%',
    cursor: expandable ? 'pointer' : 'default',
    borderRadius: 1.5,
    py: 3,
    px: 2.5,
    border: 'solid 1px transparent',
    color: 'text.disabled',
    outline: 'none',
    transition: theme.transitions.create(
      ['background-color', 'box-shadow', 'border-color', 'opacity'],
      { duration: theme.transitions.duration.shorter }
    ),
    '&:focus-visible': {
      outline: `2px dashed ${theme.vars!.palette.primary.main}`,
      outlineOffset: 2,
    },
    ...(expandable &&
      !isSelected && {
        // `!important` is required here: this row renders as `component={m.button}`
        // with `variants={fade('inUp', …)}` for its entrance animation, and once
        // that animation settles framer-motion leaves a permanent inline
        // `style="opacity: 1"` on the element. Inline styles beat any class-based
        // rule regardless of specificity — without `!important`, `:hover`/`:active`
        // can change the background but can never actually dim the row (see #185).
        '&:hover': {
          opacity: '0.72 !important',
          bgcolor: channelAlpha(GREY_500_CHANNEL, 0.08),
        },
        '&:active': {
          opacity: '0.56 !important',
          bgcolor: channelAlpha(GREY_500_CHANNEL, 0.12),
        },
      }),
    ...(expandable &&
      !isSelected &&
      isActive && {
        opacity: 1,
      }),
    ...(expandable &&
      isSelected && {
        color: 'text.primary',
        bgcolor: 'background.paper',
        boxShadow: `-8px 8px 20px -4px ${channelAlpha(GREY_500_CHANNEL, 0.12)}`,
        '&:hover': {
          opacity: 1,
          boxShadow: selectedHoverShadow(GREY_500_CHANNEL, 0.08, 0.24),
        },
        '&:active': {
          opacity: 1,
          boxShadow: selectedActiveShadow(GREY_500_CHANNEL, 0.04, 0.06),
        },
        ...theme.applyStyles('dark', {
          boxShadow: `-8px 8px 20px -4px ${channelAlpha(COMMON_BLACK_CHANNEL, 0.12)}`,
          '&:hover': {
            boxShadow: selectedHoverShadow(COMMON_BLACK_CHANNEL, 0.12, 0.32),
          },
          '&:active': {
            boxShadow: selectedActiveShadow(COMMON_BLACK_CHANNEL, 0.04, 0.08),
          },
        }),
      }),
    ...(expandable &&
      isExpanded && {
        borderColor: channelAlpha('var(--mui-palette-primary-mainChannel)', 0.24),
        boxShadow: isSelected
          ? `inset 3px 0 0 ${theme.vars!.palette.primary.main}, -8px 8px 20px -4px ${channelAlpha(GREY_500_CHANNEL, 0.12)}`
          : `inset 3px 0 0 ${theme.vars!.palette.primary.main}`,
      }),
  });

// ----------------------------------------------------------------------
// Image column
// ----------------------------------------------------------------------

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

/** Shared shape behind every permanently-mounted crossfade frame: only the active one is opaque. */
const crossfadeOpacitySx = (isActive: boolean, durationSeconds: number): SxProps<Theme> => ({
  opacity: isActive ? 1 : 0,
  transition: `opacity ${durationSeconds}s ease`,
});

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

// ----------------------------------------------------------------------
// Highlight carousel
// ----------------------------------------------------------------------

export const highlightCarouselRootSx: SxProps<Theme> = {
  position: 'relative',
  height: HIGHLIGHT_CAROUSEL_HEIGHT,
  borderRadius: 2,
  overflow: 'hidden',
};

/** Absolutely-stacked slide image: crossfades via opacity, never slides. */
export const highlightSlideImageSx = (isActive: boolean): SxProps<Theme> => ({
  position: 'absolute',
  inset: 0,
  width: 1,
  height: 1,
  objectFit: 'cover',
  objectPosition: 'center top',
  ...crossfadeOpacitySx(isActive, 0.5),
});

/** Fixed gradient scrim — sits above the images, never slides. */
export const highlightScrimSx: SxProps<Theme> = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background: `linear-gradient(to top, ${channelAlpha(COMMON_BLACK_CHANNEL, 1)} 0%, ${channelAlpha(COMMON_BLACK_CHANNEL, 0.5)} 40%, transparent 69%)`,
};

export const highlightTextSlotSx: SxProps<Theme> = {
  position: 'relative',
  height: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  px: { xs: 3, md: 4 },
  pb: { xs: 3, md: 4 },
  color: 'common.white',
};

export const highlightControlsRowSx: SxProps<Theme> = {
  position: 'absolute',
  top: 16,
  right: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

/** Description text under the title — slightly translucent white, matches the scrim's dark backdrop. */
export const highlightDetailTextSx: SxProps<Theme> = {
  color: channelAlpha(COMMON_WHITE_CHANNEL, 0.9),
  lineHeight: 1.7,
};

export const highlightIndexLabelSx: SxProps<Theme> = {
  color: 'common.white',
  minWidth: 32,
  textAlign: 'center',
};

/** Prev/next arrow buttons — translucent white pill over the dark scrim. */
export const highlightArrowButtonSx: SxProps<Theme> = {
  color: 'common.white',
  bgcolor: channelAlpha(COMMON_WHITE_CHANNEL, 0.12),
};
