// @vitest-environment jsdom
import React from 'react';
import { act } from 'react-dom/test-utils';
import ReactDOM from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { EyeButton } from './eye-button';
import { EYE_BUTTON_MIN_SIZE, PHASE_EYE_ICON_SIZE } from './eye-button.const';

function renderButton(props: Partial<React.ComponentProps<typeof EyeButton>> = {}) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);
  act(() => {
    root.render(
      React.createElement(EyeButton, {
        isViewed: false,
        onMarkViewed: () => {},
        columnSide: 'right',
        ...props,
      })
    );
  });
  return { container, root };
}

describe('EyeButton — rendering', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders an accessible toggle button reflecting the not-viewed state', () => {
    const html = renderToStaticMarkup(
      React.createElement(EyeButton, {
        isViewed: false,
        onMarkViewed: () => {},
        columnSide: 'right',
      })
    );

    expect(html).toContain('aria-label="Mark as viewed"');
    expect(html).toContain('aria-pressed="false"');
  });

  it('renders an accessible toggle button reflecting the viewed state', () => {
    const html = renderToStaticMarkup(
      React.createElement(EyeButton, {
        isViewed: true,
        onMarkViewed: () => {},
        columnSide: 'right',
      })
    );

    expect(html).toContain('aria-label="Mark as not viewed"');
    expect(html).toContain('aria-pressed="true"');
  });
});

// ---------------------------------------------------------------------------
// Interaction — mirrors the invariant the phase-card eye button previously
// mirror-tested inline: the click handler must call onMarkViewed unconditionally
// (not gated on isViewed) and must stop the click from propagating to the
// card, otherwise clicking the eye button would also toggle card expansion.
// ---------------------------------------------------------------------------

describe('EyeButton — interaction', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('calls onMarkViewed when clicked', () => {
    const onMarkViewed = vi.fn();
    const { container } = renderButton({ onMarkViewed });

    const button = container.querySelector('button')!;
    act(() => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onMarkViewed).toHaveBeenCalledTimes(1);
  });

  it('calls onMarkViewed unconditionally, regardless of isViewed', () => {
    const onMarkViewed = vi.fn();
    const { container } = renderButton({ onMarkViewed, isViewed: true });

    const button = container.querySelector('button')!;
    act(() => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onMarkViewed).toHaveBeenCalledTimes(1);
  });

  it('stops the click from propagating to an ancestor (card must not also toggle expansion)', () => {
    // The listener must live on a genuine DOM ancestor OUTSIDE the React root
    // container — React 17+ delegates all synthetic events at the root
    // container itself, so a listener attached to that same node would fire
    // from native bubbling before the synthetic stopPropagation() call could
    // affect it, producing a false failure unrelated to the component.
    const onMarkViewed = vi.fn();
    const parentClick = vi.fn();
    const wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
    wrapper.addEventListener('click', parentClick);
    const reactRoot = document.createElement('div');
    wrapper.appendChild(reactRoot);
    const root = ReactDOM.createRoot(reactRoot);
    act(() => {
      root.render(
        React.createElement(EyeButton, { isViewed: false, onMarkViewed, columnSide: 'right' })
      );
    });

    const button = reactRoot.querySelector('button')!;
    act(() => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onMarkViewed).toHaveBeenCalledTimes(1);
    expect(parentClick).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// WCAG accessibility regression
// ---------------------------------------------------------------------------

describe('eye button — WCAG accessibility regression', () => {
  it('[regression] PHASE_EYE_ICON_SIZE >= 20px (WCAG 1.4.11 — interactive icon minimum)', () => {
    expect(PHASE_EYE_ICON_SIZE).toBeGreaterThanOrEqual(20);
  });

  it('[regression] EYE_BUTTON_MIN_SIZE >= 24px (WCAG 2.2 AA 2.5.8 — minimum touch target)', () => {
    expect(EYE_BUTTON_MIN_SIZE).toBeGreaterThanOrEqual(24);
  });

  it('[regression] EYE_BUTTON_MIN_SIZE >= PHASE_EYE_ICON_SIZE (button must be larger than its icon)', () => {
    expect(EYE_BUTTON_MIN_SIZE).toBeGreaterThanOrEqual(PHASE_EYE_ICON_SIZE);
  });
});
