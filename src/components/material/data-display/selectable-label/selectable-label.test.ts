// @vitest-environment jsdom
/**
 * Unit tests for SelectableLabel.
 *
 * MUI Chip's clickable variant renders a focusable, keyboard-activatable
 * element and correctly forwards aria-pressed, disabled, and onClick — no
 * mock needed. Mirrors SelectableCard's test structure.
 *
 * ## What is tested
 * - aria-pressed="false" when selected=false
 * - aria-pressed="true" when selected=true
 * - The checkmark icon is present only when selected
 * - The label text renders
 * - onSelectedChange fires with the toggled (next) value when clicked
 * - onSelectedChange does NOT fire when the label is disabled
 * - disabled attribute/class is present on the DOM element when disabled=true
 * - Extra props (aria-label, data-*) are forwarded to the root element
 */

import React, { act } from 'react';
import ReactDOM from 'react-dom/client';
import { it, vi, expect, describe, afterEach } from 'vitest';

import { renderWithTheme } from '../../../../test-utils';
import { GiselleThemeProvider } from '../../../theming/theme-provider/giselle/giselle';
import { SelectableLabel } from './selectable-label';

(globalThis as unknown as Record<string, unknown>)['IS_REACT_ACT_ENVIRONMENT'] = true;

// ---------------------------------------------------------------------------

describe('SelectableLabel — structure', () => {
  it('has aria-pressed="false" when selected is false', () => {
    const html = renderWithTheme(
      React.createElement(SelectableLabel, { selected: false, label: 'Software Engineering' })
    );
    expect(html).toContain('aria-pressed="false"');
  });

  it('has aria-pressed="true" when selected is true', () => {
    const html = renderWithTheme(
      React.createElement(SelectableLabel, { selected: true, label: 'Software Engineering' })
    );
    expect(html).toContain('aria-pressed="true"');
  });

  it('renders the label text', () => {
    const html = renderWithTheme(
      React.createElement(SelectableLabel, { selected: false, label: 'Teaching & Mentoring' })
    );
    expect(html).toContain('Teaching &amp; Mentoring');
  });

  it('renders a checkmark icon when selected', () => {
    const html = renderWithTheme(
      React.createElement(SelectableLabel, { selected: true, label: 'x' })
    );
    expect(html).toContain('<svg');
  });

  it('renders no icon when not selected', () => {
    const html = renderWithTheme(
      React.createElement(SelectableLabel, { selected: false, label: 'x' })
    );
    expect(html).not.toContain('<svg');
  });

  it('forwards aria-label to the root element', () => {
    const html = renderWithTheme(
      React.createElement(SelectableLabel, {
        selected: false,
        label: 'x',
        'aria-label': 'Filter by Software Engineering',
      } as React.ComponentProps<typeof SelectableLabel> & { 'aria-label': string })
    );
    expect(html).toContain('aria-label="Filter by Software Engineering"');
  });

  it('renders the Mui-disabled class when disabled=true', () => {
    const html = renderWithTheme(
      React.createElement(SelectableLabel, { selected: false, label: 'x', disabled: true })
    );
    expect(html).toContain('Mui-disabled');
  });
});

// ---------------------------------------------------------------------------

describe('SelectableLabel — deferred coverage', () => {
  it.todo('activates via keyboard Enter/Space, not just a synthetic click event');
});

describe('SelectableLabel — interactions', () => {
  let root: ReturnType<typeof ReactDOM.createRoot> | null = null;
  let container: HTMLDivElement | null = null;

  afterEach(() => {
    if (root && container) {
      act(() => {
        root!.unmount();
      });
      container.remove();
      root = null;
      container = null;
    }
  });

  const mount = (props: React.ComponentProps<typeof SelectableLabel>) => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
    act(() => {
      root!.render(
        React.createElement(GiselleThemeProvider, null, React.createElement(SelectableLabel, props))
      );
    });
    return container;
  };

  it('calls onSelectedChange with true when an unselected label is clicked', () => {
    const spy = vi.fn();
    const div = mount({ selected: false, label: 'x', onSelectedChange: spy });
    div
      .querySelector('[role="button"], .MuiChip-clickable')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('calls onSelectedChange with false when a selected label is clicked', () => {
    const spy = vi.fn();
    const div = mount({ selected: true, label: 'x', onSelectedChange: spy });
    div
      .querySelector('[role="button"], .MuiChip-clickable')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('does NOT call onSelectedChange when the label is disabled', () => {
    const spy = vi.fn();
    const div = mount({ selected: false, label: 'x', disabled: true, onSelectedChange: spy });
    div
      .querySelector('[role="button"], .MuiChip-clickable')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(spy).not.toHaveBeenCalled();
  });
});
