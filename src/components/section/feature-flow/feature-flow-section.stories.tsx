import type { Meta, StoryObj } from '@storybook/react';

import {
  canonicalImage,
  canonicalItems,
  canonicalSectionConfig,
} from './__fixtures__/canonical-content';
import { withNavAdjacentContext } from './__fixtures__/nav-adjacent-decorator';
import {
  itemWithNoHighlightCards,
  itemWithNoImage,
  itemWithNoMetrics,
  itemWithNoTechnologies,
  itemWithVeryLongDescription,
} from './__fixtures__/synthetic-edge-cases';
import { FeatureFlowSection } from './feature-flow-section';
import type { FeatureFlowItem } from './types';

// ----------------------------------------------------------------------

const meta: Meta<typeof FeatureFlowSection> = {
  title: 'Section/Feature Flow',
  component: FeatureFlowSection,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    sx: { control: false },
    image: { control: false },
    items: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof FeatureFlowSection>;

// ----------------------------------------------------------------------

const items: FeatureFlowItem[] = [
  {
    id: 'design-systems',
    icon: 'solar:widget-bold-duotone',
    title: 'Design systems',
    description: 'Consistent, accessible UI components at scale.',
    imgUrl: ['/placeholder/frame-1.svg', '/placeholder/frame-2.svg'],
    longDescription:
      'A shared component library with documented tokens, states, and accessibility ' +
      'guarantees — built once, reused across every product surface.',
    metrics: [
      { value: '40+', label: 'Components shipped' },
      { value: '99%', label: 'Test coverage' },
    ],
    technologies: [
      { name: 'React', icon: 'logos:react' },
      { name: 'TypeScript', icon: 'logos:typescript-icon' },
      { name: 'Storybook', icon: 'logos:storybook-icon' },
    ],
    highlightCards: [
      { headline: 'Adopted across 6 teams', detail: 'Rolled out with zero breaking changes.' },
      { headline: 'Cut review time in half', detail: 'Shared patterns need less back-and-forth.' },
    ],
  },
  {
    id: 'performance',
    icon: 'solar:bolt-bold-duotone',
    title: 'Performance engineering',
    description: 'Fast by default, measured continuously.',
    imgUrl: ['/placeholder/frame-3.svg'],
    metrics: [{ value: '<1s', label: 'Time to interactive' }],
    technologies: [{ name: 'Vite', icon: 'logos:vitejs' }],
  },
  {
    id: 'brand',
    icon: 'solar:pallete-2-bold-duotone',
    title: 'Brand and visual identity',
    description: 'A quiet, informational item with no expansion data — not interactive.',
  },
];

const image = {
  src: '/placeholder/frame-1.svg',
  alt: 'Preview of the active feature',
};

/**
 * A representative item set: one item with full expansion data (metrics, tech
 * chips, highlight cards), one with partial expansion data, and one with none
 * at all — confirming that a bare item renders as non-interactive.
 */
export const Default: Story = {
  render: () => (
    <FeatureFlowSection
      caption="What we do"
      title="Where we add the most value"
      txtGradient="value"
      items={items}
      image={image}
    />
  ),
};

/** The description column renders on the right and the image column on the left. */
export const RightLayout: Story = {
  render: () => (
    <FeatureFlowSection
      title="Where we add the most value"
      items={items}
      image={image}
      layoutDirection="right"
    />
  ),
};

// ----------------------------------------------------------------------
// Canonical — real content (issue #171)
// ----------------------------------------------------------------------

/**
 * Canonical story: all six real expertise items — real titles, descriptions,
 * images, technology name/icon pairs, metrics, and highlight cards — copied
 * literally from the consuming portfolio app's own production content (see
 * `__fixtures__/canonical-content.tsx`). Distinct from the synthetic stories
 * below, which use placeholder data for isolated edge cases.
 *
 * Wrapped in `withNavAdjacentContext` (`__fixtures__/nav-adjacent-decorator.tsx`)
 * — a giselle-mui-local demonstration harness that mimics the shape of a
 * consuming app's own "nav appears once you scroll past this point" pattern
 * (scroll/active-item context, a small nav-like UI element, and a visibility
 * sentinel). It is not a port of any specific app's nav component.
 *
 * Demonstrates, live in this story:
 * - `FeatureFlowSection`'s own `FloatingSubNav`: one entry generated per
 *   item, active-item tracking, and click-to-scroll.
 * - The scroll-into-view-on-expand behaviour (issue #169) firing correctly
 *   inside this decorator's own scrollable context.
 *
 * See `feature-flow-section.canonical-story.test.ts` for an automated
 * interaction test composed from this exact story.
 */
export const Canonical: Story = {
  decorators: [withNavAdjacentContext],
  render: () => (
    <FeatureFlowSection {...canonicalSectionConfig} items={canonicalItems} image={canonicalImage} />
  ),
};

// ----------------------------------------------------------------------
// Synthetic edge cases — placeholder data, not the real content
// ----------------------------------------------------------------------

/** Edge case: an item with no `imgUrl` — the image column falls back to the shared image config. */
export const EdgeCaseNoImage: Story = {
  render: () => (
    <FeatureFlowSection title="Edge case — no image" items={[itemWithNoImage]} image={image} />
  ),
};

/** Edge case: an item with no `technologies` — no technology chip strip renders. */
export const EdgeCaseNoTechnologies: Story = {
  render: () => (
    <FeatureFlowSection
      title="Edge case — no technologies"
      items={[itemWithNoTechnologies]}
      image={image}
    />
  ),
};

/** Edge case: an item with no `metrics` — no metrics grid renders. */
export const EdgeCaseNoMetrics: Story = {
  render: () => (
    <FeatureFlowSection title="Edge case — no metrics" items={[itemWithNoMetrics]} image={image} />
  ),
};

/** Edge case: an item with no `highlightCards` — no carousel renders in the right column. */
export const EdgeCaseNoHighlightCards: Story = {
  render: () => (
    <FeatureFlowSection
      title="Edge case — no highlight cards"
      items={[itemWithNoHighlightCards]}
      image={image}
    />
  ),
};

/** Edge case: an item with a very long `longDescription` — confirms typography wraps sanely. */
export const EdgeCaseVeryLongDescription: Story = {
  render: () => (
    <FeatureFlowSection
      title="Edge case — very long description"
      items={[itemWithVeryLongDescription]}
      image={image}
    />
  ),
};
