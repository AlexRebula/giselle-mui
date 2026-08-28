// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import type { Theme } from '@mui/material/styles';

import { floatDecorationBase } from './faq-accordion-svg.styles';

// ----------------------------------------------------------------------

const mockTheme = {
  breakpoints: {
    up: (bp: number) => `@media (min-width:${bp}px)`,
  },
} as unknown as Theme;

// ----------------------------------------------------------------------

describe('floatDecorationBase', () => {
  it('is hidden by default (display: none)', () => {
    const styles = floatDecorationBase(mockTheme);
    expect(styles['display']).toBe('none');
  });

  it('shows at ≥1440 px breakpoint', () => {
    const styles = floatDecorationBase(mockTheme);
    const mediaKey = '@media (min-width:1440px)';
    expect(styles[mediaKey]).toEqual({ display: 'block' });
  });

  it('is absolutely positioned with z-index 2', () => {
    const styles = floatDecorationBase(mockTheme);
    expect(styles['position']).toBe('absolute');
    expect(styles['zIndex']).toBe(2);
  });
});
