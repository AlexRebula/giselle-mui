import { useEffect, useRef, useState } from 'react';
import { preload } from 'react-dom';

import { SCROLL_IDLE_TIMEOUT_MS } from './feature-flow-section.const';
import type { FeatureFlowItem } from './types';

// ----------------------------------------------------------------------

/**
 * True when an item carries any field beyond the base four (`id`, `icon`,
 * `title`, `description`) — the presence of any of these is what makes an
 * item interactive (clickable, with a detail panel).
 */
export function hasExpansionData(item: FeatureFlowItem): boolean {
  return !!(
    item.longDescription ||
    item.technologies?.length ||
    item.metrics?.length ||
    item.highlightCards?.length
  );
}

/**
 * True when `longDescription` is rich content (not a plain string, and not
 * absent) that should render directly rather than be wrapped in a
 * `Typography` paragraph alongside the plain-string fallback to `description`.
 */
export function isRichLongDescription(item: FeatureFlowItem): boolean {
  return typeof item.longDescription !== 'string' && item.longDescription != null;
}

// ----------------------------------------------------------------------

/**
 * Emits an SSR `<link rel="preload" as="image">` hint for every given source
 * via React's `preload()` API, so the browser starts fetching images before
 * they are ever rendered. `highPrioritySrc` (typically the first frame the
 * user will see) gets `fetchPriority: 'high'`; the rest are `'auto'`.
 */
export function useImagePreloader(srcs: readonly string[], highPrioritySrc?: string): void {
  srcs.forEach((src) => {
    if (src) {
      preload(src, {
        as: 'image',
        fetchPriority: src === highPrioritySrc ? 'high' : 'auto',
      });
    }
  });
}

// ----------------------------------------------------------------------

type IdleHandle = number;

const scheduleIdle: (cb: () => void) => IdleHandle =
  typeof requestIdleCallback !== 'undefined'
    ? (cb) => requestIdleCallback(cb)
    : (cb) => globalThis.setTimeout(cb, 0) as unknown as IdleHandle;

const cancelIdle: (id: IdleHandle) => void =
  typeof cancelIdleCallback !== 'undefined'
    ? (id) => cancelIdleCallback(id)
    : (id) => globalThis.clearTimeout(id);

/**
 * Client-side idle-time image prewarming: decodes every given source into the
 * browser's image cache during an idle window, so later crossfade swaps
 * appear instant. Complements `useImagePreloader`'s SSR preload hint — this
 * hook is the client-side follow-up that actually forces a decode.
 */
export function useClientImagePrewarm(srcs: readonly string[]): void {
  useEffect(() => {
    if (!srcs.length) return undefined;
    let cancelled = false;
    const handle = scheduleIdle(() => {
      if (cancelled) return;
      srcs.forEach((src) => {
        if (!src) return;
        const img = new Image();
        img.src = src;
      });
    });
    return () => {
      cancelled = true;
      cancelIdle(handle);
    };
  }, [srcs]);
}

// ----------------------------------------------------------------------

export type ScrollDirectionState = {
  direction: 'down' | 'up';
  /** True while the user is actively scrolling; false once idle for `SCROLL_IDLE_TIMEOUT_MS`. */
  isScrolling: boolean;
};

/**
 * Tracks page scroll direction and a scrolling/idle flag, so the image column
 * can prefer a scroll-direction image while the user is actively scrolling and
 * fall back to the hover/selection sequence once scrolling goes idle.
 */
export function useScrollDirection(): ScrollDirectionState {
  const [state, setState] = useState<ScrollDirectionState>({
    direction: 'down',
    isScrolling: false,
  });
  const prevYRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);

  useEffect(() => {
    prevYRef.current = globalThis.scrollY ?? 0;

    const handleScroll = () => {
      const latest = globalThis.scrollY ?? 0;
      const direction = latest > prevYRef.current ? 'down' : 'up';
      prevYRef.current = latest;

      setState({ direction, isScrolling: true });

      if (idleTimerRef.current) globalThis.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = globalThis.setTimeout(() => {
        setState((prev) => ({ ...prev, isScrolling: false }));
        idleTimerRef.current = null;
      }, SCROLL_IDLE_TIMEOUT_MS);
    };

    globalThis.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      globalThis.removeEventListener('scroll', handleScroll);
      if (idleTimerRef.current) globalThis.clearTimeout(idleTimerRef.current);
    };
  }, []);

  return state;
}
