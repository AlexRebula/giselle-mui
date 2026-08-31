import type { UseScrollOptions } from 'framer-motion';

// ----------------------------------------------------------------------

/**
 * Per-step delay in the hover-stack crossfade sequence: how long each image in
 * an item's `imgUrl`/`stackSources` sequence stays visible before advancing to
 * the next one. Fixed internal timing, not exposed as a prop.
 */
export const HOVER_STEP_DELAY_MS = 180;

/**
 * How long after the last scroll event the page is considered "idle" again.
 * While scrolling is active (and the user hasn't clicked an item), the image
 * column shows the scroll-direction image instead of the hover sequence.
 * Fixed internal timing, not exposed as a prop.
 */
export const SCROLL_IDLE_TIMEOUT_MS = 1000;

// ----------------------------------------------------------------------
// Image column entrance transform
// ----------------------------------------------------------------------

/**
 * Viewport-offset window (see framer-motion's `useScroll` `offset` option)
 * over which the sticky image column's entrance transform resolves: begins
 * as the column's top edge crosses 90% down the viewport (just entering
 * view) and settles into its resting state by 40% down (roughly the
 * vertical center) — the same conceptual "entering the viewport" window the
 * scroll-direction detection tracks, expressed as an element-relative range.
 */
export const IMAGE_REVEAL_SCROLL_OFFSET: UseScrollOptions['offset'] = ['start 90%', 'start 40%'];

/** Entrance transform starting values — each resolves to its resting state
 * (opacity 1, y 0, scale 1, blur 0) as scroll progress goes from 0 to 1. */
export const IMAGE_REVEAL_OPACITY_FROM = 0;
export const IMAGE_REVEAL_Y_FROM_PX = 32;
export const IMAGE_REVEAL_SCALE_FROM = 0.94;
export const IMAGE_REVEAL_BLUR_FROM_PX = 12;

// ----------------------------------------------------------------------
// Detail panel layout transition
// ----------------------------------------------------------------------

/**
 * Layout transition for the `m.div` wrapping the expanded detail panel:
 * smoothly animates the container's height when the expanded item changes,
 * instead of jumping instantly. Matches the original `expertise-areas.tsx`'s
 * equivalent wrapper. `FloatingSubNav` deliberately sits outside this `m.div`
 * (see #193) — its own zero-height sticky wrapper doesn't affect the height
 * being animated here either way.
 */
export const DETAIL_PANEL_LAYOUT_TRANSITION = {
  layout: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
} as const;
