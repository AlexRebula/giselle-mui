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

import { OriginalLogoLayer } from './original-logo-layer';

// ----------------------------------------------------------------------

const FADE: FadeTransition = { duration: 0.3 };

// ----------------------------------------------------------------------

describe('OriginalLogoLayer', () => {
  it('has a displayName', () => {
    expect(OriginalLogoLayer.displayName).toBe('OriginalLogoLayer');
  });

  it('renders slotted children when no activeFrame is provided', () => {
    const html = renderWithTheme(
      createElement(
        OriginalLogoLayer,
        { hoverPhase: 'idle', logoFadeTransition: FADE },
        createElement('span', { 'data-testid': 'slot' }, 'logo-child')
      )
    );
    expect(html).toContain('logo-child');
  });

  it('renders the frame image when activeFrame is provided', () => {
    const html = renderWithTheme(
      createElement(OriginalLogoLayer, {
        hoverPhase: 'artistic',
        logoFadeTransition: FADE,
        activeFrame: '/frame-01.png',
        logoAlt: 'Frame logo',
      })
    );
    expect(html).toContain('/frame-01.png');
    expect(html).toContain('Frame logo');
  });

  it('uses Logo as alt fallback when no logoAlt provided', () => {
    const html = renderWithTheme(
      createElement(OriginalLogoLayer, {
        hoverPhase: 'artistic',
        logoFadeTransition: FADE,
        activeFrame: '/frame-01.png',
      })
    );
    expect(html).toContain('Logo');
  });

  it('forwards ref to the root div element', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const ref = createRef<HTMLDivElement>();

    act(() => {
      root.render(
        createElement(OriginalLogoLayer, {
          ref,
          hoverPhase: 'idle',
          logoFadeTransition: FADE,
        })
      );
    });

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);

    act(() => root.unmount());
    div.remove();
  });
});
