import type { FeatureFlowTechnology } from '../types';

// ----------------------------------------------------------------------

/**
 * Technology → icon map for the canonical Storybook fixture only (issue
 * #171). This is exactly the set of technology names referenced across the
 * six canonical items below — not a general-purpose icon registry, and not
 * exported from the package barrel. `FeatureFlowTechnology` itself has no
 * opinion on icon resolution (see its own JSDoc): each consumer owns that
 * mapping, and this fixture is simply this story's own.
 *
 * `tsup` has no dedicated icon in the icon sets already used here, so it
 * reuses the same generic fallback icon the real canonical content's own
 * technology list falls back to when a tool has no dedicated logo mark.
 */
const TECHNOLOGY_ICON_MAP = {
  React: 'logos:react',
  'Next.js': 'logos:nextjs-icon',
  TypeScript: 'logos:typescript-icon',
  MUI: 'logos:material-ui',
  'Framer Motion': 'logos:framer',
  ESLint: 'simple-icons:eslint',
  Prettier: 'simple-icons:prettier',
  Jest: 'simple-icons:jest',
  Vitest: 'simple-icons:vitest',
  Angular: 'logos:angular-icon',
  'Vue.js': 'logos:vue',
  Storybook: 'logos:storybook-icon',
  tsup: 'solar:code-bold-duotone',
} as const satisfies Record<string, string>;

export type CanonicalTechnologyName = keyof typeof TECHNOLOGY_ICON_MAP;

/** Zips a list of known technology names into `{name, icon}` pairs. */
export function toTechnologies(names: readonly CanonicalTechnologyName[]): FeatureFlowTechnology[] {
  return names.map((name) => ({ name, icon: TECHNOLOGY_ICON_MAP[name] }));
}
