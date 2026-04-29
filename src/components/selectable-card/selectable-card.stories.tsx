import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { SelectableCard } from './selectable-card';

// ----------------------------------------------------------------------

const meta: Meta<typeof SelectableCard> = {
  component: SelectableCard,
  title: 'Components/SelectableCard',
};

export default meta;
type Story = StoryObj<typeof SelectableCard>;

// Named component so React hooks are valid inside it.
function ToggleDemo() {
  const [selected, setSelected] = useState(false);
  return (
    <SelectableCard
      selected={selected}
      onClick={() => setSelected((v) => !v)}
      sx={{ p: 3, width: 240 }}
    >
      <Typography fontWeight={600}>{selected ? 'Selected ✓' : 'Click to select'}</Typography>
      <Typography variant="body2" color="text.secondary">
        aria-pressed: {String(selected)}
      </Typography>
    </SelectableCard>
  );
}

function MultiSelectDemo() {
  const options = ['Starter', 'Pro', 'Enterprise'] as const;
  const [active, setActive] = useState<string>('Pro');
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {options.map((opt) => (
        <SelectableCard
          key={opt}
          selected={active === opt}
          onClick={() => setActive(opt)}
          sx={{ p: 2.5, width: 140 }}
        >
          <Typography fontWeight={600}>{opt}</Typography>
        </SelectableCard>
      ))}
    </Box>
  );
}

// ----------------------------------------------------------------------

/**
 * Click to toggle between selected and unselected.
 * Inspect the DOM panel to see `aria-pressed` toggle.
 */
export const Toggle: Story = {
  render: () => <ToggleDemo />,
};

/**
 * Multi-option single-select group — only one card selected at a time.
 */
export const MultiSelect: Story = {
  render: () => <MultiSelectDemo />,
};

/**
 * Disabled state — `ButtonBase` sets `aria-disabled`; pointer events suppressed.
 */
export const Disabled: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <SelectableCard disabled sx={{ p: 3, width: 200 }}>
        <Typography>Disabled (unselected)</Typography>
      </SelectableCard>
      <SelectableCard selected disabled sx={{ p: 3, width: 200 }}>
        <Typography>Disabled (selected)</Typography>
      </SelectableCard>
    </Box>
  ),
};
