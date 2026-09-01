// @vitest-environment jsdom
/**
 * Unit tests for MetricCardDecoration.
 *
 * Barrel-exported from `src/index.ts` alongside `MetricCard`, so this file also covers
 * the standalone public-API expectations: renders, forwards ref, `sx` array-merge, and
 * passthrough props.
 */

import React, { createRef, act } from 'react';
import { it, expect, describe } from 'vitest';
import ReactDOM from 'react-dom/client';

import { renderWithTheme } from '../../../../../../test-utils';
import { GiselleThemeProvider } from '../../../../../../components/theming/theme-provider/giselle/giselle';
import { MetricCardDecoration } from './metric-card-decoration';
import { METRIC_CARD_DECORATION_SIZE } from './metric-card-decoration.const';

// ---------------------------------------------------------------------------

describe('MetricCardDecoration', () => {
  it('has a displayName', () => {
    expect(MetricCardDecoration.displayName).toBe('MetricCardDecoration');
  });

  it('renders without throwing', () => {
    expect(() => renderWithTheme(React.createElement(MetricCardDecoration, {}))).not.toThrow();
  });

  it('renders without throwing for each supported color', () => {
    const colors = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;
    for (const color of colors) {
      expect(() =>
        renderWithTheme(React.createElement(MetricCardDecoration, { color }))
      ).not.toThrow();
    }
  });

  it('merges an array sx with the base decoration styles without throwing', () => {
    expect(() =>
      renderWithTheme(
        React.createElement(MetricCardDecoration, { sx: [{ opacity: 0.5 }, { zIndex: 2 }] })
      )
    ).not.toThrow();
  });

  it('forwards arbitrary BoxProps to the root element', () => {
    const html = renderWithTheme(
      React.createElement(MetricCardDecoration, { 'data-testid': 'decoration' } as never)
    );
    expect(html).toContain('data-testid="decoration"');
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
          React.createElement(MetricCardDecoration, { ref })
        )
      );
    });

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);

    act(() => root.unmount());
    div.remove();
  });

  it('[regression] METRIC_CARD_DECORATION_SIZE >= 80px', () => {
    expect(METRIC_CARD_DECORATION_SIZE).toBeGreaterThanOrEqual(80);
  });
});
