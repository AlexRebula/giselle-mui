// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import type { Theme } from '@mui/material/styles';

import { stickyWrapperSx, stickyInnerSx, fixedWrapperSx } from './floating-sub-nav.styles';

// ----------------------------------------------------------------------

const mockTheme = {
  zIndex: { speedDial: 1050 },
} as unknown as Theme;

type StyleFn = (theme: Theme) => Record<string, unknown>;

describe('stickyWrapperSx', () => {
  it('uses position sticky', () => {
    const styles = (stickyWrapperSx as unknown as StyleFn)(mockTheme);
    expect(styles.position).toBe('sticky');
  });

  it('sets height 0', () => {
    const styles = (stickyWrapperSx as unknown as StyleFn)(mockTheme);
    expect(styles.height).toBe(0);
  });
});

describe('stickyInnerSx', () => {
  it('floats the pill upward via translateY(-100%)', () => {
    const styles = stickyInnerSx as Record<string, unknown>;
    expect(styles.transform).toBe('translateY(-100%)');
  });

  it('restores pointer events on the inner box', () => {
    const styles = stickyInnerSx as Record<string, unknown>;
    expect(styles.pointerEvents).toBe('auto');
  });
});

describe('fixedWrapperSx', () => {
  it('uses position fixed', () => {
    const styles = (fixedWrapperSx as unknown as StyleFn)(mockTheme);
    expect(styles.position).toBe('fixed');
  });

  it('centres horizontally', () => {
    const styles = (fixedWrapperSx as unknown as StyleFn)(mockTheme);
    expect(styles.left).toBe('50%');
    expect(styles.transform).toBe('translateX(-50%)');
  });
});
