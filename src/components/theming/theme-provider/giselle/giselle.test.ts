// @vitest-environment jsdom
import React, { act } from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactDOM from 'react-dom/client';
import { extendTheme } from '@mui/material/styles';

import { GiselleThemeProvider } from './giselle';

// ----------------------------------------------------------------------

/**
 * Mocks `window.matchMedia` to report a fixed `prefers-color-scheme`
 * preference, and returns a restore function. jsdom does not implement
 * `matchMedia` at all — MUI's system-mode detection treats a missing
 * `matchMedia` as "no system preference available" and silently no-ops,
 * which is why a dark-OS scenario must be mocked explicitly rather than
 * left unmocked.
 */
function mockPrefersColorScheme(scheme: 'light' | 'dark') {
  const original = window.matchMedia;
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)' && scheme === 'dark',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  return () => {
    window.matchMedia = original;
  };
}

// ----------------------------------------------------------------------

const CHILD = React.createElement('span', { 'data-testid': 'child' }, 'content');

// ----------------------------------------------------------------------

describe('GiselleThemeProvider — rendering', () => {
  it('renders children', () => {
    const html = renderToStaticMarkup(React.createElement(GiselleThemeProvider, null, CHILD));
    expect(html).toContain('data-testid="child"');
    expect(html).toContain('content');
  });

  it('renders without props (zero-config usage)', () => {
    const html = renderToStaticMarkup(React.createElement(GiselleThemeProvider, null, CHILD));
    expect(html).toBeTruthy();
    expect(html.length).toBeGreaterThan(0);
  });
});

describe('GiselleThemeProvider — defaultMode', () => {
  let container: HTMLDivElement;

  afterEach(async () => {
    await act(async () => {
      container?.remove();
    });
    document.documentElement.removeAttribute('data-mui-color-scheme');
    window.localStorage.clear();
  });

  it('accepts defaultMode prop and renders children without error', async () => {
    await act(async () => {
      container = document.createElement('div');
      document.body.appendChild(container);
      ReactDOM.createRoot(container).render(
        React.createElement(GiselleThemeProvider, { defaultMode: 'light', children: CHILD })
      );
    });
    expect(container.querySelector('[data-testid="child"]')).not.toBeNull();
  });

  // Regression test for issue #190: with `colorSchemeSelector` left at
  // `extendTheme()`'s default of `'media'`, this explicit `defaultMode`
  // override had no effect at all — the resolved scheme just kept tracking
  // the mocked dark OS preference. Asserting against a *dark*-preference
  // machine (rather than an unmocked one, where the OS preference happens to
  // be indeterminate in jsdom) is what proves the override — not mere
  // coincidence — is what produced 'light'.
  it('defaultMode="light" forces the light scheme even when the OS prefers dark', async () => {
    const restoreMatchMedia = mockPrefersColorScheme('dark');
    try {
      await act(async () => {
        container = document.createElement('div');
        document.body.appendChild(container);
        ReactDOM.createRoot(container).render(
          React.createElement(GiselleThemeProvider, { defaultMode: 'light', children: CHILD })
        );
      });
      expect(document.documentElement.getAttribute('data-mui-color-scheme')).toBe('light');
    } finally {
      restoreMatchMedia();
    }
  });
});

describe('GiselleThemeProvider — themeOverrides', () => {
  it('renders without error when themeOverrides is provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(GiselleThemeProvider, {
        themeOverrides: {
          colorSchemes: {
            light: {
              palette: { primary: { main: '#1976d2' } },
            },
          },
        },
        children: CHILD,
      })
    );
    expect(html).toContain('data-testid="child"');
  });
});

describe('GiselleThemeProvider — custom theme', () => {
  it('renders without error when a fully custom theme is passed', () => {
    const customTheme = extendTheme({
      colorSchemes: { light: { palette: { primary: { main: '#e91e63' } } } },
    });
    const html = renderToStaticMarkup(
      React.createElement(GiselleThemeProvider, { theme: customTheme, children: CHILD })
    );
    expect(html).toContain('data-testid="child"');
  });

  it('ignores themeOverrides when theme prop is provided', () => {
    // No error = theme prop wins, themeOverrides is ignored
    const customTheme = extendTheme({
      colorSchemes: { light: { palette: { primary: { main: '#e91e63' } } } },
    });
    const html = renderToStaticMarkup(
      React.createElement(GiselleThemeProvider, {
        theme: customTheme,
        themeOverrides: {
          colorSchemes: { light: { palette: { primary: { main: '#000000' } } } },
        },
        children: CHILD,
      })
    );
    expect(html).toContain('data-testid="child"');
  });
});
