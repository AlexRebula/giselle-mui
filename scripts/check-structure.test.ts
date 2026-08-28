// @vitest-environment node
import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

import { findViolations, isKnownViolation } from './check-structure.js';

// ----------------------------------------------------------------------

const tempDirs: string[] = [];

function makeFixtureSrcDir() {
  const dir = mkdtempSync(path.join(tmpdir(), 'check-structure-fixture-'));
  tempDirs.push(dir);
  return dir;
}

function writeFile(srcDir: string, relPath: string, contents = '') {
  const fullPath = path.join(srcDir, relPath);
  mkdirSync(path.dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, contents);
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe('findViolations — top-level flat component files', () => {
  it('flags a .tsx file sitting directly in a checked layer/category folder', () => {
    const srcDir = makeFixtureSrcDir();
    writeFile(srcDir, 'components/section/metric-card.tsx');

    const violations = findViolations(srcDir);

    expect(violations).toContain('src/components/section/metric-card.tsx');
  });

  it('does not flag a component that already lives in its own named subfolder', () => {
    const srcDir = makeFixtureSrcDir();
    writeFile(srcDir, 'components/section/metric-card/metric-card.tsx');

    const violations = findViolations(srcDir);

    expect(violations).toEqual([]);
  });

  it('does not flag index.ts, types.ts, hooks, or group-level stories at the layer level', () => {
    const srcDir = makeFixtureSrcDir();
    writeFile(srcDir, 'components/section/index.ts');
    writeFile(srcDir, 'components/section/types.ts');
    writeFile(srcDir, 'components/section/use-section-scroll.ts');
    writeFile(srcDir, 'components/section/overview.stories.tsx');

    const violations = findViolations(srcDir);

    expect(violations).toEqual([]);
  });
});

describe('findViolations — nested sub-components (recursive check)', () => {
  it('catches the exact FeatureFlowSection violation: sub-components sitting flat as siblings of the main component file', () => {
    const srcDir = makeFixtureSrcDir();
    const base = 'components/section/feature-flow';

    // The main component: a rich companion family (styles/const/test/stories/utils)
    // is what identifies it as the folder's primary composition file.
    writeFile(srcDir, `${base}/feature-flow-section.tsx`);
    writeFile(srcDir, `${base}/feature-flow-section.styles.ts`);
    writeFile(srcDir, `${base}/feature-flow-section.styles.test.ts`);
    writeFile(srcDir, `${base}/feature-flow-section.const.ts`);
    writeFile(srcDir, `${base}/feature-flow-section.test.ts`);
    writeFile(srcDir, `${base}/feature-flow-section.stories.tsx`);
    writeFile(srcDir, `${base}/types.ts`);
    writeFile(srcDir, `${base}/index.ts`);

    // Three sub-components sitting flat instead of in their own subfolder —
    // the exact shape of the real feature-flow / FaqSection violation.
    writeFile(srcDir, `${base}/feature-flow-highlight-carousel.tsx`);
    writeFile(srcDir, `${base}/feature-flow-highlight-carousel.test.ts`);
    writeFile(srcDir, `${base}/feature-flow-image-column.tsx`);
    writeFile(srcDir, `${base}/feature-flow-image-column.test.ts`);
    writeFile(srcDir, `${base}/feature-flow-item-detail.tsx`);
    writeFile(srcDir, `${base}/feature-flow-item-detail.test.ts`);

    const violations = findViolations(srcDir);

    expect(violations).toContain(`src/${base}/feature-flow-highlight-carousel.tsx`);
    expect(violations).toContain(`src/${base}/feature-flow-image-column.tsx`);
    expect(violations).toContain(`src/${base}/feature-flow-item-detail.tsx`);
    // The main component itself must never be flagged.
    expect(violations).not.toContain(`src/${base}/feature-flow-section.tsx`);
    expect(violations).toHaveLength(3);
  });

  it('does not flag a sub-component once it is moved into its own named subfolder', () => {
    const srcDir = makeFixtureSrcDir();
    const base = 'components/section/feature-flow';

    writeFile(srcDir, `${base}/feature-flow-section.tsx`);
    writeFile(srcDir, `${base}/feature-flow-section.styles.ts`);
    writeFile(srcDir, `${base}/feature-flow-section.test.ts`);
    // Fixed: sub-component now nested in its own subfolder.
    writeFile(srcDir, `${base}/highlight-carousel/feature-flow-highlight-carousel.tsx`);
    writeFile(srcDir, `${base}/highlight-carousel/feature-flow-highlight-carousel.test.ts`);
    writeFile(srcDir, `${base}/highlight-carousel/index.ts`);

    const violations = findViolations(srcDir);

    expect(violations).toEqual([]);
  });

  it('does not flag <name>.defaults.tsx or <name>.stories.tsx companion files as extra sub-components', () => {
    const srcDir = makeFixtureSrcDir();
    const base = 'components/material/data-display/icon-action-bar';

    writeFile(srcDir, `${base}/icon-action-bar.tsx`);
    writeFile(srcDir, `${base}/icon-action-bar.defaults.tsx`);
    writeFile(srcDir, `${base}/icon-action-bar.stories.tsx`);

    const violations = findViolations(srcDir);

    expect(violations).toEqual([]);
  });

  it('catches the FaqSection-shaped violation: several flat sub-components, none with a companion family', () => {
    const srcDir = makeFixtureSrcDir();
    const base = 'components/section/faq/accordion';

    writeFile(srcDir, `${base}/faq-accordion.tsx`);
    writeFile(srcDir, `${base}/faq-accordion.styles.ts`);
    writeFile(srcDir, `${base}/faq-accordion.const.ts`);
    writeFile(srcDir, `${base}/faq-accordion.test.ts`);
    writeFile(srcDir, `${base}/faq-accordion.stories.tsx`);
    writeFile(srcDir, `${base}/faq-top-lines.tsx`);
    writeFile(srcDir, `${base}/faq-bottom-lines.tsx`);
    writeFile(srcDir, `${base}/faq-motion-viewport.tsx`);
    writeFile(srcDir, `${base}/faq-accordion-svg.tsx`);

    const violations = findViolations(srcDir);

    expect(violations).toContain(`src/${base}/faq-top-lines.tsx`);
    expect(violations).toContain(`src/${base}/faq-bottom-lines.tsx`);
    expect(violations).toContain(`src/${base}/faq-motion-viewport.tsx`);
    expect(violations).toContain(`src/${base}/faq-accordion-svg.tsx`);
    expect(violations).not.toContain(`src/${base}/faq-accordion.tsx`);
  });
});

describe('isKnownViolation — ratchet baseline', () => {
  it('recognises a real pre-existing baseline entry', () => {
    expect(
      isKnownViolation('src/components/theming/settings-provider/settings-theme-bridge.tsx')
    ).toBe(true);
  });

  it('does not grandfather a path that was never in the baseline', () => {
    expect(isKnownViolation('src/components/section/feature-flow/made-up-file.tsx')).toBe(false);
  });
});
