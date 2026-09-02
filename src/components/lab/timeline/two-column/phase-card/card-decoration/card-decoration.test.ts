// @vitest-environment jsdom

import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { renderWithTheme } from '../../../../../../test-utils';
import { CardDecoration } from './card-decoration';

// ---------------------------------------------------------------------------

describe('CardDecoration — rendering', () => {
  it('renders the gradient shape and the icon slot, both aria-hidden', () => {
    const icon = React.createElement('span', { 'data-testid': 'phase-icon' });
    const html = renderWithTheme(
      React.createElement(CardDecoration, {
        color: 'primary',
        isOverduePending: false,
        icon,
      })
    );
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-testid="phase-icon"');
  });

  it('renders the provided icon node inside the corner box', () => {
    const icon = React.createElement('svg', { 'data-testid': 'custom-icon' });
    const html = renderWithTheme(
      React.createElement(CardDecoration, {
        color: 'info',
        isOverduePending: true,
        icon,
      })
    );
    expect(html).toContain('data-testid="custom-icon"');
  });
});
