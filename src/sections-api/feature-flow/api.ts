/**
 * `feature-flow` sections-api barrel — the one import path
 * `feature-flow-section.stories.tsx` uses to reach this domain's demo data
 * factories. See `src/sections-api/README.md` for the pattern this folder
 * follows and why it exists.
 *
 * Deliberately only the four factory functions: `image-paths.ts` and
 * `technology-icons.ts` are internal implementation details of `data.tsx`,
 * not part of this domain's public surface. Re-exporting raw data (like
 * `canonicalImagePaths`) here would give consumers a way to bypass the
 * factories entirely, which defeats the point of a swappable data layer —
 * see the ADR's "future swap path" section.
 */
export {
  createFeatureFlowCanonicalImage,
  createFeatureFlowCanonicalItems,
  createFeatureFlowCanonicalSectionConfig,
  createFeatureFlowEdgeCaseItems,
} from './data';
