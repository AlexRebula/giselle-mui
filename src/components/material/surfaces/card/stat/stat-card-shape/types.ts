import type { SVGProps } from 'react';

// ----------------------------------------------------------------------

/**
 * Props for `StatCardShape`.
 *
 * `StatCard` renders `<StatCardShape />` with no props today, but the type
 * accepts standard SVG attributes so a ref, `className`, or `data-*` attribute
 * can still be forwarded to the root `<svg>`.
 *
 * @internal — used by `StatCard` only.
 */
export type StatCardShapeProps = SVGProps<SVGSVGElement>;
