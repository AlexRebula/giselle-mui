// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { createElement, act } from 'react';
import ReactDOM from 'react-dom/client';

import { GiselleThemeProvider } from '../../../theming/theme-provider/giselle/giselle';
import { renderWithTheme } from '../../../../test-utils';
import { FeatureFlowDescriptionColumn } from './feature-flow-description-column';
import type { FeatureFlowItem } from '../types';

// ----------------------------------------------------------------------

const items: FeatureFlowItem[] = [
  {
    id: 'design-systems',
    icon: 'solar:widget-bold-duotone',
    title: 'Design systems',
    description: 'Consistent, accessible UI at scale.',
    metrics: [{ value: '20+', label: 'Components' }],
  },
  {
    id: 'performance',
    icon: 'solar:bolt-bold-duotone',
    title: 'Performance',
    description: 'Fast by default.',
    metrics: [{ value: '<1s', label: 'TTI' }],
  },
];

const baseProps = {
  title: 'What I work on',
  items,
  selectedItemIndex: 0,
  activeItemIndex: 0,
  expandedItemId: null,
  onItemHover: () => {},
  onItemSelect: () => {},
  onLeave: () => {},
};

function mount(props: Partial<typeof baseProps> = {}) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = ReactDOM.createRoot(div);
  act(() => {
    root.render(
      createElement(GiselleThemeProvider, {
        defaultMode: 'light',
        children: createElement(FeatureFlowDescriptionColumn, { ...baseProps, ...props }),
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

describe('FeatureFlowDescriptionColumn', () => {
  it('renders the section title when title is provided', () => {
    const html = renderWithTheme(createElement(FeatureFlowDescriptionColumn, baseProps));
    expect(html).toContain('What I work on');
  });

  it('renders no title when title is omitted', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowDescriptionColumn, { ...baseProps, title: undefined })
    );
    expect(html).not.toContain('What I work on');
  });

  it('renders one row per item', () => {
    const html = renderWithTheme(createElement(FeatureFlowDescriptionColumn, baseProps));
    expect(html).toContain('Design systems');
    expect(html).toContain('Performance');
  });

  it('calls onItemHover with the row index on hover', () => {
    const onItemHover = vi.fn();
    const { div, cleanup } = mount({ onItemHover });

    const buttons = div.querySelectorAll('button');
    act(() => buttons[1]?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })));

    expect(onItemHover).toHaveBeenCalledWith(1);
    cleanup();
  });

  it('calls onItemSelect with the item and index when an expandable row is clicked', () => {
    const onItemSelect = vi.fn();
    const { div, cleanup } = mount({ onItemSelect });

    const buttons = div.querySelectorAll('button');
    act(() => buttons[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true })));

    expect(onItemSelect).toHaveBeenCalledWith(items[0], 0);
    cleanup();
  });

  it('calls onLeave when the mouse leaves the row group', () => {
    const onLeave = vi.fn();
    const { div, cleanup } = mount({ onLeave });

    // React's onMouseLeave is implemented via the delegated, bubbling
    // 'mouseout' event — a real 'mouseleave' (non-bubbling) never reaches it.
    const group = div.querySelector('[class*="MuiStack-root"]');
    act(() => group?.dispatchEvent(new MouseEvent('mouseout', { bubbles: true })));

    expect(onLeave).toHaveBeenCalledTimes(1);
    cleanup();
  });

  it('calls onLeave when focus moves outside the row group', () => {
    const onLeave = vi.fn();
    const { div, cleanup } = mount({ onLeave });

    const buttons = Array.from(div.querySelectorAll('button'));
    const outside = document.createElement('button');
    document.body.appendChild(outside);

    // React's onBlur is implemented via the delegated, bubbling 'focusout'
    // event — a real 'blur' (non-bubbling) never reaches it.
    act(() => {
      buttons[0]?.dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, relatedTarget: outside })
      );
    });

    expect(onLeave).toHaveBeenCalledTimes(1);
    outside.remove();
    cleanup();
  });

  it('does not call onLeave when focus moves to another row within the group', () => {
    const onLeave = vi.fn();
    const { div, cleanup } = mount({ onLeave });

    const buttons = Array.from(div.querySelectorAll('button'));

    act(() => {
      buttons[0]?.dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, relatedTarget: buttons[1] })
      );
    });

    expect(onLeave).not.toHaveBeenCalled();
    cleanup();
  });
});
