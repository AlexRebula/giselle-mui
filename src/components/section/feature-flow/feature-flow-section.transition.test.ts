// @vitest-environment jsdom
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { createElement, act } from 'react';
import ReactDOM from 'react-dom/client';

import { GiselleThemeProvider } from '../../theming/theme-provider/giselle/giselle';
import { FeatureFlowSection } from './feature-flow-section';
import type { FeatureFlowItem } from './types';

// Deliberately does NOT mock framer-motion (unlike feature-flow-section.test.ts,
// whose top-level vi.mock('framer-motion', ...) replaces AnimatePresence/motion.*
// with synchronous passthroughs for every test in that file). This file exercises
// the real AnimatePresence mount/unmount lifecycle — with mode="wait", switching
// the expanded item runs a real exit transition on the outgoing panel before the
// incoming one mounts — so the scroll-into-view effect's "poll until the panel
// actually exists in the DOM" behavior, and the pending indicator it drives, are
// verified against real timing rather than an instantaneous mock.

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

  // jsdom does not implement scrollIntoView at all (not even as a no-op).
  Element.prototype.scrollIntoView = vi.fn();

  // MotionViewport's `whileInView` (via framer-motion) requires IntersectionObserver,
  // which jsdom does not implement. A no-op stub is enough here too: the
  // intersection state itself is not under test in this file.
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

const firstItem: FeatureFlowItem = {
  id: 'design-systems',
  icon: 'solar:widget-bold-duotone',
  title: 'Design systems',
  description: 'Consistent, accessible UI at scale.',
  metrics: [{ value: '20+', label: 'Components' }],
};

const secondItem: FeatureFlowItem = {
  id: 'performance',
  icon: 'solar:bolt-bold-duotone',
  title: 'Performance',
  description: 'Fast by default.',
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

/**
 * Polls `predicate` in real time until it returns true, or throws once
 * `timeout` elapses. Each wait window is wrapped in an async `act()` so any
 * state updates framer-motion's real (non-mocked) animation lifecycle
 * triggers outside of an event handler — e.g. completing an exit transition —
 * are flushed and accounted for.
 */
async function waitFor(
  predicate: () => boolean,
  { timeout = 2000, interval = 25 }: { timeout?: number; interval?: number } = {}
): Promise<void> {
  const start = Date.now();
  while (true) {
    if (predicate()) return;
    if (Date.now() - start > timeout) {
      throw new Error(`waitFor: condition not met within ${timeout}ms`);
    }
    await act(async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, interval));
    });
  }
}

// ----------------------------------------------------------------------

describe('FeatureFlowSection — real AnimatePresence transition', () => {
  it('mounts the detail panel for real (entering) when an item is expanded', async () => {
    const { div, cleanup } = mount({ items: [firstItem], image: baseImage });

    act(() =>
      div
        .querySelector('button[aria-pressed]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );

    await waitFor(() => !!div.textContent?.includes('Components'));
    expect(div.textContent).toContain('Design systems');

    cleanup();
  });

  it('shows a pending indicator while switching items, and removes it once the new panel has mounted and scrolled into view', async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    const { div, cleanup } = mount({ items: [firstItem, secondItem], image: baseImage });
    const buttons = div.querySelectorAll('button[aria-pressed]');

    act(() => buttons[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    await waitFor(() => !!div.textContent?.includes('Components'));
    expect(scrollIntoView).toHaveBeenCalledTimes(1);

    // Switch to the second item. `AnimatePresence mode="wait"` must run the
    // first item's real exit transition before the second item's panel
    // mounts — the pending indicator should be visible for that real gap.
    const secondButton = Array.from(buttons).find((el) => el.textContent?.includes('Performance'));
    act(() =>
      (secondButton as HTMLElement | undefined)?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      )
    );

    expect(div.querySelector('[role="progressbar"]')).not.toBeNull();

    await waitFor(() => !!div.textContent?.includes('TTI'));
    expect(div.textContent).not.toContain('Components');

    // The panel's mount and the scroll-into-view effect noticing it can land
    // a frame apart — wait for the indicator to clear rather than asserting
    // immediately after the text above appears.
    await waitFor(() => div.querySelector('[role="progressbar"]') === null);
    expect(scrollIntoView).toHaveBeenCalledTimes(2);

    cleanup();
  });

  it('fully unmounts the exiting panel (real exit transition) when collapsing', async () => {
    const { div, cleanup } = mount({ items: [firstItem], image: baseImage });

    act(() =>
      div
        .querySelector('button[aria-pressed]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );
    await waitFor(() => !!div.textContent?.includes('Components'));

    act(() =>
      div
        .querySelector('button[aria-pressed]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    );

    await waitFor(() => !div.textContent?.includes('Components'));
    expect(div.textContent).not.toContain('Components');

    cleanup();
  });

  // Regression test for issue #193/#195 review: `imageColumnStickyStackSx`'s
  // `zIndex: 1` only makes the sticky image column paint over
  // `FeatureFlowItemDetail` if *every* ancestor between the sticky element
  // and `<section>` stays at `transform: none` — a transform (even an
  // identity one) creates a CSS stacking context that would trap the
  // zIndex inside it, unable to reach the detail panel it needs to beat.
  // `MotionViewport` (an `m.div`) is the one ancestor in that chain driven by
  // real framer-motion; this test renders it for real (no framer-motion
  // mock, unlike feature-flow-section.test.ts) and asserts it — and every
  // other ancestor up to `<section>` — never ends up with a non-'none'
  // transform, which would silently break the fix without any sx-level test
  // catching it.
  it('[regression] no ancestor between the sticky image column and <section> carries a transform', async () => {
    const { div, cleanup } = mount({ items: [firstItem], image: baseImage });

    // Let MotionViewport's whileInView entrance actually settle.
    await waitFor(() => true, { timeout: 50 });

    const section = div.querySelector('section');
    expect(section).not.toBeNull();

    const img = div.querySelector('img[alt="Preview"]');
    expect(img).not.toBeNull();

    // Found by its zIndex rather than `position: sticky`: that value is set
    // via an `{ xs, md }` responsive breakpoint (media-query-gated CSS),
    // which jsdom's `getComputedStyle` does not reliably resolve. `zIndex: 1`
    // is a flat, unconditional value in the same sx object, so it's a
    // reliable marker for the same element in this environment.
    let node: Element | null = img;
    let stickyAncestor: Element | null = null;
    while (node && node !== section) {
      if (getComputedStyle(node).zIndex === '1') {
        stickyAncestor = node;
        break;
      }
      node = node.parentElement;
    }
    expect(stickyAncestor).not.toBeNull();

    // jsdom's `getComputedStyle` resolves an *inline* `transform` (what
    // framer-motion actually sets via direct DOM mutation) reliably, but
    // returns `''` rather than the real-browser initial value `'none'` for
    // elements with no transform at all — so "no transform" here means
    // neither string, not just `'none'`.
    node = (stickyAncestor as Element).parentElement;
    while (node && node !== section) {
      expect(['', 'none']).toContain(getComputedStyle(node).transform);
      node = node.parentElement;
    }

    cleanup();
  });
});
