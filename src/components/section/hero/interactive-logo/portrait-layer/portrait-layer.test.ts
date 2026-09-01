// @vitest-environment jsdom
import type { FadeTransition } from '../types';

import { describe, expect, it, vi } from 'vitest';
import { act, createElement, createRef } from 'react';
import ReactDOM from 'react-dom/client';

import { renderWithTheme } from '../../../../../test-utils';

// ----------------------------------------------------------------------
// Mocks — hoisted before any imports below.

vi.mock('framer-motion', () => ({
  motion: { div: 'div', img: 'img' },
  m: { div: 'div', img: 'img' },
}));

import { PortraitLayer } from './portrait-layer';

// ----------------------------------------------------------------------

const FADE: FadeTransition = { duration: 0.3 };

// ----------------------------------------------------------------------

describe('PortraitLayer', () => {
  it('has a displayName', () => {
    expect(PortraitLayer.displayName).toBe('PortraitLayer');
  });

  it('returns null when portraitSrc is not provided', () => {
    const html = renderWithTheme(
      createElement(PortraitLayer, {
        portraitAlt: 'portrait',
        showPortrait: false,
        portraitFadeTransition: FADE,
      })
    );
    expect(html).toBe('');
  });

  it('includes the portrait alt text in rendered HTML when a src is provided', () => {
    const html = renderWithTheme(
      createElement(PortraitLayer, {
        portraitSrc: '/portrait.jpg',
        portraitAlt: 'Person facing left',
        showPortrait: true,
        portraitFadeTransition: FADE,
      })
    );
    expect(html).toContain('Person facing left');
  });

  it('forwards ref to the root div element', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const ref = createRef<HTMLDivElement>();

    act(() => {
      root.render(
        createElement(PortraitLayer, {
          ref,
          portraitSrc: '/portrait.jpg',
          portraitAlt: 'Person facing left',
          showPortrait: true,
          portraitFadeTransition: FADE,
        })
      );
    });

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);

    act(() => root.unmount());
    div.remove();
  });
});
