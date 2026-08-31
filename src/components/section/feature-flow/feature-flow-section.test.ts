// @vitest-environment jsdom
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { createElement, createRef, act } from 'react';
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
//
// useScroll/useTransform/useMotionTemplate/useReducedMotion are stubbed the
// same way, purely so useImageRevealTransform (which this tree now calls)
// doesn't need real scroll tracking in jsdom: useTransform resolves straight
// to each transform's resting ("to") value, useMotionTemplate reassembles its
// tagged-template inputs into a plain string, and useReducedMotion reports no
// preference. None of this suite's tests assert on the entrance transform
// itself (that lives in feature-flow-section.utils.test.ts and image-column's
// own test file) — this just keeps the rest of the tree rendering
// deterministically.
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
    useScroll: () => ({ scrollYProgress: 0 }),
    useTransform: (_value: unknown, _input: unknown, output: readonly unknown[]) =>
      output[output.length - 1],
    useMotionTemplate: (strings: TemplateStringsArray, ...values: unknown[]) =>
      strings.reduce((acc, str, i) => `${acc}${str}${i < values.length ? values[i] : ''}`, ''),
    // The expanded detail panel can render FeatureFlowHighlightCarousel (via
    // FeatureFlowItemDetail), which also calls useReducedMotion for its own
    // text slide-in — stub it here too so that render path doesn't throw.
    useReducedMotion: () => false,
  };
});

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

  // jsdom does not implement scrollIntoView at all (not even as a no-op) —
  // stub it so the expand-triggered scroll-into-view effect doesn't throw.
  Element.prototype.scrollIntoView = vi.fn();

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
  highlightCards: [{ title: 'Shipped fast', description: 'Under a month.' }],
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

  it('forwards ref to the root <section> element', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const ref = createRef<HTMLElement>();

    act(() => {
      root.render(
        createElement(GiselleThemeProvider, null, [
          createElement(FeatureFlowSection, {
            key: 'section',
            items: [nonInteractiveItem],
            image: baseImage,
            ref,
          }),
        ])
      );
    });

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('SECTION');

    act(() => root.unmount());
    div.remove();
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

  // Regression coverage for issue #185: the reported symptoms (missing hover
  // tint, missing selected-item box-shadow) were originally suspected to be a
  // state-wiring bug — `isSelected` never actually reaching the item that
  // visually renders as selected on initial mount. That hypothesis turned out
  // to be wrong (the real causes were a missing theme CSS variable and a
  // framer-motion/CSS specificity conflict — see feature-flow-section.styles.ts
  // and theme-preset.ts) but is worth guarding explicitly so it can't
  // regress silently: `selectedItemIndex` defaults to `0`, so the first
  // interactive item must render `aria-pressed="true"` on mount, before any
  // click.
  it('the first interactive item is aria-pressed on initial mount, before any click (isSelected defaults correctly)', () => {
    const { div, cleanup } = mount({ items: [fullItem, secondItem], image: baseImage });
    const buttons = Array.from(div.querySelectorAll('button[aria-pressed]'));

    expect(buttons[0]?.getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1]?.getAttribute('aria-pressed')).toBe('false');
    cleanup();
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

  // Regression: without this, the main grid's last row sits flush against
  // the detail panel's border-top — detailPanelSx's own `py` only pushes the
  // panel's *content* down from that border, never the border away from
  // whatever precedes it.
  it('adds bottom padding to the main grid only once a detail panel is expanded', () => {
    const { div, cleanup } = mount({ items: [fullItem], image: baseImage });
    const grid = () =>
      div.querySelector('button[aria-pressed]')?.closest('.MuiGrid-container') as HTMLElement;

    expect(getComputedStyle(grid()).paddingBottom).toBe('0px');

    act(() =>
      div
        .querySelector('button[aria-pressed]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );

    expect(getComputedStyle(grid()).paddingBottom).not.toBe('0px');
    cleanup();
  });

  // Regression: featureFlowRootSx's own pb gives the section breathing room
  // after the row list/image when nothing is expanded. Once a detail panel
  // renders below that, detailPanelSx's own py already provides equivalent
  // space after it — without zeroing featureFlowRootSx's pb for that state,
  // the section would double up on bottom space past the panel/sub-nav.
  it("reduces the outer section's own bottom padding to a fixed value once a detail panel is expanded", () => {
    const { div, cleanup } = mount({ items: [fullItem], image: baseImage });
    const section = () => div.querySelector('section') as HTMLElement;
    const before = getComputedStyle(section()).paddingBottom;

    act(() =>
      div
        .querySelector('button[aria-pressed]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );

    const after = getComputedStyle(section()).paddingBottom;
    // Flat (non-responsive) once expanded, unlike the responsive resting
    // value — theme.spacing(10) regardless of viewport breakpoint. jsdom
    // doesn't resolve calc()/custom-property values, so this checks the
    // unresolved expression rather than a pixel value.
    expect(after).toBe('calc(10 * var(--mui-spacing))');
    expect(after).not.toBe(before);
    cleanup();
  });
});

// ----------------------------------------------------------------------

describe('FeatureFlowSection — scroll-into-view on expand', () => {
  it('scrolls the detail panel into view once it exists in the DOM', () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    const { div, cleanup } = mount({ items: [fullItem], image: baseImage });
    const button = div.querySelector('button[aria-pressed]');
    act(() => button?.dispatchEvent(new MouseEvent('click', { bubbles: true })));

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    cleanup();
  });

  it('scrolls again when switching to a different expanded item via the sub-nav', () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    const { div, cleanup } = mount({ items: [fullItem, secondItem], image: baseImage });
    const buttons = div.querySelectorAll('button[aria-pressed]');
    act(() => buttons[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(scrollIntoView).toHaveBeenCalledTimes(1);

    const subNavButtons = div.querySelectorAll('[aria-label="Section navigation"] button');
    const performanceNavButton = Array.from(subNavButtons).find(
      (el) => el.getAttribute('aria-label') === secondItem.title
    );
    act(() => performanceNavButton?.dispatchEvent(new MouseEvent('click', { bubbles: true })));

    expect(scrollIntoView).toHaveBeenCalledTimes(2);
    cleanup();
  });

  it('does not scroll when collapsing an expanded item', () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    const { div, cleanup } = mount({ items: [fullItem], image: baseImage });
    act(() =>
      div
        .querySelector('button[aria-pressed]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );
    expect(scrollIntoView).toHaveBeenCalledTimes(1);

    act(() =>
      div
        .querySelector('button[aria-pressed]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
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

  it('wraps only the detail panel in the layout-animated container; FloatingSubNav is a separate sibling (issue #177, restructured by #193)', () => {
    const { div, cleanup } = mount({ items: [fullItem], image: baseImage });
    const button = div.querySelector('button[aria-pressed]');
    act(() => button?.dispatchEvent(new MouseEvent('click', { bubbles: true })));

    const section = div.querySelector('section');
    expect(section).not.toBeNull();
    expect(div.querySelector('[aria-label="Section navigation"]')).not.toBeNull();

    // #177 originally wrapped the expanded detail panel and FloatingSubNav's
    // root together in one layout-animated `m.div`, so the container height
    // transitions smoothly when a panel opens/closes (its actual acceptance
    // criterion) — collapsing what would otherwise be 3 direct children of
    // <section> (MotionViewport's Box, the detail panel, FloatingSubNav) to 2.
    //
    // #193 requires FloatingSubNav to still paint over the sticky image
    // column. `m.div layout` keeps a persistent non-'none' `transform` even
    // at rest (confirmed live: framer-motion's projection system for the
    // `layout` prop), which makes it a CSS stacking context — trapping
    // FloatingSubNav's zIndex:1050 inside it so it can only out-rank
    // *siblings within that same context* (like the detail panel), never an
    // element entirely outside it (the sticky image, whose own explicit
    // zIndex:1 lives elsewhere in the tree). No zIndex value on either side
    // can fix this while both stay nested under the same transform-bearing
    // parent — nesting is a hard partition, not a value comparison.
    //
    // So `m.div layout` now wraps only the AnimatePresence/detail-panel
    // portion; FloatingSubNav renders as `<section>`'s next direct sibling,
    // restoring 3 children — but `layout` stays on the div that actually
    // changes height, so #177's smooth-transition behavior is unaffected;
    // FloatingSubNav's own zero-height sticky wrapper never contributed to
    // that measured height either way. `<section>` also carries
    // `BasicSection`'s own decorative elements as additional direct
    // children (all `aria-hidden="true"`) since #193/#198's follow-up —
    // filter those out to count only real content children.
    const contentChildren = Array.from(section?.children ?? []).filter(
      (child) => child.getAttribute('aria-hidden') !== 'true'
    );
    expect(contentChildren.length).toBe(3);

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

  // Regression test for a gap noted alongside the scroll-direction/hover-stack
  // tests above: selecting an item is meant to lock the displayed image to
  // that item's own sequence (see the `userHasSelected` guard in
  // `hoverSequenceSources`), but that lock had never been exercised together
  // with a subsequent scroll event.
  it("keeps the selected item's image locked after a scroll event, instead of reverting to scroll-direction swapping", () => {
    window.scrollY = 0;
    const { div, cleanup } = mount({
      items: [fullItem, secondItem],
      image: { ...baseImage, scrollImages: ['/down.png', '/up.png'] },
    });

    const buttons = div.querySelectorAll('button[aria-pressed]');
    const secondButton = Array.from(buttons).find((el) => el.textContent?.includes('Performance'));
    act(() =>
      (secondButton as HTMLElement | undefined)?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      )
    );

    // Selecting the item locks its own image in as the displayed one.
    expect(findFrame(div, '/perf-1.png')?.hasAttribute('aria-hidden')).toBe(false);

    // A scroll event after selection must not override the lock back to the
    // scroll-direction image.
    window.scrollY = 200;
    act(() => window.dispatchEvent(new Event('scroll')));

    expect(findFrame(div, '/perf-1.png')?.hasAttribute('aria-hidden')).toBe(false);
    expect(findFrame(div, '/down.png')?.hasAttribute('aria-hidden')).toBe(true);

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

// ----------------------------------------------------------------------

describe('FeatureFlowSection — renderRightPanel', () => {
  it('renders the default FeatureFlowImageColumn when renderRightPanel is omitted', () => {
    const { div, cleanup } = mount({ items: [fullItem], image: baseImage });
    expect(div.querySelector('img')).not.toBeNull();
    cleanup();
  });

  it('renders renderRightPanel output instead of the default image column when provided', () => {
    const renderRightPanel = vi.fn(() => createElement('span', null, 'Custom panel'));
    const { div, cleanup } = mount({
      items: [fullItem, secondItem],
      image: baseImage,
      renderRightPanel,
    });

    expect(div.textContent).toContain('Custom panel');
    expect(div.querySelector('img[fetchpriority]')).toBeNull();
    cleanup();
  });

  it('calls renderRightPanel with the active item and whether it is expanded', () => {
    const renderRightPanel = vi.fn(() => null);
    const { div, cleanup } = mount({
      items: [fullItem, secondItem],
      image: baseImage,
      renderRightPanel,
    });

    expect(renderRightPanel).toHaveBeenCalledWith(fullItem, false);

    const button = div.querySelector('button[aria-pressed]');
    act(() => button?.dispatchEvent(new MouseEvent('click', { bubbles: true })));

    expect(renderRightPanel).toHaveBeenLastCalledWith(fullItem, true);
    cleanup();
  });

  it('reflects hover in the active item passed to renderRightPanel', () => {
    const renderRightPanel = vi.fn(() => null);
    const { div, cleanup } = mount({
      items: [fullItem, secondItem],
      image: baseImage,
      renderRightPanel,
    });

    const buttons = Array.from(div.querySelectorAll('button[aria-pressed]'));
    const secondButton = buttons.find((el) => el.textContent?.includes('Performance'));
    act(() => secondButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })));

    expect(renderRightPanel).toHaveBeenLastCalledWith(secondItem, false);
    cleanup();
  });
});

// ----------------------------------------------------------------------

describe('FeatureFlowSection — renderHighlightPanel', () => {
  function expandFullItem(div: HTMLElement) {
    const button = div.querySelector('button[aria-pressed]');
    act(() => button?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  }

  it('renders the default FeatureFlowHighlightCarousel when renderHighlightPanel is omitted', () => {
    const { div, cleanup } = mount({ items: [fullItem], image: baseImage });
    expandFullItem(div);

    expect(div.textContent).toContain('Shipped fast');
    cleanup();
  });

  it('renders renderHighlightPanel output instead of the default carousel when provided', () => {
    const renderHighlightPanel = vi.fn(() => createElement('span', null, 'Custom highlight panel'));
    const { div, cleanup } = mount({ items: [fullItem], image: baseImage, renderHighlightPanel });
    expandFullItem(div);

    expect(div.textContent).toContain('Custom highlight panel');
    expect(div.textContent).not.toContain('Shipped fast');
    cleanup();
  });

  it('calls renderHighlightPanel with the expanded item', () => {
    const renderHighlightPanel = vi.fn(() => null);
    const { div, cleanup } = mount({ items: [fullItem], image: baseImage, renderHighlightPanel });
    expandFullItem(div);

    expect(renderHighlightPanel).toHaveBeenCalledWith(fullItem);
    cleanup();
  });

  it('is not called while no item is expanded', () => {
    const renderHighlightPanel = vi.fn(() => null);
    const { cleanup } = mount({ items: [fullItem], image: baseImage, renderHighlightPanel });

    expect(renderHighlightPanel).not.toHaveBeenCalled();
    cleanup();
  });
});

// ----------------------------------------------------------------------

describe('FeatureFlowSection — itemDetailSx', () => {
  it("merges onto the expanded detail panel's own background, overriding detailPanelSx's default tint", () => {
    const { div, cleanup } = mount({
      items: [fullItem],
      image: baseImage,
      itemDetailSx: { bgcolor: 'rgb(1, 2, 3)' },
    });
    const button = div.querySelector('button[aria-pressed]');
    act(() => button?.dispatchEvent(new MouseEvent('click', { bubbles: true })));

    const candidates = [...div.querySelectorAll<HTMLElement>('[class*="MuiBox-root"]')];
    const matched = candidates.some(
      (el) => getComputedStyle(el).backgroundColor === 'rgb(1, 2, 3)'
    );
    expect(matched).toBe(true);
    cleanup();
  });
});
