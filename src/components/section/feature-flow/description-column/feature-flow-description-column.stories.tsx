import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Box from '@mui/material/Box';

import { FeatureFlowDescriptionColumn } from './feature-flow-description-column';
import type { FeatureFlowItem } from '../types';

// ----------------------------------------------------------------------

const items: FeatureFlowItem[] = [
  {
    id: 'design-systems',
    icon: 'solar:widget-bold-duotone',
    title: 'Design systems',
    description: 'Consistent, accessible UI components at scale.',
    longDescription: 'A shared component library and set of design tokens.',
  },
  {
    id: 'performance',
    icon: 'solar:bolt-bold-duotone',
    title: 'Performance',
    description: 'Fast by default, measured continuously.',
    longDescription: 'Core Web Vitals budgets enforced in CI on every PR.',
  },
  {
    id: 'brand-identity',
    icon: 'solar:pallete-2-bold-duotone',
    title: 'Brand and visual identity',
    description: 'A quiet, informational item with no expansion data.',
  },
];

/** Wires FeatureFlowDescriptionColumn to real component state so hover/click actually drive it. */
function InteractiveDemo() {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  return (
    <Box sx={{ maxWidth: 480 }}>
      <FeatureFlowDescriptionColumn
        caption="Expertise"
        title="What I bring to"
        txtGradient="every team"
        description="A quick tour of where I focus, in practice."
        items={items}
        selectedItemIndex={selectedItemIndex}
        activeItemIndex={activeItemIndex}
        expandedItemId={null}
        onItemHover={setActiveItemIndex}
        onItemSelect={(_item, index) => setSelectedItemIndex(index)}
        onLeave={() => setActiveItemIndex(selectedItemIndex)}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

const meta: Meta<typeof FeatureFlowDescriptionColumn> = {
  title: 'Section/Feature Flow/Description Column',
  component: FeatureFlowDescriptionColumn,
};

export default meta;
type Story = StoryObj<typeof FeatureFlowDescriptionColumn>;

// ----------------------------------------------------------------------

/** Fully interactive: hover/focus previews a row, click selects it. */
export const Default: Story = {
  render: () => <InteractiveDemo />,
};

/** No `title` — the `SectionTitle` doesn't render at all, only the row list. */
export const WithoutTitle: Story = {
  args: {
    items,
    selectedItemIndex: 0,
    activeItemIndex: 0,
    expandedItemId: null,
    onItemHover: () => {},
    onItemSelect: () => {},
    onLeave: () => {},
  },
  decorators: [
    (Story) => (
      <Box sx={{ maxWidth: 480 }}>
        <Story />
      </Box>
    ),
  ],
};
