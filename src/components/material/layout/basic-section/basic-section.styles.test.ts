import { describe, expect, it } from 'vitest';
import { createTheme } from '@mui/material/styles';

import { basicSectionRootSx, borderLineSx, cornerMarkSx } from './basic-section.styles';

// ----------------------------------------------------------------------

const theme = createTheme();

type StyleFn = (theme: ReturnType<typeof createTheme>) => Record<string, unknown>;

function resolve<T>(sx: T) {
  return (sx as unknown as StyleFn)(theme);
}

// ----------------------------------------------------------------------

describe('basicSectionRootSx', () => {
  it('clips horizontal overflow and establishes a positioning context', () => {
    expect(basicSectionRootSx).toMatchObject({ position: 'relative', overflowX: 'clip' });
  });
});

describe('cornerMarkSx', () => {
  it('positions the top-left mark at the corner inset', () => {
    const styles = resolve(cornerMarkSx('top-left'));
    expect(styles['top']).toBe(72);
    expect(styles['left']).toBe(72);
    expect(styles['bottom']).toBeUndefined();
  });

  it('positions the bottom-left mark at the corner inset', () => {
    const styles = resolve(cornerMarkSx('bottom-left'));
    expect(styles['bottom']).toBe(72);
    expect(styles['left']).toBe(72);
    expect(styles['top']).toBeUndefined();
  });

  it('is hidden below the decoration breakpoint and visible above it', () => {
    const styles = resolve(cornerMarkSx('top-left'));
    expect(styles['display']).toBe('none');
    expect(styles['@media (min-width:1440px)']).toMatchObject({ display: 'block' });
  });
});

describe('borderLineSx', () => {
  it('spans full width as a horizontal line at top', () => {
    const styles = resolve(borderLineSx('top'));
    expect(styles['width']).toBe(1);
    expect(styles['top']).toBe(80);
    expect(styles['borderTop']).toBe('1px dashed');
  });

  it('spans full width as a horizontal line at bottom', () => {
    const styles = resolve(borderLineSx('bottom'));
    expect(styles['width']).toBe(1);
    expect(styles['bottom']).toBe(80);
  });

  it('spans full height as a vertical line at left', () => {
    const styles = resolve(borderLineSx('left'));
    expect(styles['height']).toBe(1);
    expect(styles['left']).toBe(80);
    expect(styles['borderLeft']).toBe('1px dashed');
  });
});
