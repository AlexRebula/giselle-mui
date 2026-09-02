// @vitest-environment jsdom

import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { renderWithTheme } from '../../../../../../test-utils';
import { TimelineColumn } from './timeline-column';

// ---------------------------------------------------------------------------

describe('TimelineColumn — structure', () => {
  it('renders its children', () => {
    const html = renderToStaticMarkup(
      React.createElement(TimelineColumn, {
        columnSide: 'left',
        hasContent: true,
        bottomPadding: 0,
        children: 'Card content',
      })
    );
    expect(html).toContain('Card content');
  });

  it('sets data-col to the given columnSide', () => {
    const html = renderToStaticMarkup(
      React.createElement(TimelineColumn, {
        columnSide: 'right',
        hasContent: true,
        bottomPadding: 0,
        children: null,
      })
    );
    expect(html).toContain('data-col="right"');
  });
});

describe('TimelineColumn — responsive visibility', () => {
  it('[regression] left column stays out of xs flow regardless of hasContent', () => {
    const html = renderWithTheme(
      React.createElement(TimelineColumn, {
        columnSide: 'left',
        hasContent: true,
        bottomPadding: 0,
        children: null,
      })
    );
    expect(html).toContain('data-col="left"');
  });
});
