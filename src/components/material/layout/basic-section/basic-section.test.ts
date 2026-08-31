// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { createElement, createRef } from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react';

import { GiselleThemeProvider } from '../../../theming/theme-provider/giselle/giselle';
import { renderWithTheme } from '../../../../test-utils';
import { BasicSection } from './basic-section';
import type { DecorationElement } from './types';

// ----------------------------------------------------------------------

describe('BasicSection', () => {
  it('renders without crashing', () => {
    expect(() => renderWithTheme(createElement(BasicSection, null, 'content'))).not.toThrow();
  });

  it('renders children', () => {
    const html = renderWithTheme(createElement(BasicSection, null, 'Hello world'));
    expect(html).toContain('Hello world');
  });

  it('forwards arbitrary props to the root element', () => {
    const html = renderWithTheme(
      createElement(BasicSection, { 'data-testid': 'basic-section' } as never, 'content')
    );
    expect(html).toContain('data-testid="basic-section"');
  });

  it('forwards ref to the root <section> element', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const ref = createRef<HTMLElement>();

    act(() => {
      root.render(
        createElement(
          GiselleThemeProvider,
          null,
          createElement(BasicSection, { ref, children: 'content' })
        )
      );
    });

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('SECTION');

    act(() => root.unmount());
    div.remove();
  });

  it('renders the canonical frame by default', () => {
    const html = renderWithTheme(createElement(BasicSection, null, 'content'));
    expect(html).toContain('<svg');
  });

  it('omits all decoration when decoration is false', () => {
    const html = renderWithTheme(
      createElement(BasicSection, { decoration: false, children: 'content' })
    );
    expect(html).not.toContain('<svg');
    expect(html).not.toContain('aria-hidden');
  });

  it('renders exactly the custom set of decoration elements passed as an array', () => {
    const decoration: DecorationElement[] = [
      { kind: 'corner-x', sx: { top: -8, left: -8 } },
      { kind: 'dot', sx: { top: 20, left: 20 } },
    ];
    const html = renderWithTheme(createElement(BasicSection, { decoration, children: 'content' }));

    // 1 <svg> for the corner-x, plus a non-svg dot: exactly one svg element.
    expect(html.match(/<svg/g)).toHaveLength(1);
  });

  it('renders no decoration for an empty array, distinct from the false shorthand', () => {
    const html = renderWithTheme(
      createElement(BasicSection, { decoration: [], children: 'content' })
    );
    expect(html).not.toContain('<svg');
  });

  it('renders a triangle-left and triangle-down accent with their own sx', () => {
    const decoration: DecorationElement[] = [
      { kind: 'triangle-left', sx: { top: 10, left: 10 } },
      { kind: 'triangle-down', sx: { top: 30, left: 30 } },
    ];
    const html = renderWithTheme(createElement(BasicSection, { decoration, children: 'content' }));
    expect(html.match(/<svg/g)).toHaveLength(2);
  });

  it('renders a vertical border-line distinctly from a horizontal one', () => {
    const decoration: DecorationElement[] = [
      { kind: 'border-line', sx: { top: 0, left: 0 } },
      { kind: 'border-line', vertical: true, sx: { top: 0, left: 40 } },
    ];
    const html = renderWithTheme(createElement(BasicSection, { decoration, children: 'content' }));
    expect(html).toContain('aria-hidden="true"');
  });

  it('wraps children in a SectionContainer', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);

    act(() => {
      root.render(
        createElement(
          GiselleThemeProvider,
          null,
          createElement(BasicSection, { children: createElement('span', null, 'content') })
        )
      );
    });

    const container = div.querySelector('.MuiContainer-root');
    expect(container?.textContent).toBe('content');

    act(() => root.unmount());
    div.remove();
  });

  it('forwards containerMaxWidth to the inner SectionContainer', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);

    act(() => {
      root.render(
        createElement(
          GiselleThemeProvider,
          null,
          createElement(BasicSection, { containerMaxWidth: 'sm', children: 'content' })
        )
      );
    });

    expect(div.querySelector('.MuiContainer-maxWidthSm')).not.toBeNull();

    act(() => root.unmount());
    div.remove();
  });

  it('renders unconstrainedChildren as a sibling of the SectionContainer, not nested inside it', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);

    act(() => {
      root.render(
        createElement(
          GiselleThemeProvider,
          null,
          createElement(BasicSection, {
            children: 'content',
            unconstrainedChildren: createElement(
              'div',
              { 'data-testid': 'unconstrained' },
              'outside'
            ),
          })
        )
      );
    });

    const unconstrained = div.querySelector('[data-testid="unconstrained"]');
    const container = div.querySelector('.MuiContainer-root');
    expect(unconstrained).not.toBeNull();
    expect(container?.contains(unconstrained)).toBe(false);

    act(() => root.unmount());
    div.remove();
  });
});
