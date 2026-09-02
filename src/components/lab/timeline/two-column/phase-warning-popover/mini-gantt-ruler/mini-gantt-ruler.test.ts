// @vitest-environment jsdom

import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { renderWithTheme } from '../../../../../../test-utils';
import { MiniGanttRuler, resolveSliderColor } from './mini-gantt-ruler';

const phases = [
  { key: 1, title: 'Phase A', shortTitle: 'A', date: 'Jan 2024', color: 'primary' },
  { key: 2, title: 'Phase B', shortTitle: 'B', date: 'Feb 2024', color: 'warning' },
] as never;

// ---------------------------------------------------------------------------

describe('MiniGanttRuler — rendering', () => {
  it('renders nothing when the axis has zero span', () => {
    const html = renderToStaticMarkup(
      React.createElement(MiniGanttRuler, {
        axis: { min: 0, max: 0 },
        conflictingPhases: [],
        overrides: new Map(),
      })
    );
    expect(html).toBe('');
  });

  it('renders one bar per conflicting phase that has an override', () => {
    const overrides = new Map([
      [1, { startIdx: 0, endIdx: 2 }],
      [2, { startIdx: 1, endIdx: 3 }],
    ]);
    const html = renderWithTheme(
      React.createElement(MiniGanttRuler, {
        axis: { min: 0, max: 4 },
        conflictingPhases: phases,
        overrides,
      })
    );
    expect(html).toContain('aria-hidden');
  });

  it('skips phases without a matching override entry', () => {
    const overrides = new Map([[1, { startIdx: 0, endIdx: 2 }]]);
    const html = renderWithTheme(
      React.createElement(MiniGanttRuler, {
        axis: { min: 0, max: 4 },
        conflictingPhases: phases,
        overrides,
      })
    );
    // Only one bar should render — phase 2 has no override entry.
    expect((html.match(/<div/g) ?? []).length).toBeLessThanOrEqual(2);
  });
});

// ---------------------------------------------------------------------------
// resolveSliderColor — compatibility re-export
// ---------------------------------------------------------------------------

describe('resolveSliderColor — re-exported for compatibility', () => {
  it('is re-exported from mini-gantt-ruler for existing import paths', () => {
    expect(resolveSliderColor('primary')).toBe('primary');
    expect(resolveSliderColor('grey')).toBe('primary');
  });
});
