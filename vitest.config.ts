import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.ts', 'src/**/*.stories.tsx', 'src/**/index.ts'],
      reporter: ['text', 'lcov'],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
        },
      },
      {
        extends: true,
        // Forces Vite to pre-bundle these into a stable ESM shape ahead of
        // time. Without this, Vite's dependency optimizer discovers them
        // lazily mid-run inside the real browser, triggers a hot-reload of
        // the already-running test file, and that reload can land while the
        // CJS→ESM interop shim for a nested dependency (aria-query, pulled
        // in transitively by @testing-library/dom) hasn't been generated yet
        // — surfacing as a "does not provide an export named 'elementRoles'"
        // import error. Known upstream issue:
        // https://github.com/storybookjs/storybook/issues/33067
        optimizeDeps: {
          include: ['aria-query', '@testing-library/dom', '@testing-library/jest-dom'],
        },
        plugins: [
          // Only stories explicitly tagged 'visual-regression' run here — see
          // giselle-mui#196. addon-vitest's own default is to run every story
          // as a test, which would turn this real-browser project (slower,
          // needs Playwright, a much bigger footprint) into a blanket new
          // requirement for every component in the library. #196 was
          // deliberately scoped to one canonical case, not a new tier — this
          // include filter is what keeps it that narrow. Add the tag to a
          // story only when it specifically needs real-browser paint-order
          // verification that jsdom cannot provide (see docs/testing.md).
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
            tags: { include: ['visual-regression'] },
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
});
