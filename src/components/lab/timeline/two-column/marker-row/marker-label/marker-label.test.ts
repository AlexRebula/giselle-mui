// @vitest-environment jsdom

import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { renderWithTheme } from '../../../../../../test-utils';
import { MarkerLabel } from './marker-label';

// ---------------------------------------------------------------------------

describe('MarkerLabel — text content', () => {
  it('renders the title', () => {
    const html = renderToStaticMarkup(React.createElement(MarkerLabel, { title: 'Platform' }));
    expect(html).toContain('Platform');
  });

  it('renders the date inline, separated by a middle dot, when provided', () => {
    const html = renderWithTheme(
      React.createElement(MarkerLabel, { title: 'Platform', date: 'Jan 2024' })
    );
    expect(html).toContain('Platform');
    expect(html).toContain('Jan 2024');
    expect(html).toContain('·');
  });

  it('omits the date span when no date is provided', () => {
    const html = renderWithTheme(React.createElement(MarkerLabel, { title: 'Platform' }));
    expect(html).not.toContain('·');
  });
});
