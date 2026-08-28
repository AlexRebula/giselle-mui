#!/usr/bin/env node
/**
 * check-structure.js
 *
 * Enforces the component folder structure convention: every component must live
 * in its own named subfolder inside its layer group. No .ts/.tsx files are
 * permitted directly under a layer or category folder.
 *
 *   ✅  src/components/material/surfaces/card/metric/metric-card.tsx
 *   ❌  src/components/material/surfaces/card/metric-card.tsx
 *   ❌  src/components/material/surfaces/metric-card.tsx
 *
 * This also recurses one level deeper, inside each component's own folder:
 * per `docs/components/cleanup-workflow.md` Scenario A, every internal
 * sub-component must live in its own named subfolder too — no sub-component
 * stays flat as a sibling `.tsx` file, regardless of size or complexity.
 *
 *   ✅  src/components/section/feature-flow/highlight-carousel/feature-flow-highlight-carousel.tsx
 *   ❌  src/components/section/feature-flow/feature-flow-highlight-carousel.tsx
 *
 * A component folder is allowed exactly one flat "primary" .tsx file (its own
 * composition file, e.g. `feature-flow-section.tsx` inside `feature-flow/`).
 * Any additional flat `.tsx` file in that folder (not itself further nested in
 * a subfolder) is a sub-component that must be moved into its own subfolder.
 *
 * KNOWN_VIOLATIONS below is a ratchet baseline: it lists every pre-existing
 * flat sub-component that predates this recursive check (discovered when the
 * check was introduced — see giselle-mui#161 and the follow-up giselle-mui#162
 * tracking their migration). Paths in the baseline are grandfathered so this
 * gate can start enforcing the rule for everything NEW without breaking the
 * build for legacy code nobody asked this session to restructure. As each
 * baseline component is migrated to its own subfolder, remove its entry here.
 * Never add a new component's flat sub-component to this list — the baseline
 * only shrinks.
 *
 * Exit codes: 0 = all OK, 1 = violations found.
 */

import { readdirSync, statSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Layer and category folders where component files must NOT sit flat.
// Every .ts/.tsx file found directly in one of these folders is a violation.
// The rule: every component lives in its own named subfolder at least one level deeper.
const PARENT_DIRS_TO_CHECK = [
  'components/chart',
  'components/material',
  'components/material/surfaces',
  'components/material/surfaces/card',
  'components/material/data-display',
  'components/material/data-display/icon',
  'components/material/layout',
  'components/material/navigation',
  'components/material/input',
  'components/motion',
  'components/motion/variants',
  'components/section',
  'components/section/faq',
  'components/section/hero',
  'components/section/timeline',
  'components/theming',
];

// Ratchet baseline — see the module doc comment above. Tracked by giselle-mui#162
// (and, separately, the FaqSection follow-up issue for src/components/section/faq/accordion/).
const KNOWN_VIOLATIONS = new Set([
  'src/components/material/surfaces/card/metric/metric-card-decoration.tsx',
  'src/components/material/surfaces/card/stat/stat-card-shape.tsx',
  'src/components/material/layout/section-title/section-caption.tsx',
  'src/components/material/navigation/floating-sub-nav/nav-pill.tsx',
  'src/components/material/navigation/floating-sub-nav/sub-nav-button.tsx',
  'src/components/section/faq/accordion/faq-accordion-svg.tsx',
  'src/components/section/faq/accordion/faq-bottom-lines.tsx',
  'src/components/section/faq/accordion/faq-motion-viewport.tsx',
  'src/components/section/faq/accordion/faq-top-lines.tsx',
  'src/components/section/hero/interactive-logo/artistic-logo-layer.tsx',
  'src/components/section/hero/interactive-logo/original-logo-layer.tsx',
  'src/components/section/hero/interactive-logo/portrait-layer.tsx',
  'src/components/section/hero/scroll-parallax/animated-hero-heading.tsx',
  'src/components/theming/settings-provider/settings-theme-bridge.tsx',
  'src/components/theming/settings-provider/theme-and-settings-provider.tsx',
]);

// Files that are legitimate at any layer level (not component files).
const ALLOWED_FLAT_FILES = new Set(['index.ts', 'index.tsx', 'types.ts']);
const isAllowedFlat = (filename) =>
  ALLOWED_FLAT_FILES.has(filename) ||
  filename.startsWith('use-') || // shared hooks
  filename.endsWith('.stories.tsx'); // group-level cross-component stories

/**
 * Scan a single directory for flat .ts/.tsx files that are not in the
 * top-level allowlist. Returns violation paths relative to srcDir.
 */
function findFlatFileViolations(srcDir, domain) {
  const domainDir = path.join(srcDir, domain);
  if (!existsSync(domainDir)) return [];

  const violations = [];
  for (const entry of readdirSync(domainDir)) {
    if (!entry.endsWith('.tsx') && !entry.endsWith('.ts')) continue;
    if (isAllowedFlat(entry)) continue;

    const fullPath = path.join(domainDir, entry);
    if (statSync(fullPath).isFile()) {
      violations.push(`src/${domain}/${entry}`);
    }
  }
  return violations;
}

/**
 * Given a stem (filename without extension) and the list of all filenames in
 * the same directory, count how many OTHER files are companions of that stem
 * (e.g. `<stem>.styles.ts`, `<stem>.const.ts`, `<stem>.test.ts`,
 * `<stem>.stories.tsx`). The component's primary composition file is the one
 * with the richest companion family — a bare sub-component dumped flat
 * typically has zero or one companion (at most its own test file).
 */
function countCompanions(stem, allFiles) {
  const prefix = `${stem}.`;
  return allFiles.filter((f) => f !== `${stem}.tsx` && f.startsWith(prefix)).length;
}

/**
 * Scan one component's own folder for sub-components sitting flat as sibling
 * .tsx files instead of in their own subfolder. A component folder is allowed
 * exactly one flat "primary" .tsx file (its own composition file, identified
 * as the stem with the most companion files — styles/const/test/stories);
 * every other flat .tsx file directly inside it is a sub-component violation.
 */
function findNestedSubComponentViolations(srcDir, domain) {
  const domainDir = path.join(srcDir, domain);
  if (!existsSync(domainDir)) return [];

  const violations = [];
  for (const entry of readdirSync(domainDir)) {
    const componentDir = path.join(domainDir, entry);
    if (!statSync(componentDir).isDirectory()) continue;

    const allFiles = readdirSync(componentDir);
    const flatTsxFiles = allFiles.filter((f) => {
      if (!f.endsWith('.tsx')) return false;
      if (f.endsWith('.stories.tsx') || f.endsWith('.defaults.tsx')) return false;
      return statSync(path.join(componentDir, f)).isFile();
    });

    if (flatTsxFiles.length <= 1) continue;

    // Rank candidates by companion-file count (descending); the richest
    // family is the primary component and stays flat. Ties break on stem
    // length (shorter = more likely to be the folder's own top-level name),
    // then alphabetically, for a deterministic result.
    const ranked = [...flatTsxFiles].sort((a, b) => {
      const stemA = a.replace(/\.tsx$/, '');
      const stemB = b.replace(/\.tsx$/, '');
      const companionDiff = countCompanions(stemB, allFiles) - countCompanions(stemA, allFiles);
      if (companionDiff !== 0) return companionDiff;
      if (stemA.length !== stemB.length) return stemA.length - stemB.length;
      return stemA.localeCompare(stemB);
    });

    for (const extra of ranked.slice(1)) {
      violations.push(`src/${domain}/${entry}/${extra}`);
    }
  }
  return violations;
}

/**
 * Run the full structure check against the given src directory.
 * Returns EVERY violation path found (empty array = fully passing), including
 * ones grandfathered by KNOWN_VIOLATIONS. Callers that want ratchet behaviour
 * (fail only on violations outside the baseline) should filter with
 * `isKnownViolation` themselves — this keeps the function itself a precise,
 * unfiltered structural check, which is what tests should exercise.
 */
export function findViolations(srcDir) {
  const violations = [];
  for (const domain of PARENT_DIRS_TO_CHECK) {
    violations.push(...findFlatFileViolations(srcDir, domain));
    violations.push(...findNestedSubComponentViolations(srcDir, domain));
  }
  return violations;
}

/** Whether a violation path is grandfathered by the KNOWN_VIOLATIONS ratchet baseline. */
export function isKnownViolation(violationPath) {
  return KNOWN_VIOLATIONS.has(violationPath);
}

function main() {
  const srcDir = path.resolve(__dirname, '../src');
  const allViolations = findViolations(srcDir);
  const newViolations = allViolations.filter((v) => !isKnownViolation(v));
  const resolvedBaselineEntries = [...KNOWN_VIOLATIONS].filter((v) => !allViolations.includes(v));

  if (resolvedBaselineEntries.length > 0) {
    console.log(
      '\nℹ️  These KNOWN_VIOLATIONS baseline entries in scripts/check-structure.js no longer\n' +
        '   exist — remove them from the baseline (and close/update the tracking issue):\n'
    );
    for (const v of resolvedBaselineEntries) {
      console.log(`   ${v}`);
    }
  }

  if (newViolations.length > 0) {
    console.error('\n❌  Structure check failed — flat component files found:\n');
    for (const v of newViolations) {
      console.error(`   ${v}`);
    }
    console.error(
      '\nEach component must live in its own named subfolder, and every internal\n' +
        'sub-component must live in its own named subfolder too:\n' +
        '   ✅  src/components/material/surfaces/card/<name>/<name>.tsx\n' +
        '   ❌  src/components/material/surfaces/card/<name>.tsx\n' +
        '   ✅  src/components/section/<name>/<sub-component>/<sub-component>.tsx\n' +
        '   ❌  src/components/section/<name>/<sub-component>.tsx\n' +
        '\nSee docs/components/cleanup-workflow.md Scenario A and File structure per\n' +
        'component in .github/copilot-instructions.md'
    );
    process.exit(1);
  } else {
    console.log(
      '✓ Structure check passed — no new flat component files' +
        (KNOWN_VIOLATIONS.size > 0
          ? ` (${KNOWN_VIOLATIONS.size} pre-existing violations grandfathered — see giselle-mui#162)`
          : '')
    );
    process.exit(0);
  }
}

// Only run the CLI when this file is executed directly (not when imported by tests).
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
