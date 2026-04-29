# Local development guide

> _Last updated: Apr 2026_

This guide is for developers who work on `@alexrebula/giselle-mui` locally and want to
see their changes reflected immediately — either in Storybook or in a live Next.js (or
Vite/React) consumer project — without any manual build step in between.

---

## Overview

There are two development modes:

| Mode | Setup | HMR | Build needed? |
|---|---|---|---|
| **Storybook-only** | `npm run storybook` inside this repo | ✅ Yes | No |
| **Live consumer** | Consumer app runs against this repo's source via a junction/symlink | ✅ Yes | No |

Both modes work without a build step because Next.js `transpilePackages` (or Vite's config
equivalent) compiles this package's TypeScript source files directly with webpack/Vite —
the same pipeline used to compile the consumer's own source. No intermediate `.js` output
is ever read from `dist/`.

---

## Prerequisites

```
ar/
  giselle-mui/        ← this library (cloned here)
  rm/
    presentation/
      alexrebula/     ← consumer portfolio (or any Next.js app you use for testing)
```

The relative layout matters. `alexrebula/scripts/link-local-packages.js` resolves the
library at `../../../../giselle-mui` relative to the portfolio root. If you use a different
consumer project, adjust its link script accordingly.

---

## Mode 1 — Storybook-only (isolated component development)

This is the fastest workflow for building or changing a component in isolation.

```bash
cd giselle-mui
npm install
npm run storybook      # opens http://localhost:6006
```

Edit any file in `src/`. Storybook's HMR picks it up immediately.
Add a story to see the component without touching any consumer app.

**When to use this mode:**
- Building a new component from scratch
- Tweaking styles or props
- Running visual regression checks across variants
- Writing/running unit tests (`npm test`)

---

## Mode 2 — Live Next.js consumer (test in a real app)

This mode lets you edit files in `giselle-mui/src/` and immediately see changes in a
running Next.js dev server — exactly as if the library were part of the app's own source.

### One-time consumer setup

The consumer app must be configured with three things (all already done in `alexrebula`):

**1. `transpilePackages` in `next.config.ts`**

```ts
transpilePackages: ['@alexrebula/giselle-mui'],
```

This tells Next.js/webpack to compile the library's TypeScript source directly instead of
expecting pre-compiled JavaScript.

**2. A junction (or symlink) in `node_modules`**

```
consumer/node_modules/@alexrebula/giselle-mui  →  ar/giselle-mui/
```

Created automatically by `scripts/link-local-packages.js` (runs on `postinstall`).
The script also runs via `predev` and `prebuild` hooks — so it self-heals on every install
and before every dev/build start.

**3. The `fullySpecified: false` webpack rule**

```ts
// In consumer's next.config.ts webpack() function:
config.module.rules.push({
  test: /node_modules\/@alexrebula\/giselle-mui\/.*\.[jt]sx?$/,
  resolve: { fullySpecified: false },
});
```

This rule is **mandatory**. See [The ESM static analysis trap](#the-esm-static-analysis-trap)
below for why. Without it, any new component added via a barrel re-export will silently
fail at runtime with `Element type is invalid: ... got: undefined`.

### Day-to-day usage

```bash
# Terminal A — library (optional — only needed if you also want Storybook live)
cd giselle-mui
npm run storybook

# Terminal B — consumer app
cd alexrebula
npm run dev
```

Edit any file in `giselle-mui/src/`. The Next.js dev server's HMR detects the change and
hot-reloads the affected modules. No terminal B restart needed.

---

## What triggers HMR vs. a dev server restart

| Change | What happens |
|---|---|
| Edit an existing component's `.tsx` file | HMR — instant, no restart |
| Edit an existing utility in `src/utils/` | HMR — instant, no restart |
| Add a new export to `src/index.ts` | Save the consumer file that imports it (usually triggers recompile), or restart once |
| Add a new `.tsx` file that's already exported via barrel | HMR usually works; restart if webpack didn't pick it up |
| Change `package.json` in giselle-mui | Restart the consumer dev server |
| Change `tsconfig.json` in giselle-mui | Restart the consumer dev server |

**Rule of thumb:** editing source files = hot reload. Changing module graph metadata (package.json, tsconfig, new barrel exports) = restart once.

---

## What you do NOT need to build

The `dist/` folder in this repo is for **published npm consumers** — it is not read by
a locally linked consumer app. When `transpilePackages` is configured, webpack bypasses
`dist/` entirely and compiles `src/index.ts` directly.

This means:
- `npm run build` in giselle-mui does **not** need to be run during local development
- `dist/` can be stale or absent — it has no effect on local dev
- The only time you need `npm run build` is before publishing a new version to npm

---

## Adding a new component — checklist

When you add a new component to giselle-mui and want it available in the consumer app,
follow this order:

1. Create the component files in `src/components/<name>/`
2. Add the export to `src/components/<name>/index.ts`
3. **Add the re-export to `src/index.ts`**
4. Save any file in the consumer app that imports from `@alexrebula/giselle-mui` — this
   signals webpack to re-evaluate the barrel
5. If the component still shows as `undefined` in the consumer: restart the dev server once

**That's all.** No build. No `npm link`. No reinstall.

---

## The ESM static analysis trap

This is the error that blocked development for several hours. It is documented here in
full so it never happens again.

### What happened

After adding `TimelineTwoColumn` to `giselle-mui`, the alexrebula dev server showed:

```
Element type is invalid: expected a string (for built-in components) or a class/function
(for composite components) but got: undefined.
```

The webpack compilation log revealed the real error:

```
Attempted import error: 'TimelineTwoColumn' is not exported from '@alexrebula/giselle-mui'
```

At runtime, React received `undefined` where a component function was expected and crashed.

### Why it happened

Three factors combined:

**Factor 1 — `"type": "module"` in giselle-mui's `package.json`**

This field marks every `.js` file in the package as an ES Module. When webpack 5 loads
an ESM package, it enables **strict ESM mode** for that package, which includes two
behaviours:

- `fullySpecified: true` — all import paths must have explicit file extensions (ESM spec)
- **Static export validation** — webpack validates that named exports exist by tracing the
  module graph statically BEFORE transpilation begins

**Factor 2 — Extension-less imports in barrel files**

`timeline-two-column/index.ts` re-exports:

```ts
export { TimelineTwoColumn } from './timeline-two-column';  // ← no extension
```

In strict ESM mode, webpack tries to resolve `./timeline-two-column` literally. ESM spec
says extensions are required, so webpack cannot know this means `./timeline-two-column.tsx`.
The static export validation fails → webpack marks `TimelineTwoColumn` as "not exported"
from the package.

**Factor 3 — The error is silent at compile time**

TypeScript compiles fine. The dev server starts. The error only appears at runtime when
React tries to render the component — by which point the bundle is already built and the
component has already been replaced with `undefined`.

### Why the rule `"type":"module"` exists in this package

`tsup.config.ts` uses top-level `import` statements and ES module syntax — this requires
the file itself to be treated as an ESM file. Removing `"type":"module"` would break the
build tooling.

### Prevention rule 1 — The `fullySpecified: false` webpack rule in consumers

Every Next.js (or webpack-based) consumer of this library **must** add this rule to its
webpack config:

```ts
config.module.rules.push({
  test: /node_modules\/@alexrebula\/giselle-mui\/.*\.[jt]sx?$/,
  resolve: { fullySpecified: false },
});
```

This opts all giselle-mui source files out of strict ESM mode, allowing webpack to resolve
extension-less imports the same way it does for CommonJS packages. It is a targeted,
minimal rule — it affects nothing outside giselle-mui.

This rule is already present in `alexrebula/next.config.ts`. If you create a new consumer
project, add it before writing a single import.

### Prevention rule 2 — Use `.js` extensions in barrel files (alternative)

An alternative to the consumer-side webpack rule: always use explicit `.js` extensions in
barrel re-exports inside this library:

```ts
// timeline-two-column/index.ts
export { TimelineTwoColumn } from './timeline-two-column.js';
```

Webpack with `transpilePackages` resolves `.js` → `.tsx` via `resolve.extensions`, so this
works. However it makes the source files less ergonomic and every barrel export must be
maintained with extensions. The `fullySpecified: false` consumer rule is the cleaner
long-term approach.

### Prevention rule 3 — Do not add `"type":"module"` to new public packages

If you are starting a new MIT-licensed library from scratch, avoid `"type":"module"` unless
you have a strong reason. Most webpack consumers expect CJS-compatible packages. Use
`"type":"module"` only if your build tooling requires it (as tsup does here), and document
the consumer webpack rule requirement prominently.

---

## Alternative library development workflows

Understanding the alternatives clarifies why the junction + transpilePackages approach was
chosen here, and what its trade-offs are. Each approach is summarised below.

---

### Approach A — transpilePackages + junction (current, recommended for this project)

**How it works:**
Consumer's Next.js/webpack compiles the library's TypeScript source directly. A filesystem
junction makes the library appear inside `node_modules`. `transpilePackages` ensures webpack
includes the source in its compilation.

**Pros:**
- No build step — edit a file in giselle-mui, see it live in the consumer instantly
- No separate watcher process
- Full HMR — changes propagate in seconds
- TypeScript errors in the library surface in the consumer's terminal immediately

**Cons:**
- Consumer must be configured correctly (fullySpecified rule, resolve.symlinks, dedup aliases)
- Only works with webpack (Turbopack requires files to be inside the project root)
- Configuration is non-trivial — this entire document exists because of it

**Best for:** A single consumer app + library pair where deep integration and rapid
iteration are more important than strict independence.

---

### Approach B — `npm link` + `tsup --watch`

**How it works:**
```bash
# Terminal A
cd giselle-mui
npm run build -- --watch   # tsup in watch mode, rebuilds dist/ on change

# Terminal B
cd consumer-app
npm link ../path/to/giselle-mui   # or: npm install file:../giselle-mui
npm run dev
```

The consumer imports from `dist/`, not `src/`. tsup rebuilds on every save.
Consumer HMR detects the new `dist/` file and hot-reloads.

**Pros:**
- Consumer needs zero special webpack configuration
- Works with Turbopack, Vite, Parcel — any bundler
- Clean separation: consumer always runs against compiled output
- Exactly replicates what published npm consumers will experience

**Cons:**
- Requires two running processes (watch + dev server)
- The watch → rebuild → HMR chain adds ~1–3 seconds of latency per change
- `npm install` in the consumer destroys `npm link` entries — must re-link after every install
- TypeScript errors in the library are only visible in terminal A, not in the consumer

**Best for:** When you want zero consumer configuration complexity, or when the consumer
uses a bundler other than webpack.

---

### Approach C — npm workspaces / pnpm workspaces monorepo

**How it works:**
Both library and consumer live in the same git repository, declared as workspaces:

```json
// root package.json
{
  "workspaces": ["packages/giselle-mui", "apps/my-next-app"]
}
```

`npm install` (or `pnpm install`) automatically creates the symlink in `node_modules`.
The `transpilePackages` configuration is still needed in Next.js.

**Pros:**
- No manual link scripts — workspaces handle linking automatically
- Works consistently on macOS, Linux, Windows (pnpm > npm for Windows reliability)
- One `git` repo, unified CI
- Industry standard for multi-package projects (Turborepo, Nx)

**Cons:**
- Requires restructuring both repos into a single monorepo — a significant migration
- Turbopack's sandbox restriction applies here too (files outside Next.js app root)
- pnpm workspaces are simpler and more reliable than npm workspaces on Windows

**Best for:** When the library and consumer are developed by the same team in the same git
repo (the production-standard setup for companies). This is the long-term direction for
this project if giselle-mui and alexrebula are ever merged into one repo.

---

### Approach D — Publish to npm + normal `npm install`

**How it works:**
Publish a new version of giselle-mui to npm registry. Consumer installs it:

```bash
# in consumer
npm install @alexrebula/giselle-mui@latest
```

**Pros:**
- Zero local setup complexity — no junctions, no link scripts, no special webpack config
- Works with any bundler
- Exact same experience as any other npm consumer
- Turbopack can be used in the consumer

**Cons:**
- Every library change requires a version bump + `npm publish` before the consumer can test it
- Slow iteration loop for rapid development
- Breaking changes in library source are not immediately visible in consumer TypeScript

**Best for:** After a component is stable and ready for release. This is the exit strategy
for the junction approach — once giselle-mui reaches a stable v1, publishing to npm removes
all the local linking complexity permanently.

---

### Approach E — Storybook-only, no consumer integration during development

**How it works:**
All component development happens in Storybook. No consumer project is involved.
The component is integrated into the consumer only when it is finished and merged to `main`.

**Pros:**
- Simplest possible workflow — no cross-repo configuration at all
- Storybook provides a better development environment for isolated components
- Forces good design: components must be usable without a specific app context
- No ESM/webpack/junction issues

**Cons:**
- Cannot test how the component looks in the actual application context during development
- Integration bugs are only discovered after the component is "done"

**Best for:** Most new component development in this project. Build in Storybook first,
integrate into the consumer as a final step.

---

## Day-to-day command reference

### giselle-mui (library)

```bash
npm run storybook        # Start Storybook dev server at http://localhost:6006
npm test                 # Run Vitest unit tests
npm run check            # Auto-fix Prettier + ESLint, then run all verifications
npm run check:verify     # Verify only (Prettier + ESLint + tsc + Vitest + tsup + Storybook build)
npm run build            # Build dist/ for npm publishing (not needed for local dev)
```

### Consumer (alexrebula)

```bash
npm run dev              # Start Next.js dev server at http://localhost:8082
                         # predev hook auto-heals the giselle-mui junction first
npm run build            # Production build (webpack, not Turbopack)
npm run check:verify     # Run all quality checks (no dev server — static analysis only)
```

---

## Interview summary: how local library development works

When asked "how did you develop giselle-mui locally while using it in your portfolio?", here
is the concise, accurate answer:

> I set up a junction-based local linking approach. A Windows junction (equivalent to a Unix
> symlink for directories) makes the library appear inside the portfolio's `node_modules` —
> so it looks like an installed npm package but actually points to the live source folder.
> Next.js `transpilePackages` tells webpack to compile the library's TypeScript source
> directly as part of the app's own build, which gives full HMR without any intermediate
> build step. The only non-obvious configuration required was disabling webpack 5's strict
> ESM static export analysis (`fullySpecified: false`) for the library's files — a consequence
> of the library having `"type":"module"` in its `package.json`.
>
> The alternatives I considered were: `npm link + tsup --watch` (simpler consumer config but
> adds build latency and link entries are destroyed by `npm install`), pnpm workspaces
> monorepo (the production standard but requires merging two repos), and Storybook-only
> development (which I use as the primary workflow for new components). The junction approach
> is the pragmatic middle ground for two separate git repos under active co-development.

---

## See also

- [Theming guide](./theming/README.md) — wiring MUI v7 CSS variables mode in consumers
- `alexrebula/docs/local-package-linking.md` — full history of the linking approach, all
  failed attempts, Vercel deployment setup, and troubleshooting section
