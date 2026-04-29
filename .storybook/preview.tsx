import type { Preview } from '@storybook/react';
import { CssVarsProvider } from '@mui/material/styles';

// Wraps every story in MUI CssVarsProvider so that theme.vars.palette.* CSS
// variables are defined — required by all giselle-mui components.
const preview: Preview = {
  decorators: [
    (Story) => (
      <CssVarsProvider>
        <Story />
      </CssVarsProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
  },
};

export default preview;
