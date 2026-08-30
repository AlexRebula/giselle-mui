// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { createElement, createRef, act } from 'react';
import ReactDOM from 'react-dom/client';

import { renderWithTheme } from '../../../../test-utils';
import { GiselleThemeProvider } from '../../../theming/theme-provider/giselle/giselle';
import { FeatureFlowItemRow } from './feature-flow-item-row';
import type { FeatureFlowItemRowProps } from './types';

// ----------------------------------------------------------------------

const baseProps: FeatureFlowItemRowProps = {
  icon: 'solar:code-bold',
  title: 'Design systems',
  description: 'Consistent, accessible UI at scale.',
  interactive: true,
  isSelected: false,
  isActive: false,
  isExpanded: false,
  onHover: () => {},
  onFocus: () => {},
  onSelect: () => {},
};

function mount(props: FeatureFlowItemRowProps) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = ReactDOM.createRoot(div);
  act(() => {
    root.render(
      createElement(GiselleThemeProvider, {
        defaultMode: 'light',
        children: createElement(FeatureFlowItemRow, props),
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

describe('FeatureFlowItemRow', () => {
  it('renders the title and description', () => {
    const html = renderWithTheme(createElement(FeatureFlowItemRow, baseProps));
    expect(html).toContain('Design systems');
    expect(html).toContain('Consistent, accessible UI at scale.');
  });

  describe('interactive rows', () => {
    it('renders as a real button', () => {
      const html = renderWithTheme(createElement(FeatureFlowItemRow, baseProps));
      expect(html).toContain('<button');
    });

    it('reflects isSelected via aria-pressed', () => {
      const html = renderWithTheme(
        createElement(FeatureFlowItemRow, { ...baseProps, isSelected: true })
      );
      expect(html).toContain('aria-pressed="true"');
    });

    it('calls onSelect on click', () => {
      const onSelect = vi.fn();
      const { div, cleanup } = mount({ ...baseProps, onSelect });

      act(() =>
        div.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      );

      expect(onSelect).toHaveBeenCalledTimes(1);
      cleanup();
    });

    it('calls onHover on mouse enter and onFocus on focus', () => {
      const onHover = vi.fn();
      const onFocus = vi.fn();
      const { div, cleanup } = mount({ ...baseProps, onHover, onFocus });
      const button = div.querySelector('button') as HTMLButtonElement;

      act(() => button.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })));
      expect(onHover).toHaveBeenCalledTimes(1);

      act(() => button.focus());
      expect(onFocus).toHaveBeenCalledTimes(1);

      cleanup();
    });

    it('forwards ref to the root <button>', () => {
      const ref = createRef<HTMLElement>();
      const div = document.createElement('div');
      document.body.appendChild(div);
      const root = ReactDOM.createRoot(div);

      act(() => {
        root.render(
          createElement(
            GiselleThemeProvider,
            null,
            createElement(FeatureFlowItemRow, { ...baseProps, ref })
          )
        );
      });

      expect(ref.current?.tagName).toBe('BUTTON');

      act(() => root.unmount());
      div.remove();
    });
  });

  describe('non-interactive rows', () => {
    const nonInteractiveProps: FeatureFlowItemRowProps = { ...baseProps, interactive: false };

    it('does not render as a button', () => {
      const html = renderWithTheme(createElement(FeatureFlowItemRow, nonInteractiveProps));
      expect(html).not.toContain('<button');
    });

    it('is focusable via tabIndex, so the hover-preview is keyboard-reachable', () => {
      const html = renderWithTheme(createElement(FeatureFlowItemRow, nonInteractiveProps));
      expect(html).toContain('tabindex="0"');
    });

    it('calls onHover on mouse enter and onFocus on focus, same as interactive rows', () => {
      const onHover = vi.fn();
      const onFocus = vi.fn();
      const { div, cleanup } = mount({ ...nonInteractiveProps, onHover, onFocus });
      const row = div.firstElementChild as HTMLElement;

      act(() => row.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })));
      expect(onHover).toHaveBeenCalledTimes(1);

      act(() => row.focus());
      expect(onFocus).toHaveBeenCalledTimes(1);

      cleanup();
    });

    it('never fires onSelect, even on click', () => {
      const onSelect = vi.fn();
      const { div, cleanup } = mount({ ...nonInteractiveProps, onSelect });
      const row = div.firstElementChild as HTMLElement;

      act(() => row.dispatchEvent(new MouseEvent('click', { bubbles: true })));

      expect(onSelect).not.toHaveBeenCalled();
      cleanup();
    });

    it('forwards ref to the root element', () => {
      const ref = createRef<HTMLElement>();
      const div = document.createElement('div');
      document.body.appendChild(div);
      const root = ReactDOM.createRoot(div);

      act(() => {
        root.render(
          createElement(
            GiselleThemeProvider,
            null,
            createElement(FeatureFlowItemRow, { ...nonInteractiveProps, ref })
          )
        );
      });

      expect(ref.current).not.toBeNull();

      act(() => root.unmount());
      div.remove();
    });
  });
});
