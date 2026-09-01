// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import React, { createRef, act } from 'react';
import ReactDOM from 'react-dom/client';

import { renderWithTheme } from '../../../../../test-utils';
import { GiselleThemeProvider } from '../../../../../components/theming/theme-provider/giselle/giselle';
import { SubNavButton } from './sub-nav-button';

// ----------------------------------------------------------------------

const item = {
  id: 'about',
  label: 'About',
  icon: React.createElement('span', { 'data-testid': 'icon-about' }),
};

describe('SubNavButton', () => {
  it('has a displayName', () => {
    expect(SubNavButton.displayName).toBe('SubNavButton');
  });

  it('renders with correct aria-label', () => {
    const html = renderWithTheme(
      React.createElement(SubNavButton, { item, isActive: false, onPress: vi.fn() })
    );
    expect(html).toContain('aria-label="About"');
  });

  it('sets aria-pressed=false when inactive', () => {
    const html = renderWithTheme(
      React.createElement(SubNavButton, { item, isActive: false, onPress: vi.fn() })
    );
    expect(html).toContain('aria-pressed="false"');
  });

  it('sets aria-pressed=true when active', () => {
    const html = renderWithTheme(
      React.createElement(SubNavButton, { item, isActive: true, onPress: vi.fn() })
    );
    expect(html).toContain('aria-pressed="true"');
  });

  it('renders icon slot content', () => {
    const html = renderWithTheme(
      React.createElement(SubNavButton, { item, isActive: false, onPress: vi.fn() })
    );
    expect(html).toContain('icon-about');
  });

  it('calls onPress with item.id when clicked', () => {
    const handlePress = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);
    act(() => {
      root.render(
        React.createElement(
          GiselleThemeProvider,
          null,
          React.createElement(SubNavButton, { item, isActive: false, onPress: handlePress })
        )
      );
    });
    const button = container.querySelector('button');
    act(() => {
      button?.click();
    });
    expect(handlePress).toHaveBeenCalledWith('about');
    act(() => root.unmount());
    container.remove();
  });

  it('forwards ref to the root ButtonBase element (not an outer wrapper) — required for Tooltip positioning', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);
    const ref = createRef<HTMLButtonElement>();

    act(() => {
      root.render(
        React.createElement(
          GiselleThemeProvider,
          null,
          React.createElement(SubNavButton, { item, isActive: false, onPress: vi.fn(), ref })
        )
      );
    });

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.tagName).toBe('BUTTON');

    act(() => root.unmount());
    container.remove();
  });
});
