// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import type { Theme, SxProps } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';

import { metricCardDecorationSx } from './metric-card-decoration.styles';

// ----------------------------------------------------------------------

type SxFactory = (theme: Theme) => CSSObject;

const mockTheme = {
  vars: {
    palette: {
      primary: { main: 'var(--palette-primary-main)' },
      info: { main: 'var(--palette-info-main)' },
    },
  },
} as unknown as Theme;

function resolveFactory(sx: SxProps<Theme>, theme: Theme): CSSObject {
  return (sx as SxFactory)(theme);
}

// ----------------------------------------------------------------------

describe('metricCardDecorationSx', () => {
  it('returns a gradient using the palette color main channel', () => {
    const styles = resolveFactory(metricCardDecorationSx('info'), mockTheme);
    expect(styles.background).toContain('var(--palette-info-main)');
  });

  it('positions decoration absolutely with opacity and rotation', () => {
    const styles = resolveFactory(metricCardDecorationSx('primary'), mockTheme);
    expect(styles.position).toBe('absolute');
    expect(styles.opacity).toBe(0.1);
    expect(styles.transform).toBe('rotate(40deg)');
  });
});
