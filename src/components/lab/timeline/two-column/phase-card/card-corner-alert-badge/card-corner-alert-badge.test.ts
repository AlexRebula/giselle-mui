// @vitest-environment jsdom

import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { renderWithTheme } from '../../../../../../test-utils';
import { CardCornerAlertBadge } from './card-corner-alert-badge';
import {
  CORNER_ALERT_ICON_SIZE,
  CORNER_ALERT_LIST_ICON_SIZE,
  CORNER_ALERT_BADGE_SIZE,
} from './card-corner-alert-badge.const';

// ---------------------------------------------------------------------------

describe('CardCornerAlertBadge — rendering', () => {
  it('renders nothing when there are no alerts', () => {
    const html = renderToStaticMarkup(React.createElement(CardCornerAlertBadge, { alerts: [] }));
    expect(html).toBe('');
  });

  it('renders a Tooltip-wrapped badge in read-only mode (no onClick)', () => {
    const html = renderWithTheme(
      React.createElement(CardCornerAlertBadge, {
        alerts: [{ message: 'Overdue — past due date', severity: 'error' }],
      })
    );
    expect(html).toContain('aria-label="1 issue"');
    expect(html).not.toContain('role="button"');
  });

  it('renders as an interactive button when onClick is provided', () => {
    const html = renderWithTheme(
      React.createElement(CardCornerAlertBadge, {
        alerts: [{ message: 'Date overlap with another phase', severity: 'warning' }],
        onClick: () => {},
      })
    );
    expect(html).toContain('role="button"');
  });

  it('aria-label reflects the alert count, pluralised', () => {
    const html = renderWithTheme(
      React.createElement(CardCornerAlertBadge, {
        alerts: [
          { message: 'a', severity: 'error' },
          { message: 'b', severity: 'warning' },
        ],
        onClick: () => {},
      })
    );
    expect(html).toContain('aria-label="2 issues"');
  });
});

// ---------------------------------------------------------------------------
// Readability — minimum size constants (regression)
// ---------------------------------------------------------------------------

const MIN_ICON_SIZE_PX = 16;

describe('readability — minimum size constants', () => {
  it('[regression] CORNER_ALERT_ICON_SIZE >= 16px (corner badge icon must be readable)', () => {
    expect(CORNER_ALERT_ICON_SIZE).toBeGreaterThanOrEqual(MIN_ICON_SIZE_PX);
  });

  it('[regression] CORNER_ALERT_LIST_ICON_SIZE >= 16px (tooltip list icon must be readable)', () => {
    expect(CORNER_ALERT_LIST_ICON_SIZE).toBeGreaterThanOrEqual(MIN_ICON_SIZE_PX);
  });

  it('[regression] CORNER_ALERT_BADGE_SIZE >= 26px (corner badge circle must be large enough)', () => {
    expect(CORNER_ALERT_BADGE_SIZE).toBeGreaterThanOrEqual(26);
  });
});
