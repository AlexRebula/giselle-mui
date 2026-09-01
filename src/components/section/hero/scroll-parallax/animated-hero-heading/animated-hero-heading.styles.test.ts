// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import type { Theme } from '@mui/material/styles';

type SxFn = (theme: Theme) => Record<string, unknown>;

import { headingH1Sx, headingHighlightSx } from './animated-hero-heading.styles';

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
  typography: {
    pxToRem: (px: number) => `${(px / 16).toFixed(4)}rem`,
  },
  vars: {
    palette: {
      primary: { main: 'var(--mui-palette-primary-main)', dark: 'var(--mui-palette-primary-dark)' },
      warning: { main: 'var(--mui-palette-warning-main)' },
    },
  },
} as unknown as Theme;

// ----------------------------------------------------------------------

describe('headingH1Sx', () => {
  it('caps heading width at 680px', () => {
    const styles = (headingH1Sx as SxFn)(mockTheme);
    expect(styles.maxWidth).toBe(680);
  });

  it('enables flex wrap for inline gradient span', () => {
    const styles = (headingH1Sx as SxFn)(mockTheme);
    expect(styles.display).toBe('flex');
    expect(styles.flexWrap).toBe('wrap');
  });

  it('centres heading text', () => {
    const styles = (headingH1Sx as SxFn)(mockTheme);
    expect(styles.justifyContent).toBe('center');
  });

  it('bumps font size to 72px equivalent on lg+ via pxToRem', () => {
    const styles = (headingH1Sx as SxFn)(mockTheme);
    const lgStyles = styles[mockTheme.breakpoints.up('lg')] as Record<string, unknown>;
    expect(lgStyles.fontSize).toBe('4.5000rem');
  });
});

describe('headingHighlightSx', () => {
  it('uses CSS linear-gradient with primary and warning palette tokens', () => {
    const styles = (headingHighlightSx as SxFn)(mockTheme);
    expect(styles.backgroundImage).toContain('linear-gradient');
    expect(styles.backgroundImage).toContain('var(--mui-palette-primary-main)');
    expect(styles.backgroundImage).toContain('var(--mui-palette-warning-main)');
  });

  it('sets 400% background-size for gradient animation range', () => {
    const styles = (headingHighlightSx as SxFn)(mockTheme);
    expect(styles.backgroundSize).toBe('400%');
  });

  it('[regression] clips background to text shape — both -webkit and standard', () => {
    const styles = (headingHighlightSx as SxFn)(mockTheme);
    expect(styles.backgroundClip).toBe('text');
    expect(styles.WebkitBackgroundClip).toBe('text');
  });

  it('[regression] uses WebkitTextFillColor transparent — required for Safari gradient text', () => {
    const styles = (headingHighlightSx as SxFn)(mockTheme);
    expect(styles.WebkitTextFillColor).toBe('transparent');
  });
});
