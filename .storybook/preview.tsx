import type { Preview } from '@storybook/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  colorSchemes: { light: true, dark: true },
});

// Wraps every story in MUI ThemeProvider so that theme.vars.palette.* CSS
// variables are defined — required by all giselle-mui components.
const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
  },
};

export default preview;
