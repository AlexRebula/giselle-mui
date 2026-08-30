import { describe, expect, it } from 'vitest';
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

// ----------------------------------------------------------------------

describe('featureFlowRootSx', () => {
  it('clips horizontal overflow without creating a scroll container', () => {
    expect(featureFlowRootSx).toMatchObject({ overflowX: 'clip', position: 'relative' });
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
  it('tints the background using the primary channel', () => {
    expect(String((detailPanelSx as Record<string, unknown>)['bgcolor'])).toContain(
      'rgba(var(--mui-palette-primary-mainChannel)'
    );
  });

  // Regression test for issue #193: `detailPanelSx` must stay at the default
  // `z-index: auto` stacking level. If it ever gains an explicit `zIndex`,
  // it could re-create a stacking context that outranks
  // `imageColumnStickyStackSx` again, regardless of DOM order — see that
  // sx's own regression test below for the mechanism.
  it("[regression] does not set an explicit zIndex, so it can't out-stack the sticky image column", () => {
    expect((detailPanelSx as Record<string, unknown>)['zIndex']).toBeUndefined();
  });
});

describe('featureFlowItemSx', () => {
  it('non-interactive items get cursor: default and no hover styles', () => {
    const styles = resolve(
      featureFlowItemSx({
        isSelected: false,
        isActive: false,
        isExpanded: false,
        interactive: false,
      })
    );
    expect(styles['cursor']).toBe('default');
    expect(styles['&:hover']).toBeUndefined();
  });

  it('interactive, non-selected items get cursor: pointer and a hover style', () => {
    const styles = resolve(
      featureFlowItemSx({
        isSelected: false,
        isActive: false,
        isExpanded: false,
        interactive: true,
      })
    );
    expect(styles['cursor']).toBe('pointer');
    expect(styles['&:hover']).toBeDefined();
  });

  // Regression test for issue #185: the row is rendered as `component={m.button}`
  // with `variants={fade('inUp', …)}` for its entrance animation. Once that
  // animation settles, framer-motion leaves a permanent inline
  // `style="opacity: 1"` on the element — and inline styles always win over a
  // class-based `:hover`/`:active` rule, no matter how specific, unless that
  // rule carries `!important`. Confirmed live in Storybook: hovering a
  // non-selected item's `getComputedStyle().opacity` stayed `1` even though
  // the `:hover` rule (with `opacity: 0.72`) was present and matched — the
  // rule lost to framer-motion's inline style. Without `!important` here, the
  // dimming half of the hover tint can never actually render.
  it("interactive, non-selected items' hover/active opacity beats framer-motion's persistent inline opacity style with !important", () => {
    const styles = resolve(
      featureFlowItemSx({
        isSelected: false,
        isActive: false,
        isExpanded: false,
        interactive: true,
      })
    );
    const hover = styles['&:hover'] as Record<string, unknown>;
    const active = styles['&:active'] as Record<string, unknown>;

    expect(String(hover['opacity'])).toContain('!important');
    expect(String(active['opacity'])).toContain('!important');
  });

  it('selected items get a persistent elevated background', () => {
    const styles = resolve(
      featureFlowItemSx({ isSelected: true, isActive: false, isExpanded: false, interactive: true })
    );
    expect(styles['bgcolor']).toBe('background.paper');
    expect(String(styles['boxShadow'])).toContain('rgba(');
  });

  it('expanded items get an inset accent border colour', () => {
    const styles = resolve(
      featureFlowItemSx({ isSelected: false, isActive: false, isExpanded: true, interactive: true })
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
        interactive: true,
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
      featureFlowItemSx({ isSelected: true, isActive: false, isExpanded: false, interactive: true })
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

  // Regression test for issue #193: the sticky image column and
  // `FeatureFlowItemDetail` (below it in DOM order) are siblings with no
  // stacking-context-establishing ancestor between them and their nearest
  // shared one. Neither previously set `zIndex`, so both stacked at the
  // default `z-index: auto` level — where paint order falls back to DOM
  // order, and the later element (the detail panel/highlight carousel)
  // painted over the sticky photo once they scrolled into overlap. An
  // explicit positive `zIndex` here lifts the image column's stacking
  // context above any `z-index: auto` sibling, independent of DOM order.
  it('[regression] sets an explicit positive zIndex so it paints above the (DOM-later) detail panel', () => {
    const zIndex = (imageColumnStickyStackSx as Record<string, unknown>)['zIndex'];
    expect(typeof zIndex).toBe('number');
    expect(zIndex as number).toBeGreaterThan(0);
  });

  // Regression test for issue #193's acceptance criterion "Verify the
  // floating sub-nav still wins for its own chrome": `FloatingSubNav`'s
  // sticky wrapper (`floating-sub-nav.styles.ts`) sets
  // `zIndex: theme.zIndex.speedDial` — MUI's default 1050, unmodified by
  // this repo's theme preset. This image column's zIndex must stay below
  // that so the sub-nav still paints on top of it.
  it("[regression] stays below FloatingSubNav's zIndex.speedDial (1050) so the sub-nav still wins", () => {
    const zIndex = (imageColumnStickyStackSx as Record<string, unknown>)['zIndex'] as number;
    expect(zIndex).toBeLessThan(1050);
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
