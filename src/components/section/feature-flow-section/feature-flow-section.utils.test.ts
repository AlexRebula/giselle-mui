// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createElement, act } from 'react';
import ReactDOM from 'react-dom/client';
import type * as ReactDOMModule from 'react-dom';

import {
  hasExpansionData,
  isRichLongDescription,
  useClientImagePrewarm,
  useImagePreloader,
  useScrollDirection,
  type ScrollDirectionState,
} from './feature-flow-section.utils';
import { SCROLL_IDLE_TIMEOUT_MS } from './feature-flow-section.const';
import type { FeatureFlowItem } from './types';

vi.mock('react-dom', async () => {
  const actual = await vi.importActual<typeof ReactDOMModule>('react-dom');
  return { ...actual, preload: vi.fn() };
});

// ---------------------------------------------------------------------------
// Harness — minimal component that captures a hook's return value.
// Mirrors the pattern used by src/utils/hooks/use-local-storage.test.ts.
// ---------------------------------------------------------------------------

function mountHook<T>(useHook: () => T) {
  let captured!: T;
  function Harness() {
    captured = useHook();
    return null;
  }
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = ReactDOM.createRoot(div);
  act(() => {
    root.render(createElement(Harness));
  });
  return {
    get value() {
      return captured;
    },
    cleanup: () => {
      act(() => root.unmount());
      div.remove();
    },
  };
}

// ---------------------------------------------------------------------------

const baseItem: FeatureFlowItem = {
  id: 'a',
  icon: 'solar:code-bold',
  title: 'Title',
  description: 'Description',
};

describe('hasExpansionData', () => {
  it('is false for an item with only the base fields', () => {
    expect(hasExpansionData(baseItem)).toBe(false);
  });

  it('is true when longDescription is set', () => {
    expect(hasExpansionData({ ...baseItem, longDescription: 'More' })).toBe(true);
  });

  it('is true when technologies has entries', () => {
    expect(
      hasExpansionData({ ...baseItem, technologies: [{ name: 'React', icon: 'logos:react' }] })
    ).toBe(true);
  });

  it('is true when metrics has entries', () => {
    expect(hasExpansionData({ ...baseItem, metrics: [{ value: '10', label: 'Years' }] })).toBe(
      true
    );
  });

  it('is true when highlightCards has entries', () => {
    expect(
      hasExpansionData({ ...baseItem, highlightCards: [{ headline: 'H', detail: 'D' }] })
    ).toBe(true);
  });

  it('is false when technologies/metrics/highlightCards are empty arrays', () => {
    expect(
      hasExpansionData({ ...baseItem, technologies: [], metrics: [], highlightCards: [] })
    ).toBe(false);
  });
});

describe('isRichLongDescription', () => {
  it('is false when longDescription is absent', () => {
    expect(isRichLongDescription(baseItem)).toBe(false);
  });

  it('is false when longDescription is a plain string', () => {
    expect(isRichLongDescription({ ...baseItem, longDescription: 'Plain text' })).toBe(false);
  });

  it('is true when longDescription is a non-string ReactNode', () => {
    expect(isRichLongDescription({ ...baseItem, longDescription: createElement('div') })).toBe(
      true
    );
  });
});

describe('useImagePreloader', () => {
  it('calls preload for every non-empty src', async () => {
    const { preload } = await import('react-dom');
    (preload as unknown as ReturnType<typeof vi.fn>).mockClear();
    const { cleanup } = mountHook(() => useImagePreloader(['/a.png', '', '/b.png']));
    expect(preload).toHaveBeenCalledTimes(2);
    cleanup();
  });

  it('marks the high-priority src as fetchPriority high and the rest as auto', async () => {
    const { preload } = await import('react-dom');
    (preload as unknown as ReturnType<typeof vi.fn>).mockClear();
    const { cleanup } = mountHook(() => useImagePreloader(['/a.png', '/b.png'], '/b.png'));
    expect(preload).toHaveBeenCalledWith('/a.png', { as: 'image', fetchPriority: 'auto' });
    expect(preload).toHaveBeenCalledWith('/b.png', { as: 'image', fetchPriority: 'high' });
    cleanup();
  });
});

describe('useClientImagePrewarm', () => {
  it('does nothing when given an empty list', () => {
    const { cleanup } = mountHook(() => useClientImagePrewarm([]));
    cleanup();
  });

  it('creates an Image for each src during an idle window', async () => {
    vi.useFakeTimers();
    const created: string[] = [];
    class FakeImage {
      set src(value: string) {
        created.push(value);
      }
    }
    vi.stubGlobal('Image', FakeImage);
    vi.stubGlobal('requestIdleCallback', undefined);
    vi.stubGlobal('cancelIdleCallback', undefined);

    const { cleanup } = mountHook(() => useClientImagePrewarm(['/x.png', '/y.png']));
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(created).toEqual(['/x.png', '/y.png']);

    cleanup();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });
});

describe('useScrollDirection', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
  });

  it('defaults to direction "down" and isScrolling false', () => {
    const hook = mountHook<ScrollDirectionState>(useScrollDirection);
    expect(hook.value).toEqual({ direction: 'down', isScrolling: false });
    hook.cleanup();
  });

  it('flips to "up" when scrollY decreases, and reports isScrolling: true', () => {
    window.scrollY = 100;
    const hook = mountHook<ScrollDirectionState>(useScrollDirection);

    window.scrollY = 40;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(hook.value).toEqual({ direction: 'up', isScrolling: true });
    hook.cleanup();
  });

  it('reports isScrolling: false again after the idle timeout elapses', () => {
    vi.useFakeTimers();
    const hook = mountHook<ScrollDirectionState>(useScrollDirection);

    window.scrollY = 50;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(hook.value.isScrolling).toBe(true);

    act(() => {
      vi.advanceTimersByTime(SCROLL_IDLE_TIMEOUT_MS + 1);
    });
    expect(hook.value.isScrolling).toBe(false);

    hook.cleanup();
    vi.useRealTimers();
  });
});
