// @vitest-environment jsdom

import * as React from 'react';
import { it, expect, describe } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { CardStatusBadge } from './card-status-badge';

// ---------------------------------------------------------------------------

describe('CardStatusBadge', () => {
  it('renders scenario badge when scenario flag and label are provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(CardStatusBadge, {
        color: 'warning',
        isScenario: true,
        scenarioLabel: 'Departure scenario',
      })
    );

    expect(html).toContain('Departure scenario');
  });

  it('returns empty markup when scenario label is missing', () => {
    const html = renderToStaticMarkup(
      React.createElement(CardStatusBadge, {
        color: 'warning',
        isScenario: true,
        scenarioLabel: undefined,
      })
    );

    expect(html).toBe('');
  });

  it('returns empty markup when scenario mode is disabled', () => {
    const html = renderToStaticMarkup(
      React.createElement(CardStatusBadge, {
        color: 'warning',
        isScenario: false,
        scenarioLabel: 'Departure scenario',
      })
    );

    expect(html).toBe('');
  });

  it('renders scenario label when enabled (regression — scenario rendering contract)', () => {
    const html = renderToStaticMarkup(
      React.createElement(CardStatusBadge, {
        color: 'primary',
        isScenario: true,
        scenarioLabel: 'Option B',
      })
    );
    expect(html).toContain('Option B');
  });

  it('renders nothing when scenario mode is disabled (regression — scenario rendering contract)', () => {
    const html = renderToStaticMarkup(
      React.createElement(CardStatusBadge, {
        color: 'primary',
        isScenario: false,
        scenarioLabel: 'Option B',
      })
    );
    expect(html).toBe('');
  });
});
