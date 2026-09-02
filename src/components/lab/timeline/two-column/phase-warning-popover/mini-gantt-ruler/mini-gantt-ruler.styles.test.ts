// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import type { Theme } from '@mui/material/styles';

import { ganttTrackSx, ganttBarSx } from './mini-gantt-ruler.styles';

const mockTheme = {
  vars: {
    palette: {
      primary: { main: '#2E7D32' },
      warning: { main: '#ED6C02' },
    },
  },
} as unknown as Theme;

// ----------------------------------------------------------------------

describe('ganttTrackSx', () => {
  it('is relatively positioned with a subtle background', () => {
    expect(ganttTrackSx).toMatchObject({
      position: 'relative',
      bgcolor: 'action.hover',
    });
  });
});

describe('ganttBarSx', () => {
  it('positions the bar using leftPct/widthPct as percentages', () => {
    const sxFn = ganttBarSx(10, 25, false, 'primary') as (theme: Theme) => Record<string, unknown>;
    const styles = sxFn(mockTheme);
    expect(styles['left']).toBe('10%');
    expect(styles['width']).toBe('25%');
    expect(styles['position']).toBe('absolute');
  });

  it('uses a solid fill and full opacity when not overlapping', () => {
    const sxFn = ganttBarSx(0, 50, false, 'primary') as (theme: Theme) => Record<string, unknown>;
    const styles = sxFn(mockTheme);
    expect(styles['opacity']).toBe(1);
    expect(styles['bgcolor']).toBe('#2E7D32');
  });

  it('uses a striped background and reduced opacity when overlapping', () => {
    const sxFn = ganttBarSx(0, 50, true, 'warning') as (theme: Theme) => Record<string, unknown>;
    const styles = sxFn(mockTheme);
    expect(styles['opacity']).toBe(0.7);
    expect(styles['bgcolor']).toBe('transparent');
    expect(String(styles['background'])).toContain('repeating-linear-gradient');
  });
});
