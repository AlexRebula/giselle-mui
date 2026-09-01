import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { GiselleThemeAndSettingsProvider } from './theme-and-settings-provider';
import { useGiselleSettings } from '../settings-context';
import type { GiselleThemeAndSettingsProviderProps } from './types';

// ----------------------------------------------------------------------

type DemoSettings = { version: '1'; mode: 'light' | 'dark' | 'system'; largeText: boolean };

const DEFAULT_SETTINGS: DemoSettings = { version: '1', mode: 'light', largeText: false };

/** Reads settings state via context and renders controls to change it. */
function SettingsDemo() {
  const { state, setField } = useGiselleSettings<DemoSettings>();

  return (
    <Stack spacing={2} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, maxWidth: 360 }}>
      <Typography variant="h6" color="text.primary">
        Settings-driven theme
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Toggling color mode below calls <code>setField(&apos;mode&apos;, …)</code> — the MUI color
        scheme updates automatically via <code>getMode</code>, with no manual{' '}
        <code>useColorScheme</code> wiring.
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button
          variant={state.mode === 'light' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setField('mode', 'light')}
        >
          Light
        </Button>
        <Button
          variant={state.mode === 'dark' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setField('mode', 'dark')}
        >
          Dark
        </Button>
        <Button
          variant={state.mode === 'system' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setField('mode', 'system')}
        >
          System
        </Button>
      </Stack>
      <FormControlLabel
        control={
          <Switch
            checked={state.largeText}
            onChange={(event) => setField('largeText', event.target.checked)}
          />
        }
        label="Large text (persisted, not theme-linked)"
      />
    </Stack>
  );
}

// ----------------------------------------------------------------------

const meta: Meta<GiselleThemeAndSettingsProviderProps<DemoSettings>> = {
  title: 'Theming/Giselle Theme And Settings Provider',
  component: GiselleThemeAndSettingsProvider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Composes `GiselleThemeProvider` and `GiselleSettingsProvider` in one element, with an optional `getMode` bridge that syncs settings state to the MUI color scheme.',
      },
    },
  },
  argTypes: {
    children: { control: false },
    defaultSettings: { control: false },
    getMode: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ----------------------------------------------------------------------

/** Wraps `SettingsDemo` with a reset button that remounts the whole provider tree, clearing localStorage-persisted state between story views. */
function ResettableDemo({ getMode }: { getMode?: (state: DemoSettings) => DemoSettings['mode'] }) {
  const [key, setKey] = useState(0);
  return (
    <GiselleThemeAndSettingsProvider key={key} defaultSettings={DEFAULT_SETTINGS} getMode={getMode}>
      <SettingsDemo />
      <Button size="small" sx={{ mt: 1 }} onClick={() => setKey((k) => k + 1)}>
        Reset demo
      </Button>
    </GiselleThemeAndSettingsProvider>
  );
}

/**
 * Without `getMode`: settings persist, but the color mode field has no effect
 * on the MUI theme — this component behaves exactly like composing
 * `GiselleThemeProvider` and `GiselleSettingsProvider` side by side.
 */
export const WithoutSync: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'No `getMode` provided — the settings `mode` field is stored but never reaches the MUI color scheme.',
      },
    },
  },
  render: () => <ResettableDemo />,
};

/**
 * With `getMode`: toggling the settings mode field drives the actual MUI
 * color scheme, live, with no manual `useColorScheme` call anywhere in the demo.
 */
export const WithColorSchemeSync: Story = {
  parameters: {
    docs: {
      description: {
        story: '`getMode={(s) => s.mode}` — the color-mode buttons below drive the real theme.',
      },
    },
  },
  render: () => <ResettableDemo getMode={(s) => s.mode} />,
};
