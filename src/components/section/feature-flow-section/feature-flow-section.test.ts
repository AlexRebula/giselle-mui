// @vitest-environment jsdom
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { createElement, act } from 'react';
import type { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';

import { GiselleThemeProvider } from '../../theming/theme-provider/giselle/giselle';
import { renderWithTheme } from '../../../test-utils';
import { FeatureFlowSection } from './feature-flow-section';
import { HOVER_STEP_DELAY_MS } from './feature-flow-section.const';
import type { FeatureFlowItem } from './types';

// Real framer-motion exit animations never finish in jsdom (no real animation
// frames), which would leave "exiting" content in the DOM indefinitely.
// Mocked the same way as floating-sub-nav.test.ts: AnimatePresence becomes a
// plain passthrough, motion.* become plain intrinsic elements — deterministic
// mount/unmount with no animation timing involved.
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children?: ReactNode }) =>
    children === undefined ? null : children,
  motion: new Proxy(
    {},
    {
      get:
        (_target, prop: string) =>
        ({ children, ...rest }: { children?: ReactNode; [key: string]: unknown }) =>
          createElement(prop, rest, children),
    }
  ),
}));

// MotionViewport calls useMediaQuery, which calls window.matchMedia in an
// effect once mounted with a real DOM (createRoot + act). jsdom does not
// implement matchMedia — stub it so mount()-based tests don't throw.
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
  Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });

  // MotionViewport's `whileInView` (via framer-motion) requires IntersectionObserver,
  // which jsdom does not implement. A no-op stub is enough: the intersection state
  // itself is not under test here (that belongs to MotionViewport's own test suite).
  class NoopIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  vi.stubGlobal('IntersectionObserver', NoopIntersectionObserver);
});

// ----------------------------------------------------------------------

const nonInteractiveItem: FeatureFlowItem = {
  id: 'quiet',
  icon: 'solar:code-bold',
  title: 'Quiet item',
  description: 'No expansion data at all.',
};

const fullItem: FeatureFlowItem = {
  id: 'design-systems',
  icon: 'solar:widget-bold-duotone',
  title: 'Design systems',
  description: 'Consistent, accessible UI at scale.',
  imgUrl: ['/design-1.png', '/design-2.png'],
  metrics: [{ value: '20+', label: 'Components' }],
  technologies: [{ name: 'React', icon: 'logos:react' }],
  highlightCards: [{ headline: 'Shipped fast', detail: 'Under a month.' }],
};

const secondItem: FeatureFlowItem = {
  id: 'performance',
  icon: 'solar:bolt-bold-duotone',
  title: 'Performance',
  description: 'Fast by default.',
  imgUrl: ['/perf-1.png'],
  metrics: [{ value: '<1s', label: 'TTI' }],
};

const baseImage = { src: '/base.png', alt: 'Preview' };

function mount(props: Parameters<typeof FeatureFlowSection>[0]) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = ReactDOM.createRoot(div);
  act(() => {
    root.render(
      createElement(GiselleThemeProvider, {
        defaultMode: 'light',
        children: createElement(FeatureFlowSection, props),
      })
    );
  });
  return {
    div,
    cleanup: () => {
      act(() => root.unmount());
      div.remove();
    },
  };
}

// ----------------------------------------------------------------------

describe('FeatureFlowSection — static rendering', () => {
  it('renders without crashing', () => {
    expect(() =>
      renderWithTheme(
        createElement(FeatureFlowSection, { items: [nonInteractiveItem], image: baseImage })
      )
    ).not.toThrow();
  });

  it('forwards arbitrary props to the root element', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowSection, {
        items: [nonInteractiveItem],
        image: baseImage,
        'data-testid': 'feature-flow',
      } as never)
    );
    expect(html).toContain('data-testid="feature-flow"');
  });

  it('renders every item passed via the items prop', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowSection, { items: [nonInteractiveItem, fullItem], image: baseImage })
    );
    expect(html).toContain('Quiet item');
    expect(html).toContain('Design systems');
  });

  it('renders the sticky image column when an image is provided', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowSection, { items: [fullItem], image: baseImage })
    );
    expect(html).toContain(baseImage.src);
  });

  it('an item with no expansion data is not interactive', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowSection, { items: [nonInteractiveItem], image: baseImage })
    );
    expect(html).not.toContain('aria-pressed');
  });

  it('renders no metrics grid, tech chips, or highlight carousel before any item is expanded', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowSection, { items: [fullItem], image: baseImage })
    );
    expect(html).not.toContain('Components');
    expect(html).not.toContain('Shipped fast');
  });
});

// ----------------------------------------------------------------------

describe('FeatureFlowSection — click-to-expand', () => {
  it('clicking an item with expansion data opens its detail panel', () => {
    const { div, cleanup } = mount({ items: [fullItem], image: baseImage });
    const button = div.querySelector('button[aria-pressed]');
    act(() => button?.dispatchEvent(new MouseEvent('click', { bubbles: true })));

    expect(div.textContent).toContain('Design systems');
    expect(div.textContent).toContain('Shipped fast');
    cleanup();
  });

  it('renders a metrics grid in the detail panel when the item has metrics', () => {
    const { div, cleanup } = mount({ items: [fullItem], image: baseImage });
    const button = div.querySelector('button[aria-pressed]');
    act(() => button?.dispatchEvent(new MouseEvent('click', { bubbles: true })));

    expect(div.textContent).toContain('20+');
    expect(div.textContent).toContain('Components');
    cleanup();
  });

  it("renders technology chips resolved from the item's own {name, icon} pairs", () => {
    const { div, cleanup } = mount({ items: [fullItem], image: baseImage });
    const button = div.querySelector('button[aria-pressed]');
    act(() => button?.dispatchEvent(new MouseEvent('click', { bubbles: true })));

    expect(div.textContent).toContain('React');
    cleanup();
  });

  it('renders a highlight-card carousel when the item has highlightCards', () => {
    const { div, cleanup } = mount({ items: [fullItem], image: baseImage });
    const button = div.querySelector('button[aria-pressed]');
    act(() => button?.dispatchEvent(new MouseEvent('click', { bubbles: true })));

    expect(div.textContent).toContain('Shipped fast');
    expect(div.textContent).toContain('Under a month.');
    cleanup();
  });

  it('clicking an expanded item again collapses its detail panel', () => {
    const { div, cleanup } = mount({ items: [fullItem], image: baseImage });
    act(() =>
      div
        .querySelector('button[aria-pressed]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );
    expect(div.textContent).toContain('Shipped fast');

    // Re-query: the item button is a fresh DOM node after the panel-expand
    // render (React replaces rather than reuses it across that state change).
    act(() =>
      div
        .querySelector('button[aria-pressed]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );
    expect(div.textContent).not.toContain('Shipped fast');
    cleanup();
  });

  it('clicking a non-interactive item does nothing (no detail panel appears)', () => {
    const { div, cleanup } = mount({ items: [nonInteractiveItem], image: baseImage });
    const row = Array.from(div.querySelectorAll('div, button')).find((el) =>
      el.textContent?.includes('Quiet item')
    );
    act(() => row?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(div.querySelector('[aria-label="Section navigation"]')).toBeNull();
    cleanup();
  });
});

// ----------------------------------------------------------------------

describe('FeatureFlowSection — floating sub-nav', () => {
  it('does not appear when no item is expanded', () => {
    const { div, cleanup } = mount({ items: [fullItem, secondItem], image: baseImage });
    expect(div.querySelector('[aria-label="Section navigation"]')).toBeNull();
    cleanup();
  });

  it('appears once any item is expanded', () => {
    const { div, cleanup } = mount({ items: [fullItem, secondItem], image: baseImage });
    const button = div.querySelector('button[aria-pressed]');
    act(() => button?.dispatchEvent(new MouseEvent('click', { bubbles: true })));

    expect(div.querySelector('[aria-label="Section navigation"]')).not.toBeNull();
    cleanup();
  });

  it('switching between expanded items updates the active id and detail panel', () => {
    const { div, cleanup } = mount({ items: [fullItem, secondItem], image: baseImage });
    const buttons = div.querySelectorAll('button[aria-pressed]');
    act(() => buttons[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(div.textContent).toContain('Shipped fast');

    const subNavButtons = div.querySelectorAll('[aria-label="Section navigation"] button');
    const performanceNavButton = Array.from(subNavButtons).find(
      (el) => el.getAttribute('aria-label') === secondItem.title
    );
    act(() => performanceNavButton?.dispatchEvent(new MouseEvent('click', { bubbles: true })));

    expect(div.textContent).toContain('TTI');
    expect(div.textContent).not.toContain('Shipped fast');
    cleanup();
  });
});

// ----------------------------------------------------------------------

describe('FeatureFlowSection — image column hover/scroll behaviour', () => {
  // The image column mounts every possible src permanently and toggles which
  // one is aria-hidden (see feature-flow-image-column.tsx) — only the "frame"
  // <img> elements (the permanently-mounted crossfade layer) carry a
  // fetchPriority attribute, which distinguishes them from the two invisible
  // ghost <img> elements that exist purely to give the column its height.
  function findFrame(div: HTMLElement, src: string) {
    return Array.from(div.querySelectorAll('img[fetchpriority]')).find(
      (img) => img.getAttribute('src') === src
    );
  }

  it('crossfades the image column on item hover', () => {
    const { div, cleanup } = mount({ items: [fullItem, secondItem], image: baseImage });
    const buttons = div.querySelectorAll('button[aria-pressed]');
    const secondButton = Array.from(buttons).find((el) => el.textContent?.includes('Performance'));

    // onFocus mirrors onMouseEnter for image-preview purposes (keyboard users
    // get the same preview a mouse hover gives) — .focus() is a real, reliably
    // dispatched DOM event in jsdom, unlike a synthetic 'mouseenter'.
    act(() => (secondButton as HTMLElement | undefined)?.focus());

    const activeImg = findFrame(div, '/perf-1.png');
    expect(activeImg?.hasAttribute('aria-hidden')).toBe(false);
    cleanup();
  });

  it("steps through an item's hover-stack sequence over time", () => {
    vi.useFakeTimers();
    const { div, cleanup } = mount({ items: [fullItem, secondItem], image: baseImage });
    const buttons = div.querySelectorAll('button[aria-pressed]');
    const firstButton = Array.from(buttons).find((el) =>
      el.textContent?.includes('Design systems')
    );

    act(() => (firstButton as HTMLElement | undefined)?.focus());
    act(() => {
      vi.advanceTimersByTime(HOVER_STEP_DELAY_MS + 1);
    });

    const secondFrame = findFrame(div, '/design-2.png');
    expect(secondFrame?.hasAttribute('aria-hidden')).toBe(false);

    cleanup();
    vi.useRealTimers();
  });

  it('swaps the displayed image based on scroll direction when scrollImages is provided', () => {
    window.scrollY = 0;
    const { div, cleanup } = mount({
      items: [nonInteractiveItem],
      image: { ...baseImage, scrollImages: ['/down.png', '/up.png'] },
    });

    window.scrollY = 200;
    act(() => window.dispatchEvent(new Event('scroll')));

    const downImg = findFrame(div, '/down.png');
    expect(downImg?.hasAttribute('aria-hidden')).toBe(false);
    cleanup();
  });
});

// ----------------------------------------------------------------------

describe('FeatureFlowSection — image preloading', () => {
  it('emits a preload hint for every item image', () => {
    const { cleanup } = mount({ items: [fullItem, secondItem], image: baseImage });

    const preloadHrefs = Array.from(document.head.querySelectorAll('link[rel="preload"]')).map(
      (link) => link.getAttribute('href')
    );
    expect(preloadHrefs).toEqual(
      expect.arrayContaining(['/design-1.png', '/design-2.png', '/perf-1.png', '/base.png'])
    );
    cleanup();
  });
});
