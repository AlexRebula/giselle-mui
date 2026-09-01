import { describe, expect, it } from 'vitest';
import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

import {
  imageColumnCardSx,
  imageColumnFrameSx,
  imageColumnInnerGhostSx,
  imageColumnOuterGhostSx,
  imageColumnRevealWrapperSx,
  imageColumnStickyStackSx,
} from './feature-flow-image-column.styles';

// ----------------------------------------------------------------------

const mockTheme = {
  vars: {
    palette: {
      grey: { '500Channel': '145 158 171' },
      common: { blackChannel: '0 0 0' },
    },
  },
  applyStyles: (_mode: string, styles: Record<string, unknown>) => styles,
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

describe('imageColumnCardSx', () => {
  it('applies a palette-tinted drop shadow using channelAlpha', () => {
    const styles = resolve(imageColumnCardSx);
    expect(String(styles['boxShadow'])).toContain('rgba(');
    expect(String(styles['boxShadow'])).toContain('0.16');
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

describe('imageColumnOuterGhostSx', () => {
  it('is invisible and out of the interaction flow', () => {
    expect(imageColumnOuterGhostSx).toMatchObject({
      visibility: 'hidden',
      pointerEvents: 'none',
    });
  });
});

describe('imageColumnInnerGhostSx', () => {
  it('is invisible and out of the interaction flow', () => {
    expect(imageColumnInnerGhostSx).toMatchObject({
      visibility: 'hidden',
      pointerEvents: 'none',
    });
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

describe('imageColumnRevealWrapperSx', () => {
  it('sets its own position so the reveal transform composes independently of the card above', () => {
    expect(imageColumnRevealWrapperSx).toMatchObject({ width: 1, position: 'relative' });
  });
});
