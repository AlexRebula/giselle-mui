// @vitest-environment jsdom

import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { renderWithTheme } from '../../../../../../test-utils';
import { CardDetailBullets } from './card-detail-bullets';
import { PHASE_TASK_ICON_SIZE } from './card-detail-bullets.const';

const details = [
  { key: 'a', title: 'First task' },
  { key: 'b', title: 'Second task' },
];

// ---------------------------------------------------------------------------

describe('CardDetailBullets — read-only mode', () => {
  it('renders every task title', () => {
    const html = renderWithTheme(
      React.createElement(CardDetailBullets, { id: 'details-1', details, in: true })
    );
    expect(html).toContain('First task');
    expect(html).toContain('Second task');
  });

  it('renders task icons as static spans (no onToggleTask)', () => {
    const html = renderToStaticMarkup(
      React.createElement(CardDetailBullets, { id: 'details-1', details, in: true })
    );
    expect(html).not.toContain('type="button"');
  });
});

describe('CardDetailBullets — interactive mode', () => {
  it('renders task toggles as buttons with aria-pressed when onToggleTask is provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(CardDetailBullets, {
        id: 'details-1',
        details,
        in: true,
        onToggleTask: () => {},
      })
    );
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-pressed');
  });

  it('reflects done state from taskDoneStates', () => {
    const html = renderToStaticMarkup(
      React.createElement(CardDetailBullets, {
        id: 'details-1',
        details,
        in: true,
        taskDoneStates: { a: true },
        onToggleTask: () => {},
      })
    );
    expect(html).toContain('aria-pressed="true"');
  });
});

// ---------------------------------------------------------------------------
// Readability — minimum size constants (regression)
// ---------------------------------------------------------------------------

describe('readability — minimum size constants', () => {
  it('[regression] PHASE_TASK_ICON_SIZE >= 16px (inline icon minimum)', () => {
    expect(PHASE_TASK_ICON_SIZE).toBeGreaterThanOrEqual(16);
  });
});
