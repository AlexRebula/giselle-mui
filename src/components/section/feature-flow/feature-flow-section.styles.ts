import type { SxProps, Theme } from '@mui/material/styles';

import { channelAlpha } from '../../../utils/theme/theme-utils/theme-utils';
import type { FeatureFlowDetailColorKey, FeatureFlowItemButtonState } from './types';

// ----------------------------------------------------------------------

const GREY_500_CHANNEL = 'var(--mui-palette-grey-500Channel)';
const COMMON_BLACK_CHANNEL = 'var(--mui-palette-common-blackChannel)';

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
 * The main two-column `Grid` container.
 *
 * `pb` drops to a fixed, smaller value while a detail panel is showing —
 * without this, the last row's card sits flush against the detail panel's
 * border (`detailPanelSx`'s own `py` pushes its *content* down from that
 * border, not the border away from what's above it).
 */
export const featureFlowGridContainerSx =
  (isExpanded: boolean): SxProps<Theme> =>
  (theme) => ({
    position: 'relative',
    pb: isExpanded ? { xs: 5, md: 8 } : 0,
    transition: theme.transitions.create('padding-bottom', {
      duration: theme.transitions.duration.short,
    }),
  });

/** The description column's `Grid` item — swaps side and inner padding with `isLeft`. */
export const featureFlowDescriptionGridSx = (isLeft: boolean): SxProps<Theme> => ({
  order: { xs: 1, md: isLeft ? 1 : 2 },
  pl: { md: isLeft ? 0 : 4 },
});

/** The image column's `Grid` item — swaps side with `isLeft`, mirroring the description column. */
export const featureFlowImageGridSx = (isLeft: boolean): SxProps<Theme> => ({
  order: { xs: 2, md: isLeft ? 2 : 1 },
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
        // No `!important` needed (see #192): the entrance fade now lives on
        // an outer `m.div` wrapping this row (`FeatureFlowItemRow`), not on
        // this element itself, so framer-motion's persistent inline
        // `style="opacity: 1"` never lands here to out-specificity these
        // rules (previously required as a truce — see #185).
        '&:hover': {
          opacity: 0.72,
          bgcolor: channelAlpha(GREY_500_CHANNEL, 0.08),
        },
        '&:active': {
          opacity: 0.56,
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
// Shared across sub-components
// ----------------------------------------------------------------------

/**
 * Shared shape behind every permanently-mounted crossfade frame: only the
 * active one is opaque. Used by both `image-column/` (crossfading resolved
 * image sources) and `highlight-carousel/` (crossfading slide images) — stays
 * here rather than in either sub-component's own styles file since it's
 * genuinely shared between the two, not owned by either.
 */
export const crossfadeOpacitySx = (isActive: boolean, durationSeconds: number): SxProps<Theme> => ({
  opacity: isActive ? 1 : 0,
  transition: `opacity ${durationSeconds}s ease`,
});
