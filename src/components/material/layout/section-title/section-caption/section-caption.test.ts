// @vitest-environment jsdom
/**
 * Unit tests for SectionCaption.
 *
 * Barrel-exported from `src/index.ts` alongside `SectionTitle`, so this file also covers
 * the standalone public-API expectations: renders, forwards ref, `sx` array-merge, and
 * passthrough props.
 */

import { describe, it, expect } from 'vitest';
import React, { createRef, act } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactDOM from 'react-dom/client';

import { SectionCaption } from './section-caption';

// ----------------------------------------------------------------------

describe('SectionCaption', () => {
  it('has a displayName', () => {
    expect(SectionCaption.displayName).toBe('SectionCaption');
  });

  it('renders caption text', () => {
    const html = renderToStaticMarkup(
      React.createElement(SectionCaption, { title: 'Overline label' })
    );
    expect(html).toContain('Overline label');
  });

  it('renders as a span element', () => {
    const html = renderToStaticMarkup(React.createElement(SectionCaption, { title: 'Label' }));
    expect(html).toContain('<span');
  });

  it('merges an array sx with the base overline styles without throwing', () => {
    expect(() =>
      renderToStaticMarkup(
        React.createElement(SectionCaption, { title: 'Label', sx: [{ opacity: 0.5 }, { mt: 1 }] })
      )
    ).not.toThrow();
  });

  it('forwards arbitrary BoxProps to the root element', () => {
    const html = renderToStaticMarkup(
      React.createElement(SectionCaption, { title: 'Label', 'data-testid': 'caption' } as never)
    );
    expect(html).toContain('data-testid="caption"');
  });

  it('forwards ref to the root element', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const ref = createRef<HTMLSpanElement>();

    act(() => {
      root.render(React.createElement(SectionCaption, { title: 'Label', ref }));
    });

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);

    act(() => root.unmount());
    div.remove();
  });
});
