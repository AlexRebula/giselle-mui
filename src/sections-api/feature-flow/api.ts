/**
 * `feature-flow` sections-api barrel — the one import path
 * `feature-flow-section.stories.tsx` uses to reach this domain's demo data
 * factories. See `src/sections-api/README.md` for the pattern this folder
 * follows and why it exists.
 */
export {
  createFeatureFlowCanonicalImage,
  createFeatureFlowCanonicalItems,
  createFeatureFlowCanonicalSectionConfig,
  createFeatureFlowEdgeCaseItems,
} from './data';
export { canonicalImagePaths } from './image-paths';
export { toTechnologies } from './technology-icons';
export type { CanonicalTechnologyName } from './technology-icons';
