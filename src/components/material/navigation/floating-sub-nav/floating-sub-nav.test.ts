// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

import { renderWithTheme } from '../../../../test-utils';
import { FloatingSubNav } from './floating-sub-nav';

// framer-motion uses browser APIs — mock AnimatePresence and motion to plain wrappers
vi.mock('framer-motion', () => {
  const motionProxy = new Proxy(
    {},
    {
      get:
        (_target, prop: string) =>
        ({ children, ...rest }: { children?: React.ReactNode; [key: string]: unknown }) =>
          React.createElement(prop, rest, children),
    }
  );

  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    motion: motionProxy,
    m: motionProxy,
  };
});

// ----------------------------------------------------------------------

const items = [
  {
    id: 'about',
    label: 'About',
    icon: React.createElement('span', { 'data-testid': 'icon-about' }),
  },
  { id: 'work', label: 'Work', icon: React.createElement('span', { 'data-testid': 'icon-work' }) },
];

describe('FloatingSubNav', () => {
  it('renders nav buttons when activeId is set', () => {
    const html = renderWithTheme(
      React.createElement(FloatingSubNav, {
        items,
        activeId: 'about',
        onSelect: vi.fn(),
      })
    );
    expect(html).toContain('About');
    expect(html).toContain('Work');
  });

  it('renders nothing when activeId is null', () => {
    const html = renderWithTheme(
      React.createElement(FloatingSubNav, {
        items,
        activeId: null,
        onSelect: vi.fn(),
      })
    );
    expect(html).not.toContain('About');
  });

  it('renders sticky variant without error', () => {
    expect(() =>
      renderWithTheme(
        React.createElement(FloatingSubNav, {
          items,
          activeId: 'about',
          onSelect: vi.fn(),
          sticky: true,
        })
      )
    ).not.toThrow();
  });

  it('renders icon slot content for each item', () => {
    const html = renderWithTheme(
      React.createElement(FloatingSubNav, {
        items,
        activeId: 'about',
        onSelect: vi.fn(),
      })
    );
    expect(html).toContain('icon-about');
    expect(html).toContain('icon-work');
  });

  it('sets aria-pressed=true on active item', () => {
    const html = renderWithTheme(
      React.createElement(FloatingSubNav, {
        items,
        activeId: 'about',
        onSelect: vi.fn(),
      })
    );
    expect(html).toContain('aria-pressed="true"');
  });
});

// ----------------------------------------------------------------------
// `NavPill` and `SubNavButton` each have their own co-located test file:
// nav-pill/nav-pill.test.ts, sub-nav-button/sub-nav-button.test.ts
