// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { act, createElement, createRef } from 'react';
import ReactDOM from 'react-dom/client';

// ----------------------------------------------------------------------
// Mocks — must be declared before component imports
// ----------------------------------------------------------------------

vi.mock('framer-motion', () => ({
  motion: { div: 'div', span: 'span' },
}));

// ----------------------------------------------------------------------

import { renderWithTheme } from '../../../../../test-utils';
import { GiselleThemeProvider } from '../../../../theming/theme-provider/giselle/giselle';
import { AnimatedHeroHeading } from './animated-hero-heading';

// ----------------------------------------------------------------------

describe('AnimatedHeroHeading', () => {
  it('has a displayName', () => {
    expect(AnimatedHeroHeading.displayName).toBe('AnimatedHeroHeading');
  });

  it('renders the subheading text', () => {
    const html = renderWithTheme(
      createElement(AnimatedHeroHeading, {
        subheading: 'The work of',
        highlight: 'Platform Team',
      })
    );
    expect(html).toContain('The work of');
  });

  it('renders the highlight text', () => {
    const html = renderWithTheme(
      createElement(AnimatedHeroHeading, {
        subheading: 'The work of',
        highlight: 'Platform Team',
      })
    );
    expect(html).toContain('Platform Team');
  });

  it('renders subheading and highlight in the same element', () => {
    const html = renderWithTheme(
      createElement(AnimatedHeroHeading, {
        subheading: 'Hello',
        highlight: 'World',
      })
    );
    expect(html).toContain('Hello');
    expect(html).toContain('World');
  });

  it('renders an <h1> as the root heading element', () => {
    const html = renderWithTheme(
      createElement(AnimatedHeroHeading, {
        subheading: 'Hello',
        highlight: 'World',
      })
    );
    expect(html).toContain('<h1');
  });

  it('forwards arbitrary props to the root h1 element', () => {
    const html = renderWithTheme(
      createElement(AnimatedHeroHeading, {
        subheading: 'Hello',
        highlight: 'World',
        'data-testid': 'hero-heading',
      } as never)
    );
    expect(html).toContain('data-testid="hero-heading"');
  });

  it('forwards ref to the root h1 element', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const ref = createRef<HTMLHeadingElement>();

    act(() => {
      root.render(
        createElement(
          GiselleThemeProvider,
          null,
          createElement(AnimatedHeroHeading, {
            ref,
            subheading: 'Hello',
            highlight: 'World',
          })
        )
      );
    });

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);

    act(() => root.unmount());
    div.remove();
  });
});
