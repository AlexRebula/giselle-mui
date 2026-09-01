// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { createElement, createRef, act } from 'react';
import ReactDOM from 'react-dom/client';

import { renderWithTheme } from '../../../../../../test-utils';
import { StatCardShape } from './stat-card-shape';

// ----------------------------------------------------------------------

describe('StatCardShape', () => {
  it('has a displayName', () => {
    expect(StatCardShape.displayName).toBe('StatCardShape');
  });

  it('renders a 120x120 viewBox with two overlapping rounded-square shapes', () => {
    const html = renderWithTheme(createElement(StatCardShape));
    expect(html).toContain('viewBox="0 0 120 120"');
    expect(html.match(/<rect/g)).toHaveLength(2);
  });

  it('uses currentColor fill so it inherits the parent color token', () => {
    const html = renderWithTheme(createElement(StatCardShape));
    expect(html).toContain('fill="currentColor"');
  });

  it('forwards arbitrary props to the root svg element', () => {
    const html = renderWithTheme(
      createElement(StatCardShape, { 'data-testid': 'stat-card-shape' } as never)
    );
    expect(html).toContain('data-testid="stat-card-shape"');
  });

  it('forwards ref to the root svg element', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const ref = createRef<SVGSVGElement>();

    act(() => {
      root.render(createElement(StatCardShape, { ref }));
    });

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(SVGSVGElement);

    act(() => root.unmount());
    div.remove();
  });
});
