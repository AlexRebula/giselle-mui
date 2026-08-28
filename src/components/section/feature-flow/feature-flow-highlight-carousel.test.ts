// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { createElement, act } from 'react';
import ReactDOM from 'react-dom/client';

import { renderWithTheme } from '../../../test-utils';
import { FeatureFlowHighlightCarousel } from './feature-flow-highlight-carousel';

const cards = [
  { headline: 'First headline', detail: 'First detail', src: '/a.png' },
  { headline: 'Second headline', detail: 'Second detail', src: '/b.png' },
];

describe('FeatureFlowHighlightCarousel', () => {
  it('renders nothing when given an empty cards array', () => {
    const html = renderWithTheme(createElement(FeatureFlowHighlightCarousel, { cards: [] }));
    expect(html).toBe('');
  });

  it('renders the first card headline and detail as the initial slide', () => {
    const html = renderWithTheme(createElement(FeatureFlowHighlightCarousel, { cards }));
    expect(html).toContain('First headline');
    expect(html).toContain('First detail');
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

    expect(div.textContent).toContain('Second headline');

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

    expect(div.textContent).toContain('First headline');

    act(() => root.unmount());
    div.remove();
  });
});
