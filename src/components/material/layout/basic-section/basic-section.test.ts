// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { createElement, createRef } from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react';

import { GiselleThemeProvider } from '../../../theming/theme-provider/giselle/giselle';
import { renderWithTheme } from '../../../../test-utils';
import { BasicSection } from './basic-section';

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

  it('renders decoration by default', () => {
    const html = renderWithTheme(createElement(BasicSection, null, 'content'));
    expect(html).toContain('<svg');
  });

  it('omits decoration when decorated is false', () => {
    const html = renderWithTheme(
      createElement(BasicSection, { decorated: false, children: 'content' })
    );
    expect(html).not.toContain('<svg');
  });
});
