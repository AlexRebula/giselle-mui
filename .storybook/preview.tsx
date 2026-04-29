import type { Preview } from '@storybook/react';
import { CssVarsProvider, extendTheme } from '@mui/material/styles';

const theme = extendTheme({
  colorSchemes: { light: true, dark: true },
});

// Wraps every story in MUI CssVarsProvider so that --mui-palette-* CSS custom
// properties are injected into the DOM — required by giselle-mui components that
// reference theme.vars.palette.* or var(--mui-palette-...) directly.
const preview: Preview = {
  decorators: [
    (Story) => (
      <CssVarsProvider theme={theme}>
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
