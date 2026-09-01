// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import React, { createRef, act } from 'react';
import ReactDOM from 'react-dom/client';

import { renderWithTheme } from '../../../../../test-utils';
import { GiselleThemeProvider } from '../../../../../components/theming/theme-provider/giselle/giselle';
import { NavPill } from './nav-pill';
import { pillVariants } from './nav-pill.animations';

// framer-motion uses browser APIs — mock motion to a plain wrapper (no AnimatePresence
// needed here since NavPill itself doesn't render one; ref-forwarding to m.div still
// needs to resolve to a real element for the forwardRef test below).
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

describe('NavPill', () => {
  it('has a displayName', () => {
    expect(NavPill.displayName).toBe('NavPill');
  });

  it('renders into the DOM without throwing', () => {
    const html = renderWithTheme(
      React.createElement(NavPill, { items, activeId: 'about', onPress: vi.fn() })
    );
    expect(html).toContain('aria-label="Section navigation"');
  });

  it('renders a SubNavButton for each item', () => {
    const html = renderWithTheme(
      React.createElement(NavPill, { items, activeId: 'about', onPress: vi.fn() })
    );
    expect(html).toContain('icon-about');
    expect(html).toContain('icon-work');
  });

  it('forwards ref to the root element', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const ref = createRef<HTMLDivElement>();

    act(() => {
      root.render(
        React.createElement(
          GiselleThemeProvider,
          null,
          React.createElement(NavPill, { items, activeId: 'about', onPress: vi.fn(), ref })
        )
      );
    });

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);

    act(() => root.unmount());
    div.remove();
  });

  it('[regression] exit y-offset (10) is smaller than enter y-offset (20)', () => {
    // Intentional design rule: the pill exits with a shorter slide than it enters.
    // Entry feels like the pill is arriving; exit feels like a collapse, not a second entrance.
    const enterY = (pillVariants.initial as { y: number }).y;
    const exitY = (pillVariants.exit as { y: number }).y;
    expect(Math.abs(exitY)).toBeLessThan(Math.abs(enterY));
  });

  it('[regression] animate state has full opacity and zero offset', () => {
    const animate = pillVariants.animate as { opacity: number; y: number };
    expect(animate.opacity).toBe(1);
    expect(animate.y).toBe(0);
  });
});
