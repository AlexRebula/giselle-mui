// @vitest-environment jsdom

import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { renderWithTheme } from '../../../../../../../test-utils';
import { ScenarioBadge } from './scenario-badge';

// ---------------------------------------------------------------------------

describe('ScenarioBadge — rendering', () => {
  it('renders the scenario label text', () => {
    const html = renderWithTheme(
      React.createElement(ScenarioBadge, { color: 'primary', scenarioLabel: 'Option B' })
    );
    expect(html).toContain('Option B');
  });

  it('renders as an overline Typography pill', () => {
    const html = renderWithTheme(
      React.createElement(ScenarioBadge, { color: 'warning', scenarioLabel: 'Departure scenario' })
    );
    expect(html).toContain('Departure scenario');
  });
});
