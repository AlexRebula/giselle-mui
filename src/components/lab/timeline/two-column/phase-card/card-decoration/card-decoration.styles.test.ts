// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import type { Theme } from '@mui/material/styles';

import { buildCardDecorationGradientSx, phaseCardIconBoxSx } from './card-decoration.styles';

const mockTheme = {
  vars: {
    palette: {
      primary: { main: '#2E7D32' },
      error: { main: '#D32F2F' },
      info: { main: '#0288D1' },
    },
  },
} as unknown as Theme;

// ---------------------------------------------------------------------------
// buildCardDecorationGradientSx
// ---------------------------------------------------------------------------

describe('buildCardDecorationGradientSx — decorative gradient', () => {
  it('is absolutely positioned, rotated, and pointer-events none', () => {
    const sxFn = buildCardDecorationGradientSx('info', false) as (
      theme: Theme
    ) => Record<string, unknown>;
    const styles = sxFn(mockTheme);
    expect(styles['position']).toBe('absolute');
    expect(styles['transform']).toBe('rotate(40deg)');
    expect(styles['pointerEvents']).toBe('none');
  });

  it('raises opacity when isOverduePending is true', () => {
    const sxFn = buildCardDecorationGradientSx('info', true) as (
      theme: Theme
    ) => Record<string, unknown>;
    expect(sxFn(mockTheme)['opacity']).toBe(0.18);
  });

  it('uses the lower base opacity when isOverduePending is false', () => {
    const sxFn = buildCardDecorationGradientSx('info', false) as (
      theme: Theme
    ) => Record<string, unknown>;
    expect(sxFn(mockTheme)['opacity']).toBe(0.08);
  });

  it('switches the gradient to the error palette when overdue and pending', () => {
    const sxFn = buildCardDecorationGradientSx('info', true) as (
      theme: Theme
    ) => Record<string, unknown>;
    expect(String(sxFn(mockTheme)['background'])).toContain('#D32F2F');
  });
});

// ---------------------------------------------------------------------------
// phaseCardIconBoxSx
// ---------------------------------------------------------------------------

describe('phaseCardIconBoxSx — corner decorative icon box', () => {
  it('is absolutely positioned in the top-right corner', () => {
    const sxFn = phaseCardIconBoxSx('info', false) as (theme: Theme) => Record<string, unknown>;
    const styles = sxFn(mockTheme);
    expect(styles['position']).toBe('absolute');
    expect(styles['top']).toBe(16);
    expect(styles['right']).toBe(16);
  });

  it('reduces opacity further when not overdue-pending', () => {
    const sxFn = phaseCardIconBoxSx('info', false) as (theme: Theme) => Record<string, unknown>;
    expect(sxFn(mockTheme)['opacity']).toBe(0.35);
  });

  it('raises opacity and switches to error tint when overdue-pending', () => {
    const sxFn = phaseCardIconBoxSx('info', true) as (theme: Theme) => Record<string, unknown>;
    const styles = sxFn(mockTheme);
    expect(styles['opacity']).toBe(0.55);
    expect(styles['color']).toBe('#D32F2F');
  });
});
