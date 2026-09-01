import { describe, expect, it } from 'vitest';
import type { Theme } from '@mui/material/styles';

import { channelAlpha } from '../../../utils/theme/theme-utils/theme-utils';
import {
  crossfadeOpacitySx,
  detailPanelSx,
  featureFlowItemSx,
  featureFlowRootSx,
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

describe('crossfadeOpacitySx', () => {
  it('gives the active frame full opacity and the given transition duration', () => {
    expect(crossfadeOpacitySx(true, 0.4)).toMatchObject({
      opacity: 1,
      transition: 'opacity 0.4s ease',
    });
  });

  it('gives an inactive frame zero opacity', () => {
    expect(crossfadeOpacitySx(false, 0.4)).toMatchObject({ opacity: 0 });
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
  // sx's own regression test in `image-column/feature-flow-image-column.styles.test.ts`
  // for the mechanism.
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

// `imageColumnStickyStackSx`/`imageColumnFrameSx` and `highlightSlideImageSx`
// moved to their own sub-components' `.styles.test.ts` files (see
// `image-column/feature-flow-image-column.styles.test.ts` and
// `highlight-carousel/feature-flow-highlight-carousel.styles.test.ts`) — the
// #193 zIndex-stacking regression coverage moved with `imageColumnStickyStackSx`.
