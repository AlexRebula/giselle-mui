import type { FeatureFlowItem } from '../types';

// ----------------------------------------------------------------------
//
// Synthetic edge-case fixtures (issue #171) — placeholder/synthetic data,
// deliberately NOT the real canonical content, so each edge case stays
// obviously separate from `canonical-content.tsx`. Each item below omits
// exactly one optional field to demonstrate the component still renders
// correctly without it.
//
// ----------------------------------------------------------------------

/** No `imgUrl` — the hover-stack image column falls back to the shared image config. */
export const itemWithNoImage: FeatureFlowItem = {
  id: 'edge-no-image',
  icon: 'solar:widget-bold-duotone',
  title: 'Design systems',
  description: 'Consistent, accessible UI components at scale — with no per-item preview image.',
  longDescription:
    'This item intentionally omits `imgUrl`. The sticky image column should fall back to the ' +
    "shared image config's own stack sources rather than showing a blank frame.",
  technologies: [
    { name: 'React', icon: 'logos:react' },
    { name: 'TypeScript', icon: 'logos:typescript-icon' },
  ],
  metrics: [
    { value: '40+', label: 'Components shipped' },
    { value: '99%', label: 'Test coverage' },
  ],
  highlightCards: [
    { headline: 'Adopted across 6 teams', detail: 'Rolled out with zero breaking changes.' },
  ],
};

/** No `technologies` — the technology chip strip should not render at all. */
export const itemWithNoTechnologies: FeatureFlowItem = {
  id: 'edge-no-technologies',
  icon: 'solar:server-bold-duotone',
  title: 'Infrastructure hardening',
  description: 'Reliability work with no associated technology chip list.',
  longDescription:
    'This item intentionally omits `technologies`. The detail panel should render its metrics ' +
    'and highlight cards without a technology chip strip.',
  metrics: [
    { value: '99.98%', label: 'Uptime' },
    { value: '4', label: 'Incidents resolved' },
  ],
  highlightCards: [
    { headline: 'Zero-downtime deploys', detail: 'Rolling deploys with automatic rollback.' },
  ],
};

/** No `metrics` — the metrics grid above the long description should not render at all. */
export const itemWithNoMetrics: FeatureFlowItem = {
  id: 'edge-no-metrics',
  icon: 'solar:pallete-2-bold-duotone',
  title: 'Brand and visual identity',
  description: 'Design-system work with no stat blocks to show.',
  longDescription:
    'This item intentionally omits `metrics`. The detail panel should render its technology ' +
    'chips and highlight cards without a metrics grid above the description.',
  technologies: [{ name: 'Storybook', icon: 'logos:storybook-icon' }],
  highlightCards: [
    { headline: 'One visual language', detail: 'A single token set drives every surface.' },
  ],
};

/** No `highlightCards` — the right-column carousel should not render at all. */
export const itemWithNoHighlightCards: FeatureFlowItem = {
  id: 'edge-no-highlight-cards',
  icon: 'solar:bolt-bold-duotone',
  title: 'Performance engineering',
  description: 'Speed work with no supporting highlight-card carousel.',
  longDescription:
    'This item intentionally omits `highlightCards`. The detail panel should render its metrics ' +
    'and technology chips as a single-column layout, with no carousel on the right.',
  technologies: [{ name: 'Vitest', icon: 'logos:vitest' }],
  metrics: [{ value: '<1s', label: 'Time to interactive' }],
};

/** A very long `longDescription` — confirms the detail panel's typography wraps and scrolls sanely. */
export const itemWithVeryLongDescription: FeatureFlowItem = {
  id: 'edge-very-long-description',
  icon: 'solar:document-text-bold-duotone',
  title: 'Extremely thorough documentation',
  description: 'A description column entry paired with an unusually long expanded write-up.',
  longDescription: Array.from(
    { length: 6 },
    (_, i) =>
      `Paragraph ${i + 1} of an intentionally long-form write-up: ` +
      'this fixture exists purely to confirm the detail panel keeps wrapping and spacing sane ' +
      'when a real author writes far more prose than the compact items typically carry — ' +
      'multiple sentences, several clauses, and enough total length that the panel would visibly ' +
      'break if line-height, max-width, or overflow handling were ever regressed by a future change.'
  ).join('\n\n'),
  technologies: [{ name: 'TypeScript', icon: 'logos:typescript-icon' }],
  metrics: [{ value: '6', label: 'Paragraphs' }],
  highlightCards: [
    { headline: 'Still readable', detail: 'Long-form prose should never break the layout.' },
  ],
};
