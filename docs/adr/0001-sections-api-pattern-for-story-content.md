# ADR 0001: sections-api pattern for story content

## Status

Accepted — 29 Aug 2026

## Context

`FeatureFlowSection`'s canonical Storybook story (issue #171) originally shipped its real
content as literal string/object data hardcoded directly inside story-fixture files
(`__fixtures__/canonical-content.tsx`, `__fixtures__/technology-icons.ts`,
`__fixtures__/synthetic-edge-cases.ts`). Nothing in this repo's existing quality gate,
structure checks, or review workflow catches that: hardcoded content inside a fixture or a
`.stories.tsx` file passes every existing check.

A private consuming app in the org already solves this with a dedicated `sections-api/`
folder: a pure data layer of factory functions and types, consumed by presentation
components that never define their own content. The gap found in this PR is that
giselle-mui had no equivalent — content and presentation were mixed in the same file.

## Decision

giselle-mui adopts a local `sections-api`-style data layer for story/demo content,
mirroring the pattern already used in the org's private consuming app:

- `src/sections-api/<domain>/data.tsx` — factory functions (`createXData()`-style)
  returning content typed against the component's own existing prop types.
- `src/sections-api/<domain>/api.ts` — a barrel a story imports from, so the story never
  reaches into the data layer's internal files.
- `src/sections-api/README.md` — one repo-level README documenting the convention for
  every domain under this folder.

This is scoped to Storybook/demo purposes only. Nothing under `src/sections-api/` is
exported from the package barrel (`src/index.ts`) — the same non-published status as a
component's own `__fixtures__/` folder.

No schema validation library is introduced. Plain TypeScript types only, matching the
private app's own actual convention (zero validation-library usage there today).

## Future swap path

This local data layer has no dependency on `giselle-sections-sdk` — that package is real
but pre-1.0, untested, and unpublished, so importing from it now would be premature.
Instead, each domain's factory functions are shaped so their signatures and return types
already look like what an SDK-backed provider would eventually return: a plain,
synchronous function call that hands back a fully typed object. When `giselle-sections-sdk`
matures, swapping a domain over is a change to that domain's `data.tsx` only — no
consuming story changes.

## Open question (not resolved here)

Whether an eventual real backend for this pattern — if giselle-mui or the org's other
consuming apps ever need one, which is not currently planned — would be
Apollo/GraphQL+PostgreSQL or Supabase is an open question already tracked on the private
app's own roadmap. Resolving it is out of scope for this ADR.

## Consequences

- Story/demo content for `FeatureFlowSection` now lives in
  `src/sections-api/feature-flow/`, not inside `__fixtures__/` or the story file itself.
- New sections/components that need story content follow the same pattern rather than
  hardcoding data inline.
- The existing structure/quality-gate scripts do not need to change: `check-structure.js`
  only scans `src/components/*` domain folders, and `src/sections-api/` sits outside any
  tsup build entry, so it never reaches the published package.
