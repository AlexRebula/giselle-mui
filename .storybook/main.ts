import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },

  // Serves each component's own `__fixtures__/images` folder as static assets
  // at build/dev time — established here for FeatureFlowSection's canonical
  // story (issue #171), which needs real image binaries rather than the
  // `/placeholder/*.svg` string paths other stories use. None of this is
  // bundled into the published package: only `dist/` ships (see
  // `package.json` `files`). Add further `{ from, to }` entries here as more
  // components grow their own real-content fixtures.
  staticDirs: [
    {
      from: '../src/components/section/feature-flow/__fixtures__/images',
      to: '/fixture-assets/feature-flow',
    },
  ],

  addons: ['@storybook/addon-vitest']
};

export default config;
