import type { IconifyJSON } from '@iconify/react';

import { addCollection } from '@iconify/react';

// ----------------------------------------------------------------------
//
// WHY THIS EXISTS
//
// `GiselleIcon` renders icons from the @iconify/react store. That store is
// empty by default — icons must be pre-loaded into it before any component
// renders, otherwise @iconify/react falls back to a CDN fetch, which:
//
//   1. Causes visible flicker: the icon is blank until the network round-trip
//      completes (typically 100–300 ms).
//   2. Adds external network dependency: any CDN outage silently breaks icons.
//   3. Ships nothing: no icon data is bundled in your JS output.
//
// The correct pattern is to register icons offline — inline SVG body strings
// bundled directly in your JS, loaded synchronously before React renders.
//
// HOW TO USE
//
//   // src/icon-sets.ts  (in your app)
//   import { createIconRegistrar } from '@alexrebula/giselle-mui';
//
//   export const registerIcons = createIconRegistrar({
//     'solar:rocket-bold-duotone': {
//       body: '<path fill="currentColor" d="..." />',
//     },
//     'logos:react': {
//       // React logo is square 24×24 — width/height can be omitted
//       body: '<g fill="#61DAFB"><circle cx="12" cy="12" r="2.05" />...</g>',
//     },
//     'logos:angular-icon': {
//       // Angular paths are drawn on a 256×271 grid — explicit dims required
//       width: 256,
//       height: 271,
//       body: '<path fill="#E23237" d="M0 134.5..." />',
//     },
//   });
//
//   // src/icon-registrar.tsx  (a client component in your app)
//   'use client';
//   import { registerIcons } from './icon-sets';
//
//   registerIcons();  // module-level — runs once when the JS bundle evaluates
//
//   export function IconRegistrar() { return null; }
//
//   // Mount <IconRegistrar /> in your root layout so it fires on every route.
//
// VIEWBOX RULE
//
// @iconify/react uses the collection-level `width`/`height` as a fallback for
// any icon that omits its own dimensions. This utility defaults collections to
// 24×24, which matches Solar and simple-icons (the most common sets).
//
// Icons from the `logos:` collection are drawn on larger coordinate systems
// (e.g. 256×256, 256×271, 512×134). For those, you MUST supply explicit
// `width` and `height` on the icon entry — otherwise the 24×24 fallback clips
// the paths and the icon renders as a zoomed-in, cut-off fragment.
//
// ----------------------------------------------------------------------

/**
 * A single icon entry in the flat icon map.
 *
 * `body` — raw SVG path content (everything that goes inside `<svg>...</svg>`,
 *          excluding the `<svg>` wrapper tag itself).
 *
 * `width` — viewBox width. **Omit** for icons with a 24×24 viewBox (Solar,
 *           simple-icons, etc.). **Required** for icons with a non-24 viewBox
 *           (the `logos:` collection commonly uses 256px or larger).
 *
 * `height` — viewBox height. Same rule as `width`.
 */
export interface GiselleIconData {
  body: string;
  width?: number;
  height?: number;
}

/**
 * A flat map of icon entries keyed by `"prefix:name"` strings.
 *
 * @example
 * const icons: GiselleIconMap = {
 *   'solar:rocket-bold-duotone': { body: '...' },
 *   'logos:react': { body: '...' },
 *   'logos:angular-icon': { width: 256, height: 271, body: '...' },
 * };
 */
export type GiselleIconMap = Record<string, GiselleIconData>;

/**
 * Creates an idempotent icon registrar from a flat icon map.
 *
 * Groups the flat `"prefix:name"` entries into per-prefix
 * `IconifyJSON` collections and registers them with `@iconify/react`'s
 * `addCollection` on the first call. Subsequent calls are no-ops.
 *
 * Mount the returned function at module level in a client component in
 * your app root — not inside a React render body — so icons are
 * available before any component mounts.
 *
 * @param icons - Flat map of `"prefix:name"` → icon data entries.
 * @returns An idempotent `registerIcons()` function.
 *
 * @example
 * import { createIconRegistrar } from '@alexrebula/giselle-mui';
 *
 * export const registerIcons = createIconRegistrar({
 *   'solar:rocket-bold-duotone': { body: '...' },
 *   'logos:react': { body: '...' },
 * });
 */
export function createIconRegistrar(icons: GiselleIconMap): () => void {
  // Group the flat map into per-prefix IconifyJSON collections.
  // Collection-level width/height default to 24×24 (Solar / simple-icons standard).
  // Icons that carry their own width/height override the collection default.
  const collectionMap = new Map<string, IconifyJSON>();

  for (const [key, data] of Object.entries(icons)) {
    const colonAt = key.indexOf(':');
    if (colonAt === -1) continue; // silently skip malformed keys

    const prefix = key.slice(0, colonAt);
    const name = key.slice(colonAt + 1);

    if (!collectionMap.has(prefix)) {
      collectionMap.set(prefix, { prefix, width: 24, height: 24, icons: {} });
    }

    // Per-icon width/height (if present) will take precedence over the
    // collection default inside @iconify/react — no special handling needed.
    const collection = collectionMap.get(prefix);
    if (collection) {
      collection.icons[name] = data;
    }
  }

  const collections = Array.from(collectionMap.values());
  let registered = false;

  return function registerIcons(): void {
    if (registered) return;
    collections.forEach((collection) => addCollection(collection));
    registered = true;
  };
}
