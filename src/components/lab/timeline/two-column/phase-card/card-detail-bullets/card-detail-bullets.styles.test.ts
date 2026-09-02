// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';

import {
  detailBulletsContainerSx,
  taskRowSx,
  taskToggleButtonSx,
  taskIconStaticSx,
  taskTitleSx,
  taskToggleColorSx,
  taskIconColorSx,
} from './card-detail-bullets.styles';

// ---------------------------------------------------------------------------
// detailBulletsContainerSx
// ---------------------------------------------------------------------------

describe('detailBulletsContainerSx — expandable bullet list container', () => {
  it('has top border separator and vertical gap', () => {
    const sx = detailBulletsContainerSx as Record<string, unknown>;
    expect(sx['borderTop']).toBe('1px solid');
    expect(sx['gap']).toBe(0.75);
  });

  it('is a column flex with spacing above the separator', () => {
    const sx = detailBulletsContainerSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexDirection']).toBe('column');
    expect(sx['mt']).toBe(1.5);
    expect(sx['pt']).toBe(1.5);
  });
});

// ---------------------------------------------------------------------------
// taskRowSx / taskToggleButtonSx / taskIconStaticSx
// ---------------------------------------------------------------------------

describe('taskRowSx — task row layout', () => {
  it('is a flex row with small gap and vertical padding', () => {
    expect(taskRowSx).toMatchObject({
      display: 'flex',
      alignItems: 'center',
      gap: 0.75,
      py: 0.25,
    });
  });
});

describe('taskToggleButtonSx — interactive toggle icon', () => {
  it('resets button chrome and shows a pointer cursor', () => {
    const sx = taskToggleButtonSx as Record<string, unknown>;
    expect(sx['all']).toBe('unset');
    expect(sx['cursor']).toBe('pointer');
  });
});

describe('taskIconStaticSx — read-only icon', () => {
  it('is a flex item with no shrink', () => {
    expect(taskIconStaticSx).toMatchObject({
      display: 'flex',
      flexShrink: 0,
    });
  });
});

// ---------------------------------------------------------------------------
// taskTitleSx / taskToggleColorSx / taskIconColorSx — done-state colour
// ---------------------------------------------------------------------------

describe('taskTitleSx — task title text', () => {
  it('strikes through and dims when done', () => {
    const sx = taskTitleSx(true) as Record<string, unknown>;
    expect(sx['textDecoration']).toBe('line-through');
    expect(sx['color']).toBe('text.disabled');
  });

  it('is plain secondary text when not done', () => {
    const sx = taskTitleSx(false) as Record<string, unknown>;
    expect(sx['textDecoration']).toBe('none');
    expect(sx['color']).toBe('text.secondary');
  });
});

describe('taskToggleColorSx — interactive toggle colour', () => {
  it('is success-green when done, disabled grey when not', () => {
    expect((taskToggleColorSx(true) as Record<string, unknown>)['color']).toBe('success.main');
    expect((taskToggleColorSx(false) as Record<string, unknown>)['color']).toBe('text.disabled');
  });
});

describe('taskIconColorSx — read-only icon colour', () => {
  it('is success-green when done, disabled grey when not', () => {
    expect((taskIconColorSx(true) as Record<string, unknown>)['color']).toBe('success.main');
    expect((taskIconColorSx(false) as Record<string, unknown>)['color']).toBe('text.disabled');
  });
});
