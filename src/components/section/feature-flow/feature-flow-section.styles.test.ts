import { describe, expect, it } from 'vitest';
import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

import { channelAlpha } from '../../../utils/theme/theme-utils/theme-utils';
import {
  detailPanelSx,
  featureFlowItemSx,
  featureFlowRootSx,
  highlightSlideImageSx,
  imageColumnCardSx,
  imageColumnFrameSx,
  imageColumnStickyStackSx,
} from './feature-flow-section.styles';

// ----------------------------------------------------------------------

const GREY_500_CHANNEL = 'var(--mui-palette-grey-500Channel)';
const COMMON_BLACK_CHANNEL = 'var(--mui-palette-common-blackChannel)';

const mockTheme = {
  vars: {
    palette: {
      grey: { '500Channel': '145 158 171' },
      common: { blackChannel: '0 0 0' },
      primary: {
        main: 'rgb(25 118 210)',
        mainChannel: '25 118 210',
      },
    },
  },
  transitions: {
    create: () => 'all 200ms',
    duration: { shorter: 200 },
  },
  // Identity passthrough — merges "dark" overrides directly into the
  // returned object, as if dark mode were always active. Use `mockLightTheme`
  // below to resolve the pre-override (light-only) branch instead.
  applyStyles: (_mode: string, styles: Record<string, unknown>) => styles,
} as unknown as Theme;

// `applyStyles` never contributes anything — resolves the styles object as
// they stand before any dark-mode override is merged in.
const mockLightTheme = {
  ...(mockTheme as unknown as Record<string, unknown>),
  applyStyles: () => ({}),
} as unknown as Theme;

type StyleFn = (theme: Theme) => Record<string, unknown>;

function resolve<T>(sx: T, theme: Theme = mockTheme) {
  return (sx as unknown as StyleFn)(theme);
}

/** Reads a flat `zIndex` off a plain (non-theme-function) `SxProps` object. */
function getZIndex(sx: unknown): unknown {
  return (sx as Record<string, unknown>)['zIndex'];
}

// The real MUI default theme's `zIndex.speedDial` — the value
// `FloatingSubNav`'s sticky wrapper actually uses via `theme.zIndex.speedDial`
// (see `floating-sub-nav.styles.ts`), unmodified by this repo's theme preset
// (confirmed: it doesn't touch `zIndex`). Read from a real theme instance
// rather than hardcoded, so this stays correct if MUI's default ever changes.
const REAL_SPEED_DIAL_Z_INDEX = createTheme().zIndex.speedDial;

// ----------------------------------------------------------------------

describe('featureFlowRootSx', () => {
  it('adds top and bottom padding when nothing is expanded', () => {
    expect(featureFlowRootSx(false)).toMatchObject({
      pt: { xs: 10, md: 20 },
      pb: { xs: 10, md: 20 },
    });
  });

  it('keeps top padding but reduces bottom padding to a fixed value once a detail panel is expanded', () => {
    expect(featureFlowRootSx(true)).toMatchObject({ pt: { xs: 10, md: 20 }, pb: 10 });
  });

  it("does not duplicate BasicSection's own position/overflowX base", () => {
    expect(featureFlowRootSx(false)).not.toHaveProperty('position');
    expect(featureFlowRootSx(false)).not.toHaveProperty('overflowX');
  });
});

describe('imageColumnCardSx', () => {
  it('applies a palette-tinted drop shadow using channelAlpha', () => {
    const styles = resolve(imageColumnCardSx);
    expect(String(styles['boxShadow'])).toContain('rgba(');
    expect(String(styles['boxShadow'])).toContain('0.16');
  });
});

describe('detailPanelSx', () => {
  it('tints the background using the primary channel by default', () => {
    const styles = detailPanelSx() as Record<string, unknown>;
    expect(String(styles['bgcolor'])).toContain('rgba(var(--mui-palette-primary-mainChannel)');
  });

  it('tints the background using each standard palette colour channel', () => {
    const keys = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;
    for (const color of keys) {
      const styles = detailPanelSx(color) as Record<string, unknown>;
      expect(String(styles['bgcolor'])).toContain(`rgba(var(--mui-palette-${color}-mainChannel)`);
      expect(String(styles['borderTop'])).toContain(`rgba(var(--mui-palette-${color}-mainChannel)`);
    }
  });

  it("tints the background using grey's own channel, not a templated --mui-palette-grey-mainChannel", () => {
    const styles = detailPanelSx('grey') as Record<string, unknown>;
    expect(String(styles['bgcolor'])).toContain('rgba(var(--mui-palette-grey-500Channel)');
    expect(String(styles['bgcolor'])).not.toContain('grey-mainChannel');
  });

  // Regression test for issue #193: `detailPanelSx` must stay at the default
  // `z-index: auto` stacking level. If it ever gains an explicit `zIndex`,
  // it could re-create a stacking context that outranks
  // `imageColumnStickyStackSx` again, regardless of DOM order — see that
  // sx's own regression test below for the mechanism.
  it("[regression] does not set an explicit zIndex, so it can't out-stack the sticky image column", () => {
    expect(getZIndex(detailPanelSx())).toBeUndefined();
  });
});

describe('featureFlowItemSx', () => {
  it('non-expandable items get cursor: default and no hover styles', () => {
    const styles = resolve(
      featureFlowItemSx({
        isSelected: false,
        isActive: false,
        isExpanded: false,
        expandable: false,
      })
    );
    expect(styles['cursor']).toBe('default');
    expect(styles['&:hover']).toBeUndefined();
  });

  it('expandable, non-selected items get cursor: pointer and a hover style', () => {
    const styles = resolve(
      featureFlowItemSx({
        isSelected: false,
        isActive: false,
        isExpanded: false,
        expandable: true,
      })
    );
    expect(styles['cursor']).toBe('pointer');
    expect(styles['&:hover']).toBeDefined();
  });

  // Regression test for #185/#192: the row used to render as
  // `component={m.button}` with `variants={fade('inUp', …)}` directly on this
  // element, so framer-motion's permanent inline `style="opacity: 1"` (left
  // behind once the entrance animation settles) beat these `:hover`/`:active`
  // rules unless they carried `!important`. #192 moved the entrance fade to
  // an outer `m.div` wrapping the row instead (`FeatureFlowItemRow`), so the
  // interactive element itself never gets that inline style — a plain
  // opacity value is enough. This asserts the values are plain numbers, not
  // `!important` strings, so a future regression re-adding the inline style
  // conflict here would be caught by a real dimming failure, not silently
  // patched over by re-adding `!important`.
  it('expandable, non-selected items get a plain (non-!important) hover/active opacity', () => {
    const styles = resolve(
      featureFlowItemSx({
        isSelected: false,
        isActive: false,
        isExpanded: false,
        expandable: true,
      })
    );
    const hover = styles['&:hover'] as Record<string, unknown>;
    const active = styles['&:active'] as Record<string, unknown>;

    expect(hover['opacity']).toBe(0.72);
    expect(active['opacity']).toBe(0.56);
  });

  it('selected items get a persistent elevated background', () => {
    const styles = resolve(
      featureFlowItemSx({ isSelected: true, isActive: false, isExpanded: false, expandable: true })
    );
    expect(styles['bgcolor']).toBe('background.paper');
    expect(String(styles['boxShadow'])).toContain('rgba(');
  });

  it('expanded items get an inset accent border colour', () => {
    const styles = resolve(
      featureFlowItemSx({ isSelected: false, isActive: false, isExpanded: true, expandable: true })
    );
    expect(String(styles['borderColor'])).toContain('rgba(var(--mui-palette-primary-mainChannel)');
    expect(String(styles['boxShadow'])).toContain('inset 3px 0 0');
  });

  it('selected items get a tighter :active shadow than :hover, in light mode', () => {
    const styles = resolve(
      featureFlowItemSx({
        isSelected: true,
        isActive: false,
        isExpanded: false,
        expandable: true,
      }),
      mockLightTheme
    );
    const hover = styles['&:hover'] as Record<string, unknown>;
    const active = styles['&:active'] as Record<string, unknown>;

    expect(active).toBeDefined();
    expect(active['opacity']).toBe(1);
    expect(active['boxShadow']).toBe(
      `0 0 1px 0 ${channelAlpha(GREY_500_CHANNEL, 0.04)}, -1px 2px 4px -1px ${channelAlpha(GREY_500_CHANNEL, 0.06)}`
    );
    expect(active['boxShadow']).not.toBe(hover['boxShadow']);
  });

  it('selected items get dark-mode :hover and :active shadow overrides matching the resting dark boxShadow palette', () => {
    // mockTheme's applyStyles passthrough merges the dark branch in directly,
    // so resolving with it simulates dark mode being active.
    const styles = resolve(
      featureFlowItemSx({ isSelected: true, isActive: false, isExpanded: false, expandable: true })
    );
    const hover = styles['&:hover'] as Record<string, unknown>;
    const active = styles['&:active'] as Record<string, unknown>;

    expect(String(hover['boxShadow'])).toBe(
      `0 0 2px 0 ${channelAlpha(COMMON_BLACK_CHANNEL, 0.12)}, -8px 20px 40px -4px ${channelAlpha(COMMON_BLACK_CHANNEL, 0.32)}`
    );
    expect(String(active['boxShadow'])).toBe(
      `0 0 1px 0 ${channelAlpha(COMMON_BLACK_CHANNEL, 0.04)}, -1px 2px 4px -1px ${channelAlpha(COMMON_BLACK_CHANNEL, 0.08)}`
    );
  });
});

describe('imageColumnStickyStackSx', () => {
  it('is sticky on md+, static on mobile', () => {
    expect(imageColumnStickyStackSx).toMatchObject({
      position: { xs: 'relative', md: 'sticky' },
    });
  });

  // Regression test for issue #193: the sticky image column's true DOM
  // sibling at `<section>`'s level (`MotionViewport`, several levels up from
  // this sx) and `FeatureFlowItemDetail`'s wrapping `m.div layout` have no
  // stacking-context-establishing ancestor between them and their nearest
  // shared one — see `imageColumnStickyStackSx`'s own JSDoc for the verified
  // mechanism. Neither previously set `zIndex`, so both stacked at the
  // default `z-index: auto` level — where paint order falls back to DOM
  // order, and the later element (the detail panel/highlight carousel)
  // painted over the sticky photo once they scrolled into overlap. An
  // explicit positive `zIndex` here lifts the image column's stacking
  // context above any `z-index: auto` sibling, independent of DOM order.
  it('[regression] sets an explicit positive zIndex so it paints above the (DOM-later) detail panel', () => {
    const zIndex = getZIndex(imageColumnStickyStackSx);
    expect(typeof zIndex).toBe('number');
    expect(zIndex as number).toBeGreaterThan(0);
  });

  // Regression test for issue #193's acceptance criterion "Verify the
  // floating sub-nav still wins for its own chrome": `FloatingSubNav`'s
  // sticky wrapper (`floating-sub-nav.styles.ts`) sets
  // `zIndex: theme.zIndex.speedDial`. This image column's zIndex must stay
  // below the real value MUI resolves for that token — not a hardcoded
  // copy of it — so this keeps catching a regression even if MUI's default
  // ever changes.
  it("[regression] stays below FloatingSubNav's real zIndex.speedDial so the sub-nav still wins", () => {
    const zIndex = getZIndex(imageColumnStickyStackSx) as number;
    expect(zIndex).toBeLessThan(REAL_SPEED_DIAL_Z_INDEX);
  });
});

describe('imageColumnFrameSx', () => {
  it('gives the active frame full opacity and a 0.4s transition', () => {
    expect(imageColumnFrameSx(true)).toMatchObject({ opacity: 1, transition: 'opacity 0.4s ease' });
  });

  it('gives an inactive frame zero opacity', () => {
    expect(imageColumnFrameSx(false)).toMatchObject({ opacity: 0 });
  });
});

describe('highlightSlideImageSx', () => {
  it('gives the active slide full opacity and a 0.5s transition', () => {
    expect(highlightSlideImageSx(true)).toMatchObject({
      opacity: 1,
      transition: 'opacity 0.5s ease',
      objectFit: 'cover',
    });
  });

  it('gives an inactive slide zero opacity', () => {
    expect(highlightSlideImageSx(false)).toMatchObject({ opacity: 0 });
  });
});
