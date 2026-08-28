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
