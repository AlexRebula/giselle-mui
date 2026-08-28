import type { Variants } from 'framer-motion';

// ----------------------------------------------------------------------

/** Default slide distance (px) for the headline/detail text's directional enter/exit. */
export const HIGHLIGHT_TEXT_SLIDE_DISTANCE = 24;

/**
 * Directional slide-in variants for the headline/detail text. `custom` is
 * the navigation step (`1` next, `-1` previous): text enters from the side
 * matching that step and exits toward the opposite side. `AnimatePresence`'s
 * own `custom` prop (set where this is used) forwards the latest step to the
 * outgoing element, so reversing direction mid-animation never exits toward
 * a stale side. Structured the same way as the main section's own
 * detail-panel transition (`AnimatePresence` + a keyed `motion.div` with a
 * `transition` prop) for consistency within this component tree.
 *
 * `distance` collapses to `0` when the visitor prefers reduced motion
 * (still a plain opacity crossfade, never a slide) — same `useReducedMotion`
 * hook already used by the interactive hero logo.
 */
export const highlightTextVariants = (distance: number): Variants => ({
  enter: (step: number) => ({
    opacity: 0,
    x: step >= 0 ? distance : -distance,
  }),
  center: { opacity: 1, x: 0 },
  exit: (step: number) => ({
    opacity: 0,
    x: step >= 0 ? -distance : distance,
  }),
});
