// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { createElement, createRef, act } from 'react';
import ReactDOM from 'react-dom/client';

// useMediaQuery requires window.matchMedia which jsdom does not support — mock to a fixed value.
vi.mock('@mui/material/useMediaQuery', () => ({ default: vi.fn(() => false) }));

// framer-motion's `whileInView` mounts a real IntersectionObserver, which jsdom does not
// implement — stub it so a full client render (ReactDOM.createRoot) doesn't throw.
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

import { renderWithTheme } from '../../../../../test-utils';
import { FaqMotionViewport } from './faq-motion-viewport';

// ----------------------------------------------------------------------

describe('FaqMotionViewport', () => {
  it('has a displayName', () => {
    expect(FaqMotionViewport.displayName).toBe('FaqMotionViewport');
  });

  it('renders its children', () => {
    const html = renderWithTheme(
      createElement(FaqMotionViewport, { children: createElement('span', {}, 'child content') })
    );
    expect(html).toContain('child content');
  });

  it('forwards ref to the root element', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const ref = createRef<HTMLDivElement>();

    act(() => {
      root.render(createElement(FaqMotionViewport, { ref, children: 'content' }));
    });

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);

    act(() => root.unmount());
    div.remove();
  });
});
