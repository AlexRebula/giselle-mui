// @vitest-environment jsdom

import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { renderWithTheme } from '../../../../../../test-utils';
import { DotInner } from './dot-inner';

// ---------------------------------------------------------------------------

describe('DotInner — done state', () => {
  it('renders an animated checkmark svg when done', () => {
    const html = renderWithTheme(
      React.createElement(DotInner, { done: true, icon: null, animationKey: 0, iconSize: 23 })
    );
    expect(html).toContain('polyline');
  });
});

describe('DotInner — not-done state', () => {
  it('renders the provided icon when not done', () => {
    const icon = React.createElement('span', { 'data-testid': 'phase-icon' });
    const html = renderToStaticMarkup(
      React.createElement(DotInner, { done: false, icon, animationKey: 0, iconSize: 23 })
    );
    expect(html).toContain('data-testid="phase-icon"');
  });

  it('renders successfully across animationKey transitions (remount-and-pop)', () => {
    const icon = React.createElement('span', { 'data-testid': 'phase-icon' });
    const first = renderToStaticMarkup(
      React.createElement(DotInner, { done: false, icon, animationKey: 0, iconSize: 23 })
    );
    const second = renderToStaticMarkup(
      React.createElement(DotInner, { done: false, icon, animationKey: 1, iconSize: 23 })
    );
    expect(first).toContain('data-testid="phase-icon"');
    expect(second).toContain('data-testid="phase-icon"');
  });
});
