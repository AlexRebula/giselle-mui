// ----------------------------------------------------------------------

/**
 * String paths into `__fixtures__/images`, served by Storybook's
 * `staticDirs` config (see `.storybook/main.ts`) at build/dev time. Never
 * bundled into the published package — only `dist/` ships (see
 * `package.json` `files`). Used only by the canonical Storybook fixture
 * (issue #171), not exported from the package barrel.
 */
const BASE = '/fixture-assets/feature-flow';

export const canonicalImagePaths = {
  /** Top-level section image + its two scroll-direction variants. */
  topLevel: {
    src: `${BASE}/alex-look-down-1.webp`,
    scrollDown: `${BASE}/alex-look-down-1.webp`,
    scrollUp: `${BASE}/alex-look-up.webp`,
  },
  /** Per-item hover-stack image (`imgUrl`) — cycles through 5 unique images across the 6 items. */
  stack: {
    performanceUi: `${BASE}/alex-pointing-left.webp`,
    techDebt: `${BASE}/alex-look-down-broom.webp`,
    pragmaticConsulting: `${BASE}/alex-look-left-thinking.webp`,
    trainingAndMentoring: `${BASE}/alex-look-left-teacher.webp`,
    codeQualityImprovements: `${BASE}/alex-look-down-left.webp`,
    // Reuses performanceUi's image — matches the real content's own cycling
    // behaviour (see the staged content notes), not a copy/paste mistake.
    bestPracticesAndDocumentation: `${BASE}/alex-pointing-left.webp`,
  },
  /** Highlight-card background images, grouped per item. */
  highlight: {
    performanceUi: [
      `${BASE}/high-performance-beautiful-ui-wcag-aa-at-seamlesscms.webp`,
      `${BASE}/high-performance-beautiful-ui-react-angular-vue-avanade.webp`,
      `${BASE}/high-performance-beautiful-ui-nextjs-react19-portfolio.webp`,
    ],
    techDebt: [
      `${BASE}/tech-debt-cleanup-real-world-experience.webp`,
      `${BASE}/tech-debt-cleanup-my-practical-approach.webp`,
      `${BASE}/tech-debt-cleanup-typescript-as-a-first-pass.webp`,
      `${BASE}/tech-debt-cleanup-testing-the-hard-paths-first.webp`,
      `${BASE}/tech-debt-cleanup-rules-that-outlast-the-cleanup.webp`,
    ],
    pragmaticConsulting: [
      `${BASE}/consulting-home-loan-calculator-bankfirst.webp`,
      `${BASE}/consulting-react-sitecore-cms-integration.webp`,
      `${BASE}/consulting-front-end-architecture-setup.webp`,
      `${BASE}/consulting-delivery-with-transparency-with-clients.webp`,
    ],
    trainingAndMentoring: [
      `${BASE}/training-and-mentoring-avanade-react-workshops.webp`,
      `${BASE}/training-and-mentoring-juniors-shipping-solo.webp`,
      `${BASE}/training-and-mentoring-typescript-adoption.webp`,
    ],
    codeQualityImprovements: [
      `${BASE}/code-quality-and-risk-mitigation-before-after-risk-mitigation-redux-race-condition-fix.webp`,
      `${BASE}/code-quality-and-risk-mitigation-code-reviewer-at-avanade.webp`,
      `${BASE}/code-quality-risk-under-control.webp`,
    ],
    bestPracticesAndDocumentation: [
      `${BASE}/open-source-component-work-giselle-mui.webp`,
      `${BASE}/open-source-component-work-giselle-ui.webp`,
      `${BASE}/open-source-component-work-giselle-sections-sdk.webp`,
      `${BASE}/open-source-component-work-quality-gate.webp`,
      `${BASE}/open-source-component-work-mit-licensed-from-scratch.webp`,
    ],
  },
} as const;
