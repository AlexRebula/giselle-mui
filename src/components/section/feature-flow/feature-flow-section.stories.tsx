import type { Meta, StoryObj } from '@storybook/react';

import {
  createFeatureFlowCanonicalImage,
  createFeatureFlowCanonicalItems,
  createFeatureFlowCanonicalSectionConfig,
  createFeatureFlowEdgeCaseItems,
} from '../../../sections-api/feature-flow/api';
import { Accordion } from '../../material/surfaces/card/accordion';
import { withNavAdjacentContext } from './__fixtures__/nav-adjacent-decorator';
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
      { title: 'Adopted across 6 teams', description: 'Rolled out with zero breaking changes.' },
      {
        title: 'Cut review time in half',
        description: 'Shared patterns need less back-and-forth.',
      },
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

const canonicalSectionConfig = createFeatureFlowCanonicalSectionConfig();
const canonicalImage = createFeatureFlowCanonicalImage();
const canonicalItems = createFeatureFlowCanonicalItems();

/**
 * Canonical story: all six real expertise items — real titles, descriptions,
 * images, technology name/icon pairs, metrics, and highlight cards — copied
 * literally from a private consuming app's own production content (see
 * `src/sections-api/feature-flow/data.tsx`). Distinct from the synthetic
 * stories below, which use placeholder data for isolated edge cases.
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

const edgeCaseItems = createFeatureFlowEdgeCaseItems();

/** Every edge-case story below renders a single item against the shared placeholder image. */
function renderEdgeCase(title: string, item: FeatureFlowItem) {
  return () => <FeatureFlowSection title={title} items={[item]} image={image} />;
}

/** Edge case: an item with no `imgUrl` — the image column falls back to the shared image config. */
export const EdgeCaseNoImage: Story = {
  render: renderEdgeCase('Edge case — no image', edgeCaseItems.noImage),
};

/** Edge case: an item with no `technologies` — no technology chip strip renders. */
export const EdgeCaseNoTechnologies: Story = {
  render: renderEdgeCase('Edge case — no technologies', edgeCaseItems.noTechnologies),
};

/** Edge case: an item with no `metrics` — no metrics grid renders. */
export const EdgeCaseNoMetrics: Story = {
  render: renderEdgeCase('Edge case — no metrics', edgeCaseItems.noMetrics),
};

/** Edge case: an item with no `highlightCards` — no carousel renders in the right column. */
export const EdgeCaseNoHighlightCards: Story = {
  render: renderEdgeCase('Edge case — no highlight cards', edgeCaseItems.noHighlightCards),
};

/** Edge case: an item with a very long `longDescription` — confirms typography wraps sanely. */
export const EdgeCaseVeryLongDescription: Story = {
  render: renderEdgeCase('Edge case — very long description', edgeCaseItems.veryLongDescription),
};

/**
 * `renderRightPanel` overrides the right column entirely — here, a heading
 * and description swap with the hovered/active row instead of an image.
 * Demonstrates the shape a non-image consumer (e.g. skills documentation)
 * would use: no image column, no image-related props needed on the item.
 */
export const CustomRightPanel: Story = {
  render: () => (
    <FeatureFlowSection
      caption="What we do"
      title="Where we add the most value"
      items={items}
      image={image}
      renderRightPanel={(activeItem, isActiveExpanded) => (
        <div style={{ padding: 24 }}>
          <h3>{activeItem.title}</h3>
          <p>{activeItem.description}</p>
          <p style={{ opacity: 0.6 }}>{isActiveExpanded ? 'Expanded' : 'Not expanded'}</p>
        </div>
      )}
    />
  ),
};

/**
 * `renderHighlightPanel` overrides the expanded detail panel's right column
 * entirely — here, one `Accordion` per highlight card instead of the
 * built-in one-at-a-time carousel. Demonstrates the shape a documentation
 * consumer (e.g. a skill or article list) would use: every item's title is
 * visible at once, each expandable independently, rather than paged through.
 * Click "Design systems" (the only item with `highlightCards` in this
 * story's data) to see it.
 */
export const CustomHighlightPanel: Story = {
  render: () => (
    <FeatureFlowSection
      caption="What we do"
      title="Where we add the most value"
      items={items}
      image={image}
      renderHighlightPanel={(item) => (
        <div>
          {(item.highlightCards ?? []).map((card) => (
            <Accordion key={card.title} title={card.title}>
              <p>{card.description}</p>
            </Accordion>
          ))}
        </div>
      )}
    />
  ),
};
