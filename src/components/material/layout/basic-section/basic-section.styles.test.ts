import { describe, expect, it } from 'vitest';
import { createTheme } from '@mui/material/styles';

import {
  CANONICAL_FRAME,
  CORNER_MARK_INSET,
  HORIZONTAL_LINE_INSET,
  VERTICAL_LINE_INSET,
  basicSectionRootSx,
  borderLineSx,
  cornerPlusSx,
  cornerXSx,
  dotSx,
  triangleDownSx,
  triangleLeftSx,
} from './basic-section.styles';

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

describe('cornerPlusSx', () => {
  it('sizes the mark at 16x16, with no built-in position', () => {
    const styles = resolve(cornerPlusSx);
    expect(styles['width']).toBe(16);
    expect(styles['height']).toBe(16);
    expect(styles['top']).toBeUndefined();
    expect(styles['left']).toBeUndefined();
  });

  it('is hidden below the decoration breakpoint and visible above it', () => {
    const styles = resolve(cornerPlusSx);
    expect(styles['display']).toBe('none');
    expect(styles['@media (min-width:1440px)']).toMatchObject({ display: 'block' });
  });
});

describe('cornerXSx', () => {
  it('sizes the mark at 16x16, with no built-in position', () => {
    const styles = resolve(cornerXSx);
    expect(styles['width']).toBe(16);
    expect(styles['height']).toBe(16);
  });
});

describe('borderLineSx', () => {
  it('defaults to a horizontal line', () => {
    const styles = resolve(borderLineSx());
    expect(styles['width']).toBe(1);
    expect(styles['height']).toBe(0);
    expect(styles['borderTop']).toBe('1px dashed');
  });

  it('renders a vertical line when vertical is true', () => {
    const styles = resolve(borderLineSx(true));
    expect(styles['width']).toBe(0);
    expect(styles['height']).toBe(1);
    expect(styles['borderLeft']).toBe('1px dashed');
  });
});

describe('triangleLeftSx', () => {
  it('sizes the triangle at 10x20', () => {
    const styles = resolve(triangleLeftSx);
    expect(styles['width']).toBe(10);
    expect(styles['height']).toBe(20);
  });
});

describe('triangleDownSx', () => {
  it('sizes the triangle at 20x10', () => {
    const styles = resolve(triangleDownSx);
    expect(styles['width']).toBe(20);
    expect(styles['height']).toBe(10);
  });
});

describe('dotSx', () => {
  it('renders a filled 12x12 circle', () => {
    const styles = resolve(dotSx);
    expect(styles['width']).toBe(12);
    expect(styles['height']).toBe(12);
    expect(styles['borderRadius']).toBe('50%');
    expect(styles['bgcolor']).toBe('currentColor');
  });
});

describe('CANONICAL_FRAME', () => {
  it('is 2 corner-plus marks and 3 border-lines, at the documented insets', () => {
    expect(CANONICAL_FRAME).toHaveLength(5);

    const cornerMarks = CANONICAL_FRAME.filter((el) => el.kind === 'corner-plus');
    expect(cornerMarks).toHaveLength(2);
    expect(cornerMarks.map((el) => el.sx)).toContainEqual({
      top: CORNER_MARK_INSET,
      left: CORNER_MARK_INSET,
    });
    expect(cornerMarks.map((el) => el.sx)).toContainEqual({
      bottom: CORNER_MARK_INSET,
      left: CORNER_MARK_INSET,
    });

    const lines = CANONICAL_FRAME.filter((el) => el.kind === 'border-line');
    expect(lines).toHaveLength(3);
    expect(lines.filter((el) => el.vertical)).toHaveLength(1);
    expect(lines.find((el) => el.vertical)?.sx).toMatchObject({ left: VERTICAL_LINE_INSET });
    expect(lines.filter((el) => !el.vertical).map((el) => el.sx)).toContainEqual({
      top: HORIZONTAL_LINE_INSET,
      left: 0,
    });
    expect(lines.filter((el) => !el.vertical).map((el) => el.sx)).toContainEqual({
      bottom: HORIZONTAL_LINE_INSET,
      left: 0,
    });
  });
});
