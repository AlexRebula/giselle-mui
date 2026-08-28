// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { createElement, createRef, act } from 'react';
import ReactDOM from 'react-dom/client';

import { renderWithTheme } from '../../../../../test-utils';
import { FaqFloatLine, FaqFloatPlusIcon, FaqFloatTriangleDownIcon } from './faq-accordion-svg';

// ----------------------------------------------------------------------

describe('FaqFloatLine', () => {
  it('has a displayName', () => {
    expect(FaqFloatLine.displayName).toBe('FaqFloatLine');
  });

  it('renders a horizontal line by default', () => {
    const html = renderWithTheme(createElement(FaqFloatLine));
    expect(html).toContain('x1="0"');
    expect(html).toContain('x2="100%"');
  });

  it('renders a vertical line when vertical is set', () => {
    const html = renderWithTheme(createElement(FaqFloatLine, { vertical: true }));
    expect(html).toContain('y1="0"');
    expect(html).toContain('y2="100%"');
  });

  it('forwards arbitrary props to the root svg element', () => {
    const html = renderWithTheme(
      createElement(FaqFloatLine, { 'data-testid': 'float-line' } as never)
    );
    expect(html).toContain('data-testid="float-line"');
  });

  it('forwards ref to the root svg element', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const ref = createRef<SVGSVGElement>();

    act(() => {
      root.render(createElement(FaqFloatLine, { ref }));
    });

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(SVGSVGElement);

    act(() => root.unmount());
    div.remove();
  });
});

// ----------------------------------------------------------------------

describe('FaqFloatPlusIcon', () => {
  it('has a displayName', () => {
    expect(FaqFloatPlusIcon.displayName).toBe('FaqFloatPlusIcon');
  });

  it('renders a 16x16 plus-shaped path', () => {
    const html = renderWithTheme(createElement(FaqFloatPlusIcon));
    expect(html).toContain('width="16"');
    expect(html).toContain('height="16"');
  });

  it('forwards ref to the root svg element', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const ref = createRef<SVGSVGElement>();

    act(() => {
      root.render(createElement(FaqFloatPlusIcon, { ref }));
    });

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(SVGSVGElement);

    act(() => root.unmount());
    div.remove();
  });
});

// ----------------------------------------------------------------------

describe('FaqFloatTriangleDownIcon', () => {
  it('has a displayName', () => {
    expect(FaqFloatTriangleDownIcon.displayName).toBe('FaqFloatTriangleDownIcon');
  });

  it('renders a 20x10 downward triangle path', () => {
    const html = renderWithTheme(createElement(FaqFloatTriangleDownIcon));
    expect(html).toContain('width="20"');
    expect(html).toContain('height="10"');
  });

  it('forwards ref to the root svg element', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const ref = createRef<SVGSVGElement>();

    act(() => {
      root.render(createElement(FaqFloatTriangleDownIcon, { ref }));
    });

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(SVGSVGElement);

    act(() => root.unmount());
    div.remove();
  });
});
