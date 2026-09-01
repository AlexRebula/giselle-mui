// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import type { Theme } from '@mui/material/styles';

import { pillSx } from './nav-pill.styles';

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

describe('pillSx', () => {
  it('sets bgcolor background.paper', () => {
    const styles = (pillSx as unknown as StyleFn)(mockTheme);
    expect(styles.bgcolor).toBe('background.paper');
  });

  it('builds border from grey channel', () => {
    const styles = (pillSx as unknown as StyleFn)(mockTheme);
    expect(String(styles.border)).toContain('rgba(145 158 171');
  });
});
