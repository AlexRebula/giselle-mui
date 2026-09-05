#!/usr/bin/env node
/**
 * check-banned-content.js
 *
 * Scans docs/ and src/ for banned content that must not appear in this
 * public MIT-licensed repository.
 *
 * ESLint catches banned identifiers in *.ts and *.tsx files, but it does
 * not run on *.md and *.mdx files. This script fills that gap.
 *
 * Rules enforced — intentionally different per directory:
 *
 *   src/  — both checks:
 *     1. Banned identifier names (the ESLint `no-restricted-syntax` list).
 *        These proprietary identifiers must never appear in source, tests,
 *        stories, or component README files — not even as code examples.
 *     2. Private path/reference patterns (e.g. case-001).
 *
 *   docs/ — private refs only:
 *     1. Private path/reference patterns only.
 *        Migration guides, copyright analysis, and planning docs have a
 *        legitimate need to name the identifiers they document (e.g. to
 *        explain what `channelAlpha` replaces). Blocking those docs from
 *        being pushed prevents them from reaching code review, which defeats
 *        the purpose of having docs at all. Identifier names are therefore
 *        only enforced in src/ where they would appear as actual code usage.
 *
 * Exit codes: 0 = clean, 1 = violations found.
 *
 * Called by quality-gate.js as step "0a — Banned content scan".
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

/**
 * Load additional private-ref patterns from the gitignored local file, if
 * present. One pattern per line; blank lines and `#` comments are skipped.
 * IMPORTANT — never add an actual private repo name or internal-only
 * project identifier directly to BANNED_PRIVATE_REFS below: this script is
 * committed and public, anyone can read it. Real private repo names/paths
 * belong only here, in `.banned-patterns.local` (not committed).
 */
function loadLocalPatterns() {
  const localFile = path.join(ROOT, '.banned-patterns.local');
  if (!existsSync(localFile)) return [];
  return readFileSync(localFile, 'utf-8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));
}

/**
 * Load banned personal names from the gitignored
 * scripts/.banned-personal-refs.local.json, if present. Kept as a separate
 * file/mechanism from loadLocalPatterns per this org's documented
 * convention (canonical list lives in the private oss-quality-standards
 * extension repo; each public repo gets its own local copy here).
 */
function loadLocalPersonalRefs() {
  const localFile = path.join(ROOT, 'scripts', '.banned-personal-refs.local.json');
  if (!existsSync(localFile)) return [];
  try {
    const parsed = JSON.parse(readFileSync(localFile, 'utf-8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ── Banned patterns ────────────────────────────────────────────────────────

/**
 * Identifier names banned in src/ (code, tests, stories, component READMEs).
 * These proprietary identifiers must not appear in any source file.
 * Not applied to docs/ — see the module-level comment for rationale.
 */
const BANNED_IDENTIFIERS = [
  'varAlpha',
  'varFade',
  'varBlur',
  'varContainer',
  'customShadows',
  '_mock',
  'minimal-shared',
];

/**
 * Private path/reference patterns that must not appear in any public file
 * (docs/ or src/). Every utility in giselle-mui is an independent
 * implementation with no code copied from any commercial theme kit — this
 * list exists purely as an automated safeguard against accidental
 * copy-paste contamination during development, a governance control, not
 * a disclosure of any relationship with the vendors it happens to name.
 *
 * Commercial theme kit names themselves are intentionally NOT committed
 * here: naming a vendor's product verbatim in a public, indexed repo makes
 * this file the one place their own trademark/IP monitoring would reliably
 * find it, inviting exactly the scrutiny this check exists to avoid, even
 * though there is nothing to find. Those names load from the gitignored
 * `.banned-patterns.local` instead (see loadLocalPatterns) — same file real
 * private repo names/internal-only project identifiers already use. This
 * does mean CI does not enforce the vendor-name check (gitignored files
 * never reach a CI checkout); the identifier-level check above (the part
 * that actually matters — copied code patterns, not a vendor's name) stays
 * committed and CI-enforced regardless.
 */
const BANNED_PRIVATE_REFS = [...loadLocalPatterns(), ...loadLocalPersonalRefs()];

// ── Helpers ────────────────────────────────────────────────────────────────

// ── File targets ───────────────────────────────────────────────────────────

const SCAN_DIRS = ['docs', 'src'];

/** Only scan files with these extensions. */
const SCAN_EXTENSIONS = new Set(['.md', '.mdx', '.ts', '.tsx', '.js', '.mjs']);

// ── Allowlist ──────────────────────────────────────────────────────────────

/**
 * Files that are explicitly permitted to contain banned identifier names
 * because their purpose IS to document or enforce the rule (e.g. the script
 * that defines the list, the defects doc that explains the incident, or
 * historical PR message docs that record the old state).
 * Paths are relative to the repo root, using forward slashes.
 */
const ALLOWED_FILES = new Set([
  'scripts/check-banned-content.js',
  'docs/defects.md',
  // Historical PR message — records the planning state at the time of PR #7.
  // The names appear as "planned utilities"; they were later renamed.
  'docs/pr-messages/pr-07-theming-roadmap-docs/README.md',
]);

/**
 * If a line that contains a banned identifier also contains one of these
 * substrings, it is treated as a documentation/migration context line and
 * skipped. Examples:
 *   "no `varAlpha`"            → "no " triggers skip
 *   "`varAlpha` → `channelAlpha`" → " → " triggers skip
 *   "do not copy from `minimal-shared`" → "do not" triggers skip
 *   "`varAlpha` from `minimal-shared/utils` | `channelAlpha`" → " → " is absent
 *      but the pipe "|" in a migration table is also a common pattern.
 */
const NEGATION_CONTEXT = [
  ' → ',
  '→ `',
  'no `',
  'not `',
  'never `',
  'banned',
  'prohibited',
  'forbidden',
  'instead',
  // Use stems so conjugations are caught: "replacing"/"replaced" → 'replac'
  'replac',
  // "removal"/"removed"/"removing" → 'remov'
  'remov',
  'avoid',
  'do not',
  'must not',
  'should not',
  "don't",
  "doesn't",
  // "proprietary" appears in README files explicitly naming banned identifiers
  // in a "we do not use this" context.
  'propri',
];

/** Walk a directory recursively, yielding absolute file paths. */
function* walkDir(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkDir(fullPath);
    } else if (entry.isFile() && SCAN_EXTENSIONS.has(path.extname(entry.name))) {
      yield fullPath;
    }
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

const violations = [];

for (const scanDir of SCAN_DIRS) {
  const dirPath = path.join(ROOT, scanDir);
  let dirStat;
  try {
    dirStat = statSync(dirPath);
  } catch {
    continue; // directory doesn't exist — skip
  }
  if (!dirStat.isDirectory()) continue;

  // docs/ is only checked for private refs — not identifier names.
  // src/ is checked for both. See module-level comment for rationale.
  const checkIdentifiers = scanDir === 'src';

  for (const filePath of walkDir(dirPath)) {
    const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');

    // Skip files that are explicitly permitted to document the banned names.
    if (ALLOWED_FILES.has(rel)) continue;

    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;
      const lineLower = line.toLowerCase();

      if (checkIdentifiers) {
        for (const id of BANNED_IDENTIFIERS) {
          const regex = new RegExp(`(?<![\\w$])${id}(?![\\w$])`, 'g');
          if (!regex.test(line)) continue;

          // Skip lines that are clearly documenting the rule rather than violating it.
          const isNegationContext = NEGATION_CONTEXT.some((ctx) =>
            lineLower.includes(ctx.toLowerCase())
          );
          if (isNegationContext) continue;

          violations.push({
            file: rel,
            line: lineNum,
            text: line.trim(),
            rule: `banned-identifier:${id}`,
          });
        }
      }

      for (const ref of BANNED_PRIVATE_REFS) {
        if (!line.includes(ref)) continue;

        // Private refs are never exempt from negation context — a private ref is
        // a private ref regardless of how it is phrased. NEGATION_CONTEXT only
        // applies to identifier name checks above (checkIdentifiers block).

        violations.push({
          file: rel,
          line: lineNum,
          text: line.trim(),
          rule: `private-ref:${ref}`,
        });
      }
    }
  }
}

if (violations.length === 0) {
  console.log('✓ Banned content scan passed — no violations found');
  process.exit(0);
} else {
  console.error(`\n❌  Banned content scan — ${violations.length} violation(s) found:\n`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  [${v.rule}]`);
    console.error(`    ${v.text}\n`);
  }
  console.error(
    'Fix: remove or replace the flagged text before pushing.\n' +
      'See docs/defects.md § DEF-PROC-001 for the full rule and rationale.'
  );
  process.exit(1);
}
