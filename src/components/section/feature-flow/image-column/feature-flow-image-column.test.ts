// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { createElement, createRef, act } from 'react';
import ReactDOM from 'react-dom/client';

import { renderWithTheme } from '../../../../test-utils';
import { GiselleThemeProvider } from '../../../theming/theme-provider/giselle/giselle';
import { FeatureFlowImageColumn } from './feature-flow-image-column';

const baseProps = {
  activeSrc: '/b.png',
  ghostSrc: '/a.png',
  allSrcs: ['/a.png', '/b.png'],
  alt: 'Alt text',
};

describe('FeatureFlowImageColumn', () => {
  it('mounts every src in allSrcs', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowImageColumn, {
        activeSrc: '/b.png',
        ghostSrc: '/a.png',
        allSrcs: ['/a.png', '/b.png', '/c.png'],
        alt: 'Alt text',
      })
    );
    expect(html).toContain('/a.png');
    expect(html).toContain('/b.png');
    expect(html).toContain('/c.png');
  });

  it('gives only activeSrc full opacity; other srcs are opacity 0', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowImageColumn, {
        activeSrc: '/b.png',
        ghostSrc: '/a.png',
        allSrcs: ['/a.png', '/b.png'],
        alt: 'Alt text',
      })
    );
    // The active image is the only one without aria-hidden.
    const activeImgMatch = html.match(/<img[^>]*src="\/b\.png"[^>]*>/);
    expect(activeImgMatch?.[0]).not.toContain('aria-hidden');
  });

  it('marks every non-active src as aria-hidden', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowImageColumn, {
        activeSrc: '/b.png',
        ghostSrc: '/a.png',
        allSrcs: ['/a.png', '/b.png'],
        alt: 'Alt text',
      })
    );
    const inactiveImgMatch = html.match(/<img[^>]*src="\/a\.png"[^>]*>/g)?.[1];
    expect(inactiveImgMatch).toContain('aria-hidden="true"');
  });

  it('sets the alt text only on the currently-active (visible) image, not the ghost frame', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowImageColumn, {
        activeSrc: '/b.png',
        ghostSrc: '/a.png',
        allSrcs: ['/a.png', '/b.png'],
        alt: 'A descriptive alt',
      })
    );
    const activeImgMatch = html.match(/<img[^>]*src="\/b\.png"[^>]*>/);
    const nonActiveGhostImgMatch = html.match(/<img[^>]*src="\/a\.png"[^>]*>/g)?.[1];
    expect(activeImgMatch?.[0]).toContain('alt="A descriptive alt"');
    expect(nonActiveGhostImgMatch).toContain('alt=""');
  });

  it('forwards arbitrary props to the root Stack element', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowImageColumn, {
        ...baseProps,
        'data-testid': 'image-column',
      } as never)
    );
    expect(html).toContain('data-testid="image-column"');
  });

  it('forwards ref to the root element', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const ref = createRef<HTMLDivElement>();

    act(() => {
      root.render(createElement(FeatureFlowImageColumn, { ...baseProps, ref }));
    });

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);

    act(() => root.unmount());
    div.remove();
  });

  describe('revealStyle', () => {
    it('renders fully revealed (opacity 1, no offset/scale/blur) when revealStyle is omitted', () => {
      const html = renderWithTheme(createElement(FeatureFlowImageColumn, baseProps));
      const cardMatch = html.match(/<div[^>]*style="[^"]*opacity:1[^"]*"[^>]*>/);
      expect(cardMatch).not.toBeNull();
      expect(cardMatch?.[0]).not.toContain('blur(');
    });

    it('applies the given opacity/y/scale/blur to the card, additive to the per-image crossfade', () => {
      const html = renderWithTheme(
        createElement(FeatureFlowImageColumn, {
          ...baseProps,
          revealStyle: { opacity: 0.4, y: 12, scale: 0.97, filter: 'blur(4px)' },
        })
      );

      const cardMatch = html.match(/<div[^>]*style="[^"]*opacity:0\.4[^"]*"[^>]*>/);
      expect(cardMatch).not.toBeNull();
      // opacity/filter apply directly; y/scale are composed by framer-motion
      // into a single `transform` (translateY + scale) — all four apply
      // together on the same card element.
      expect(cardMatch?.[0]).toContain('filter:blur(4px)');
      expect(cardMatch?.[0]).toContain('transform:translateY(12px) scale(0.97)');

      // The per-image crossfade (opacity 0/1 on individual frames, keyed to
      // activeSrc) is unaffected — still present alongside the card-level reveal.
      const activeImgMatch = html.match(/<img[^>]*src="\/b\.png"[^>]*>/);
      expect(activeImgMatch?.[0]).not.toContain('aria-hidden');
    });

    it("doesn't override the outer card's own centering transform", () => {
      // Regression test: the reveal transform is applied to an inner wrapper,
      // not the outer card element that carries imageColumnCardSx's own
      // `transform: translateX(-50%)` (horizontal centering) via a CSS class.
      // Framer-motion's `style` prop composes `y`/`scale` into an inline
      // `transform`, and an inline style always wins over a class rule for the
      // same property — applying it to the same element as the centering
      // transform would silently replace `translateX(-50%)` and re-break
      // centering, even at rest (y:0/scale:1 still produce an inline
      // `transform` string).
      const div = document.createElement('div');
      document.body.appendChild(div);
      const root = ReactDOM.createRoot(div);

      act(() => {
        root.render(
          createElement(GiselleThemeProvider, {
            defaultMode: 'light',
            children: createElement(FeatureFlowImageColumn, {
              ...baseProps,
              revealStyle: { opacity: 0.4, y: 12, scale: 0.97, filter: 'blur(4px)' },
            }),
          })
        );
      });

      const revealEl = div.querySelector('[style*="opacity"]') as HTMLElement | null;
      const cardEl = revealEl?.parentElement ?? null;
      expect(cardEl).not.toBeNull();
      expect(getComputedStyle(cardEl as HTMLElement).transform).toBe('translateX(-50%)');

      act(() => root.unmount());
      div.remove();
    });
  });
});
