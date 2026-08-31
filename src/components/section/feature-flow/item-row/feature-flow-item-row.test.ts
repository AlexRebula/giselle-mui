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
  expandable: true,
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

  it('always renders as a real button, expandable or not', () => {
    const expandableHtml = renderWithTheme(createElement(FeatureFlowItemRow, baseProps));
    const quietHtml = renderWithTheme(
      createElement(FeatureFlowItemRow, { ...baseProps, expandable: false })
    );
    expect(expandableHtml).toContain('<button');
    expect(quietHtml).toContain('<button');
  });

  describe('expandable rows', () => {
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
      const ref = createRef<HTMLButtonElement>();
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

  describe('non-expandable rows', () => {
    const nonExpandableProps: FeatureFlowItemRowProps = { ...baseProps, expandable: false };

    it('has no aria-pressed attribute, since there is nothing to toggle', () => {
      const html = renderWithTheme(createElement(FeatureFlowItemRow, nonExpandableProps));
      expect(html).not.toContain('aria-pressed');
    });

    it('never fires onSelect, even on click, since no onClick is wired', () => {
      const onSelect = vi.fn();
      const { div, cleanup } = mount({ ...nonExpandableProps, onSelect });

      act(() =>
        div.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      );

      expect(onSelect).not.toHaveBeenCalled();
      cleanup();
    });

    it('calls onHover on mouse enter and onFocus on focus, same as expandable rows', () => {
      const onHover = vi.fn();
      const onFocus = vi.fn();
      const { div, cleanup } = mount({ ...nonExpandableProps, onHover, onFocus });
      const button = div.querySelector('button') as HTMLButtonElement;

      act(() => button.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })));
      expect(onHover).toHaveBeenCalledTimes(1);

      act(() => button.focus());
      expect(onFocus).toHaveBeenCalledTimes(1);

      cleanup();
    });

    it('forwards ref to the root <button>', () => {
      const ref = createRef<HTMLButtonElement>();
      const div = document.createElement('div');
      document.body.appendChild(div);
      const root = ReactDOM.createRoot(div);

      act(() => {
        root.render(
          createElement(
            GiselleThemeProvider,
            null,
            createElement(FeatureFlowItemRow, { ...nonExpandableProps, ref })
          )
        );
      });

      expect(ref.current?.tagName).toBe('BUTTON');

      act(() => root.unmount());
      div.remove();
    });
  });
});
