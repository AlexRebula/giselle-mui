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
  useImageRevealTransform,
  useScrollDirection,
  type ScrollDirectionState,
} from './feature-flow-section.utils';
import {
  IMAGE_REVEAL_BLUR_FROM_PX,
  IMAGE_REVEAL_OPACITY_FROM,
  IMAGE_REVEAL_SCALE_FROM,
  IMAGE_REVEAL_SCROLL_OFFSET,
  IMAGE_REVEAL_Y_FROM_PX,
  SCROLL_IDLE_TIMEOUT_MS,
} from './feature-flow-section.const';
import type { FeatureFlowItem } from './types';

vi.mock('react-dom', async () => {
  const actual = await vi.importActual<typeof ReactDOMModule>('react-dom');
  return { ...actual, preload: vi.fn() };
});

// useImageRevealTransform's own hook calls are stubbed so its tests assert on
// *wiring* (which ref, which offset window, which input/output ranges) rather
// than on framer-motion's real scroll-tracking timing, which needs a real
// scrollable DOM this suite doesn't have. `useScroll` reports zero progress;
// `useTransform` resolves to the "from" (index 0) end of its output range —
// i.e. the transform's state at scroll progress 0 — `useMotionTemplate`
// reassembles its tagged-template inputs into a plain string, and
// `useReducedMotion` reports no preference (the reduced-motion branch is
// exercised in its own describe block below, with this mocked `true`).
vi.mock('framer-motion', () => ({
  useScroll: vi.fn(() => ({ scrollYProgress: 0 })),
  useTransform: vi.fn((_value: unknown, _input: unknown, output: readonly unknown[]) => output[0]),
  useMotionTemplate: (strings: TemplateStringsArray, ...values: unknown[]) =>
    strings.reduce((acc, str, i) => `${acc}${str}${i < values.length ? values[i] : ''}`, ''),
  useReducedMotion: vi.fn(() => false),
}));

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

describe('useImageRevealTransform', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('tracks the returned ref over IMAGE_REVEAL_SCROLL_OFFSET', async () => {
    const { useScroll } = await import('framer-motion');
    const hook = mountHook(useImageRevealTransform);

    expect(useScroll).toHaveBeenCalledWith({
      target: hook.value.ref,
      offset: IMAGE_REVEAL_SCROLL_OFFSET,
    });

    hook.cleanup();
  });

  it('derives opacity/y/scale/blur from scroll progress into their own resting ranges', async () => {
    const { useTransform } = await import('framer-motion');
    const hook = mountHook(useImageRevealTransform);

    // Every transform reads the same scrollYProgress (0 under this suite's
    // stub) over [0, 1], each into its own [from, resting] output range.
    expect(useTransform).toHaveBeenCalledWith(0, [0, 1], [IMAGE_REVEAL_OPACITY_FROM, 1]);
    expect(useTransform).toHaveBeenCalledWith(0, [0, 1], [IMAGE_REVEAL_Y_FROM_PX, 0]);
    expect(useTransform).toHaveBeenCalledWith(0, [0, 1], [IMAGE_REVEAL_SCALE_FROM, 1]);
    expect(useTransform).toHaveBeenCalledWith(0, [0, 1], [IMAGE_REVEAL_BLUR_FROM_PX, 0]);

    hook.cleanup();
  });

  it('pins every value to its resting state when prefers-reduced-motion is set, instead of the scroll-driven "from" range', async () => {
    const { useTransform, useReducedMotion } = await import('framer-motion');
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValueOnce(true);
    const hook = mountHook(useImageRevealTransform);

    expect(useTransform).toHaveBeenCalledWith(0, [0, 1], [1, 1]);
    expect(useTransform).toHaveBeenCalledWith(0, [0, 1], [0, 0]);
    expect(hook.value.style.filter).toBe('blur(0px)');

    hook.cleanup();
  });

  it('resolves the composed blur filter string from the blur motion value', () => {
    const hook = mountHook(useImageRevealTransform);

    expect(hook.value.style.filter).toBe(`blur(${IMAGE_REVEAL_BLUR_FROM_PX}px)`);

    hook.cleanup();
  });
});
