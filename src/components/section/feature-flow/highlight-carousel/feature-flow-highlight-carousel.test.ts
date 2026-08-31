// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { createElement, createRef, act } from 'react';
import type { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';

import { renderWithTheme } from '../../../../test-utils';
import { FeatureFlowHighlightCarousel } from './feature-flow-highlight-carousel';
import { highlightTextVariants } from './feature-flow-highlight-carousel.animations';

// Real framer-motion exit animations never finish in jsdom (no real animation
// frames), which would leave "exiting" content in the DOM indefinitely.
// Mocked the same way as feature-flow-section.test.ts / floating-sub-nav.test.ts:
// AnimatePresence becomes a plain passthrough, motion.* become plain intrinsic
// elements — deterministic mount/unmount with no animation timing involved.
vi.mock('framer-motion', () => {
  const motionProxy = new Proxy(
    {},
    {
      get:
        (_target, prop: string) =>
        ({ children, ...rest }: { children?: ReactNode; [key: string]: unknown }) =>
          createElement(prop, rest, children),
    }
  );

  return {
    AnimatePresence: ({ children }: { children?: ReactNode }) =>
      children === undefined ? null : children,
    motion: motionProxy,
    m: motionProxy,
    useReducedMotion: () => false,
  };
});

const cards = [
  { title: 'First title', description: 'First description', media: '/a.png' },
  { title: 'Second title', description: 'Second description', media: '/b.png' },
];

describe('FeatureFlowHighlightCarousel', () => {
  it('renders nothing when given an empty cards array', () => {
    const html = renderWithTheme(createElement(FeatureFlowHighlightCarousel, { cards: [] }));
    expect(html).toBe('');
  });

  it('renders the first card title and description as the initial slide', () => {
    const html = renderWithTheme(createElement(FeatureFlowHighlightCarousel, { cards }));
    expect(html).toContain('First title');
    expect(html).toContain('First description');
  });

  it('renders a "Learn more" link when the card has an href', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowHighlightCarousel, {
        cards: [{ ...cards[0]!, href: '/docs/first' }],
      })
    );
    expect(html).toContain('href="/docs/first"');
    expect(html).toContain('Learn more');
  });

  it('renders no link when the card has no href', () => {
    const html = renderWithTheme(createElement(FeatureFlowHighlightCarousel, { cards }));
    expect(html).not.toContain('Learn more');
  });

  it('does not render arrow controls for a single card', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowHighlightCarousel, { cards: [cards[0]!] })
    );
    expect(html).not.toContain('Next highlight');
  });

  it('renders arrow controls with accessible labels for multiple cards', () => {
    const html = renderWithTheme(createElement(FeatureFlowHighlightCarousel, { cards }));
    expect(html).toContain('aria-label="Previous highlight"');
    expect(html).toContain('aria-label="Next highlight"');
  });

  it('marks every slide image as decorative (empty alt, aria-hidden), including the active one', () => {
    const html = renderWithTheme(createElement(FeatureFlowHighlightCarousel, { cards }));
    const imgMatches = html.match(/<img[^>]*>/g) ?? [];
    expect(imgMatches.length).toBe(cards.length);
    for (const img of imgMatches) {
      expect(img).toContain('alt=""');
      expect(img).toContain('aria-hidden="true"');
    }
  });

  it('renders the active slide image at full opacity and the inactive one at zero, per the computed style', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    act(() => {
      root.render(createElement(FeatureFlowHighlightCarousel, { cards }));
    });

    const [activeImg, inactiveImg] = Array.from(div.querySelectorAll('img'));
    expect(activeImg?.getAttribute('src')).toBe('/a.png');
    expect(inactiveImg?.getAttribute('src')).toBe('/b.png');
    expect(window.getComputedStyle(activeImg as Element).opacity).toBe('1');
    expect(window.getComputedStyle(inactiveImg as Element).opacity).toBe('0');

    act(() => root.unmount());
    div.remove();
  });

  it('advances to the next slide when the next control is clicked', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    act(() => {
      root.render(createElement(FeatureFlowHighlightCarousel, { cards }));
    });

    const [, nextButton] = div.querySelectorAll('button');
    act(() => {
      nextButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(div.textContent).toContain('Second title');

    act(() => root.unmount());
    div.remove();
  });

  it('wraps back to the first slide from the last when advancing', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    act(() => {
      root.render(createElement(FeatureFlowHighlightCarousel, { cards }));
    });

    const [, nextButton] = div.querySelectorAll('button');
    act(() => nextButton?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    act(() => nextButton?.dispatchEvent(new MouseEvent('click', { bubbles: true })));

    expect(div.textContent).toContain('First title');

    act(() => root.unmount());
    div.remove();
  });

  it('forwards arbitrary props to the root element', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowHighlightCarousel, { cards, 'data-testid': 'carousel' } as never)
    );
    expect(html).toContain('data-testid="carousel"');
  });

  it('forwards ref to the root element', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const ref = createRef<HTMLDivElement>();

    act(() => {
      root.render(createElement(FeatureFlowHighlightCarousel, { cards, ref }));
    });

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);

    act(() => root.unmount());
    div.remove();
  });
});

// ----------------------------------------------------------------------

describe('highlightTextVariants — animation variants', () => {
  it('enters from the right when advancing forward (step >= 0)', () => {
    const variants = highlightTextVariants(24);
    const enter = (variants.enter as (step: number) => { x: number; opacity: number })(1);
    expect(enter).toEqual({ opacity: 0, x: 24 });
  });

  it('enters from the left when moving backward (step < 0)', () => {
    const variants = highlightTextVariants(24);
    const enter = (variants.enter as (step: number) => { x: number; opacity: number })(-1);
    expect(enter).toEqual({ opacity: 0, x: -24 });
  });

  it('[regression] exits toward the side opposite the one it entered from', () => {
    // Intentional design rule: a forward step enters from the right and must
    // exit toward the left (and vice-versa for a backward step) — the two
    // never share a sign, or the slide would look like it moves one way only.
    const variants = highlightTextVariants(24);
    const enter = (variants.enter as (step: number) => { x: number })(1);
    const exit = (variants.exit as (step: number) => { x: number })(1);
    expect(Math.sign(exit.x)).not.toBe(Math.sign(enter.x));
  });

  it('collapses to a plain opacity crossfade (zero offset) when distance is 0, as passed when the visitor prefers reduced motion', () => {
    const variants = highlightTextVariants(0);
    const enter = (variants.enter as (step: number) => { x: number })(1);
    const exit = (variants.exit as (step: number) => { x: number })(1);
    // Math.abs — a distance of 0 negated is -0, which is distinct from 0 under toBe's
    // Object.is comparison even though both mean "no offset".
    expect(Math.abs(enter.x)).toBe(0);
    expect(Math.abs(exit.x)).toBe(0);
  });

  it('the center (active) state is always full opacity with no offset', () => {
    const variants = highlightTextVariants(24);
    expect(variants.center).toEqual({ opacity: 1, x: 0 });
  });
});
