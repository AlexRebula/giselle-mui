import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';

import { SelectableLabel } from './selectable-label';

// ----------------------------------------------------------------------

const meta: Meta<typeof SelectableLabel> = {
  component: SelectableLabel,
  title: 'Material/Data Display/Selectable Label',
};

export default meta;
type Story = StoryObj<typeof SelectableLabel>;

// Named component so React hooks are valid inside it.
function ToggleDemo() {
  const [selected, setSelected] = useState(false);
  return (
    <SelectableLabel
      label={selected ? 'Selected' : 'Click to select'}
      selected={selected}
      onSelectedChange={setSelected}
    />
  );
}

const PERSONAS = [
  'Software Engineering',
  'Teaching & Mentoring',
  'Running the practice',
  'Personal knowledge work',
];

function MultiSelectDemo() {
  const [active, setActive] = useState<string[]>(['Software Engineering']);
  const toggle = (persona: string, next: boolean) => {
    setActive((current) => (next ? [...current, persona] : current.filter((p) => p !== persona)));
  };
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {PERSONAS.map((persona) => (
        <SelectableLabel
          key={persona}
          label={persona}
          selected={active.includes(persona)}
          onSelectedChange={(next) => toggle(persona, next)}
        />
      ))}
    </Box>
  );
}

// ----------------------------------------------------------------------

/**
 * Click to toggle between selected and unselected.
 * Inspect the DOM panel to see `aria-pressed` toggle. Use the Storybook
 * toolbar's theme switcher to check both light and dark.
 */
export const Toggle: Story = {
  render: () => <ToggleDemo />,
};

/**
 * Multiple labels can be selected at once — the real use case (a persona
 * filter row where several personas can be active simultaneously, union
 * semantics).
 */
export const MultiSelect: Story = {
  render: () => <MultiSelectDemo />,
};

/**
 * Disabled state — `Chip` sets `Mui-disabled`; pointer events suppressed.
 */
export const Disabled: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <SelectableLabel label="Disabled (unselected)" selected={false} disabled />
      <SelectableLabel label="Disabled (selected)" selected disabled />
    </Box>
  ),
};
