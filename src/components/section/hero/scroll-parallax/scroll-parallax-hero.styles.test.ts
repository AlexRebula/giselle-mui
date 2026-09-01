// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import type { Theme } from '@mui/material/styles';

type SxFn = (theme: Theme) => Record<string, unknown>;

import {
  heroRootSx,
  heroInnerWrapSx,
  heroContainerSx,
  heroLogoBoxSx,
  heroStackSx,
} from './scroll-parallax-hero.styles';

// ----------------------------------------------------------------------

const mockTheme = {
  breakpoints: {
    up: (key: string) => {
      const map: Record<string, string> = {
        md: '@media (min-width:900px)',
        lg: '@media (min-width:1200px)',
      };
      return map[key] ?? `@media (min-width:${key})`;
    },
  },
  transitions: {
    create: (_props: string | string[]) => 'opacity 300ms ease',
  },
} as unknown as Theme;

// ----------------------------------------------------------------------

describe('heroRootSx', () => {
  it('sets overflow hidden and relative position on root', () => {
    const styles = (heroRootSx as SxFn)(mockTheme);
    expect(styles.overflow).toBe('hidden');
    expect(styles.position).toBe('relative');
  });

  it('applies full-viewport height on md+', () => {
    const styles = (heroRootSx as SxFn)(mockTheme);
    const mdStyles = styles[mockTheme.breakpoints.up('md')] as Record<string, unknown>;
    expect(mdStyles.height).toBe('100vh');
    expect(mdStyles.minHeight).toBe(760);
    expect(mdStyles.maxHeight).toBe(1440);
  });

  it('adds willChange opacity hint on md+ for compositing', () => {
    const styles = (heroRootSx as SxFn)(mockTheme);
    const mdStyles = styles[mockTheme.breakpoints.up('md')] as Record<string, unknown>;
    expect(mdStyles.willChange).toBe('opacity');
  });
});

describe('heroInnerWrapSx', () => {
  it('sets flex column full-width layout', () => {
    const styles = (heroInnerWrapSx as SxFn)(mockTheme);
    expect(styles.display).toBe('flex');
    expect(styles.flexDirection).toBe('column');
    expect(styles.width).toBe(1);
  });

  it('applies position fixed on md+ for the scroll-fixed panel', () => {
    const styles = (heroInnerWrapSx as SxFn)(mockTheme);
    const mdStyles = styles[mockTheme.breakpoints.up('md')] as Record<string, unknown>;
    expect(mdStyles.position).toBe('fixed');
    expect(mdStyles.height).toBe(1);
    expect(mdStyles.minHeight).toBe('300px');
  });
});

describe('heroContainerSx', () => {
  it('sets flex column layout with gap 2', () => {
    const styles = (heroContainerSx as SxFn)(mockTheme);
    expect(styles.display).toBe('flex');
    expect(styles.flexDirection).toBe('column');
    expect(styles.gap).toBe(2);
  });

  it('sets zIndex 9 to float content above background slot', () => {
    const styles = (heroContainerSx as SxFn)(mockTheme);
    expect(styles.zIndex).toBe(9);
  });

  it('aligns items centre', () => {
    const styles = (heroContainerSx as SxFn)(mockTheme);
    expect(styles.alignItems).toBe('center');
  });
});

describe('heroLogoBoxSx', () => {
  it('is a static sx object — position relative, display inline-flex', () => {
    expect((heroLogoBoxSx as Record<string, unknown>).position).toBe('relative');
    expect((heroLogoBoxSx as Record<string, unknown>).display).toBe('inline-flex');
  });
});

describe('heroStackSx', () => {
  it('is a static sx object — text centred', () => {
    expect((heroStackSx as Record<string, unknown>).textAlign).toBe('center');
  });
});
