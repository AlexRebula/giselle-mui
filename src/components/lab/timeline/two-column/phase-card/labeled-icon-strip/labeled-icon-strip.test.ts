// @vitest-environment jsdom

import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { renderWithTheme } from '../../../../../../test-utils';
import { LabeledIconStrip } from './labeled-icon-strip';

// ---------------------------------------------------------------------------

describe('LabeledIconStrip — rendering', () => {
  it('renders the label when provided', () => {
    const html = renderWithTheme(
      React.createElement(LabeledIconStrip, {
        label: 'Tech Stack',
        children: React.createElement('span', null, 'children'),
      })
    );
    expect(html).toContain('Tech Stack');
  });

  it('omits the label element when not provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(LabeledIconStrip, {
        children: React.createElement('span', null, 'children'),
      })
    );
    expect(html).not.toContain('overline');
  });

  it('always renders the children', () => {
    const html = renderToStaticMarkup(
      React.createElement(LabeledIconStrip, {
        label: 'Clients',
        children: React.createElement('span', { 'data-testid': 'strip-child' }, 'x'),
      })
    );
    expect(html).toContain('data-testid="strip-child"');
  });
});
