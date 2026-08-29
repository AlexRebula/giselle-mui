// @vitest-environment jsdom
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { createElement, act } from 'react';
import type { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { composeStories } from '@storybook/react';

import { GiselleThemeProvider } from '../../theming/theme-provider/giselle/giselle';
import * as stories from './feature-flow-section.stories';

// This suite exercises the actual `Canonical` Storybook story — composed via
// `composeStories`, so it renders through the real `withNavAdjacentContext`
// decorator (issue #171's nav-adjacent demonstration harness) exactly as
// Storybook itself would, rather than mounting `FeatureFlowSection` bare.
// It covers what the component's own generic test files
// (feature-flow-section.test.ts, .transition.test.ts) already cover for
// synthetic fixtures, but here against the real six-item canonical content
// and inside the decorator's own context — see the acceptance criteria on
// issue #171 for "a Storybook interaction or accompanying test" covering
// sub-nav item generation, active-item switching, click-to-scroll, and the
// scroll-into-view-on-expand behaviour (issue #169) firing within that
// context.
//
// Deterministic AnimatePresence/motion.* — same rationale as
// feature-flow-section.test.ts: real framer-motion exit transitions never
// finish in jsdom, which would leave "exiting" content in the DOM
// indefinitely. Transition timing itself is `.transition.test.ts`'s own
// concern, not this suite's.
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
    useReducedMotion: () => false,
  };
});

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

  // jsdom does not implement scrollIntoView at all.
  Element.prototype.scrollIntoView = vi.fn();

  // Stubs BOTH MotionViewport's whileInView AND the nav-adjacent decorator's
  // own sentinel (`NavSentinel` in __fixtures__/nav-adjacent-decorator.tsx) —
  // jsdom implements neither.
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

const { Canonical } = composeStories(stories);

function mount() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = ReactDOM.createRoot(div);
  act(() => {
    root.render(
      createElement(GiselleThemeProvider, {
        defaultMode: 'light',
        children: createElement(Canonical, {}),
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

function findSubNavButton(div: HTMLElement, label: string) {
  return Array.from(div.querySelectorAll('[aria-label="Section navigation"] button')).find(
    (el) => el.getAttribute('aria-label') === label
  );
}

// ----------------------------------------------------------------------

describe('FeatureFlowSection canonical story (issue #171) — nav-adjacent decorator context', () => {
  it('renders the nav-adjacent decorator harness around the section', () => {
    const { div, cleanup } = mount();
    expect(div.querySelector('[data-testid="nav-adjacent-sentinel"]')).not.toBeNull();
    cleanup();
  });

  it('generates one sub-nav entry per real canonical item once any item is expanded', () => {
    const { div, cleanup } = mount();

    const firstButton = div.querySelector('button[aria-pressed]');
    act(() => firstButton?.dispatchEvent(new MouseEvent('click', { bubbles: true })));

    const subNavButtons = div.querySelectorAll('[aria-label="Section navigation"] button');
    expect(subNavButtons.length).toBe(6);

    cleanup();
  });

  it('switching the active item via the sub-nav updates the active detail panel', () => {
    const { div, cleanup } = mount();

    // The item title and short description also appear in the always-visible
    // description-column row, so assert against content that only exists in
    // the expanded detail panel (longDescription / quote text).
    const firstButton = div.querySelector('button[aria-pressed]');
    act(() => firstButton?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(div.textContent).toContain('I started my web journey back in 2005 in Slovenia');

    const techDebtNavButton = findSubNavButton(div, 'Tech Debt Cleanup');
    act(() => techDebtNavButton?.dispatchEvent(new MouseEvent('click', { bubbles: true })));

    expect(div.textContent).toContain(
      'The application is like a big botanical garden, where developers are the gardeners.'
    );
    expect(div.textContent).not.toContain('I started my web journey back in 2005 in Slovenia');

    cleanup();
  });

  it(
    'scrolls the detail panel into view on expand, and again on every sub-nav switch — ' +
      'within the nav-adjacent decorator context',
    () => {
      const scrollIntoView = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoView;

      const { div, cleanup } = mount();

      const firstButton = div.querySelector('button[aria-pressed]');
      act(() => firstButton?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
      expect(scrollIntoView).toHaveBeenCalledTimes(1);

      const consultingNavButton = findSubNavButton(div, 'Consulting');
      act(() => consultingNavButton?.dispatchEvent(new MouseEvent('click', { bubbles: true })));

      expect(scrollIntoView).toHaveBeenCalledTimes(2);

      cleanup();
    }
  );
});
