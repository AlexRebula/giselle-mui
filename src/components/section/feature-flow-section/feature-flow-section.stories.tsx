import type { Meta, StoryObj } from '@storybook/react';

import { FeatureFlowSection } from './feature-flow-section';
import type { FeatureFlowItem } from './types';

// ----------------------------------------------------------------------

const meta: Meta<typeof FeatureFlowSection> = {
  title: 'Section/Feature Flow Section',
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
