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

import { ArtisticLogoLayer } from './artistic-logo-layer';

// ----------------------------------------------------------------------

const FADE: FadeTransition = { duration: 0.3 };

// ----------------------------------------------------------------------

describe('ArtisticLogoLayer', () => {
  it('has a displayName', () => {
    expect(ArtisticLogoLayer.displayName).toBe('ArtisticLogoLayer');
  });

  it('returns null when artisticLogoSrc is not provided', () => {
    const html = renderWithTheme(
      createElement(ArtisticLogoLayer, { showArtisticLogo: false, logoFadeTransition: FADE })
    );
    expect(html).toBe('');
  });

  it('uses logoAlt as the alt text when provided', () => {
    const html = renderWithTheme(
      createElement(ArtisticLogoLayer, {
        artisticLogoSrc: '/artistic.png',
        showArtisticLogo: true,
        logoFadeTransition: FADE,
        logoAlt: 'Custom artistic logo',
      })
    );
    expect(html).toContain('Custom artistic logo');
  });

  it('falls back to Logo as the alt text when logoAlt is not provided', () => {
    const html = renderWithTheme(
      createElement(ArtisticLogoLayer, {
        artisticLogoSrc: '/artistic.png',
        showArtisticLogo: true,
        logoFadeTransition: FADE,
      })
    );
    expect(html).toContain('Logo');
  });

  it('forwards ref to the root img element', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const ref = createRef<HTMLImageElement>();

    act(() => {
      root.render(
        createElement(ArtisticLogoLayer, {
          ref,
          artisticLogoSrc: '/artistic.png',
          showArtisticLogo: true,
          logoFadeTransition: FADE,
        })
      );
    });

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLImageElement);

    act(() => root.unmount());
    div.remove();
  });
});
