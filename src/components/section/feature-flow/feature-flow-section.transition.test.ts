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
});

// ----------------------------------------------------------------------

describe('FeatureFlowSection — keyboard focus-reset (real framer-motion)', () => {
  // These live here rather than in feature-flow-section.test.ts because that
  // file's framer-motion mock (`vi.mock('framer-motion', ...)`) returns a
  // fresh function identity from its Proxy every time `m.button`/`m.div` is
  // accessed. React treats a changed component-type identity as a reason to
  // unmount and remount, so any hover/focus-triggered re-render there
  // silently disconnects the very button a test just focused — breaking any
  // assertion that focuses one element, waits for a re-render, then acts on
  // that same element again (as a real "focus A, then focus B" blur-reset
  // test needs to). This file's real, unmocked framer-motion exports have
  // stable identity across renders, so the DOM nodes stay connected and
  // these interactions can be tested for real.

  const findFrame = (div: HTMLElement, src: string) =>
    Array.from(div.querySelectorAll('img[fetchpriority]')).find(
      (img) => img.getAttribute('src') === src
    );

  const rowItems: [FeatureFlowItem, FeatureFlowItem] = [
    { ...firstItem, imgUrl: ['/design-1.png'] },
    { ...secondItem, imgUrl: ['/perf-1.png'] },
  ];

  it('resets the preview when focus leaves the row group entirely (mirrors onMouseLeave)', () => {
    const { div, cleanup } = mount({ items: rowItems, image: baseImage });
    const buttons = div.querySelectorAll('button[aria-pressed]');
    const secondButton = Array.from(buttons).find((el) =>
      el.textContent?.includes('Performance')
    ) as HTMLElement;

    act(() => secondButton.focus());
    expect(findFrame(div, '/perf-1.png')?.hasAttribute('aria-hidden')).toBe(false);

    const outsideButton = document.createElement('button');
    document.body.appendChild(outsideButton);
    act(() => outsideButton.focus());

    expect(findFrame(div, '/design-1.png')?.hasAttribute('aria-hidden')).toBe(false);

    outsideButton.remove();
    cleanup();
  });

  it('does not reset the preview when focus moves from one row to another within the group', () => {
    const { div, cleanup } = mount({ items: rowItems, image: baseImage });
    const buttons = div.querySelectorAll('button[aria-pressed]');
    const firstButton = Array.from(buttons).find((el) =>
      el.textContent?.includes('Design systems')
    ) as HTMLElement;
    const secondButton = Array.from(buttons).find((el) =>
      el.textContent?.includes('Performance')
    ) as HTMLElement;

    act(() => firstButton.focus());
    act(() => secondButton.focus());

    expect(findFrame(div, '/perf-1.png')?.hasAttribute('aria-hidden')).toBe(false);
    cleanup();
  });
});
