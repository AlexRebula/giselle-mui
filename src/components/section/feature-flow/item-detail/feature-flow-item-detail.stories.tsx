import type { Meta, StoryObj } from '@storybook/react';

import type { FeatureFlowItem } from '../types';
import { FeatureFlowItemDetail } from './feature-flow-item-detail';

// ----------------------------------------------------------------------

const sampleItem: FeatureFlowItem = {
  id: 'design-systems',
  icon: 'solar:widget-bold-duotone',
  title: 'Design systems',
  description: 'Consistent, accessible UI components at scale.',
  longDescription:
    'A shared component library and set of design tokens that keep every product surface visually and behaviourally consistent, without slowing teams down.',
  metrics: [
    { value: '20+', label: 'Components', sublabel: 'shipped' },
    { value: '99%', label: 'Coverage' },
  ],
  technologies: [
    { name: 'React', icon: 'logos:react' },
    { name: 'TypeScript', icon: 'logos:typescript-icon' },
  ],
  highlightCards: [{ title: 'Shipped 3 releases', description: 'In under a month.' }],
};

const meta: Meta<typeof FeatureFlowItemDetail> = {
  title: 'Section/Feature Flow/Item Detail',
  component: FeatureFlowItemDetail,
  args: {
    item: sampleItem,
  },
};

export default meta;
type Story = StoryObj<typeof FeatureFlowItemDetail>;

// ----------------------------------------------------------------------

export const Default: Story = {};

/** No item currently expanded — the panel renders nothing. */
export const Collapsed: Story = {
  args: { item: null },
};
