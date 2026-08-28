# sections-api

This folder is the pure data layer for giselle-mui's Storybook/demo content. It contains
only factory functions, types, and utilities — no presentation logic, no fetching, no
runtime schema validation. All content is defined here as typed objects and consumed by
stories. When this eventually becomes a real API-backed layer (see `giselle-sections-sdk`,
currently pre-1.0), the stories that consume it change nothing — only the factory
internals change.

This mirrors a pattern already established in a private consuming app's own codebase,
where a `sections-api/`-style folder is the single source of truth for section content,
consumed by presentation components that never hardcode their own data. See
`docs/adr/0001-sections-api-pattern-for-story-content.md` for the decision record.

## Scope

**Storybook/demo purposes only.** Nothing in this folder is exported from the package
barrel (`src/index.ts`) — same non-published status as a component's own `__fixtures__/`
folder. It exists so story content has a home that isn't hardcoded directly inside a
component or a `.stories.tsx` file.

## Structure

One folder per section/domain, named after the component it feeds:

```
src/sections-api/
  README.md                    — this file, covers the whole pattern
  <domain>/
    data.tsx                   — factory functions (`createXData()`-style); `.tsx` only
                                  where a field's content is itself JSX (e.g. a rich-text
                                  paragraph or a card), never JSX-as-presentation-logic
    api.ts                     — barrel: re-exports only the factory functions (and any
                                  domain-local types actually needed by a consumer);
                                  never re-exports raw data or internal helpers
    types.ts                   — only when a domain needs a type that doesn't already
                                  exist on the component itself; reuse the component's own
                                  prop types wherever they already cover the shape
    <helper>.ts                — optional internal-only modules `data.tsx` imports from
                                  (e.g. a path table, an icon lookup map) when splitting
                                  them out of `data.tsx` keeps it more readable; these are
                                  implementation details and are never re-exported from
                                  `api.ts`
```

A consumer (a story file) imports only from a domain's `api.ts` — never reaching into
`data.tsx`, a helper module, or any other internal file directly. `api.ts` only ever
exposes factory functions, never the raw data or helpers those factories are built from —
that boundary is what keeps a future swap to an SDK-backed provider a change to a
domain's internals only.

## Rules

- **Types first, reuse before inventing.** Return data typed against the component's own
  existing prop types (e.g. `FeatureFlowItem`, `FeatureFlowSectionProps`) wherever those
  already exist. Only add a new type in a domain's own `types.ts` for a shape that
  genuinely has nowhere else to live.
- **No zod, no runtime schema validation.** Plain TypeScript types only — matching the
  actual convention in the private app this pattern is modelled on.
- **No dependency on `giselle-sections-sdk`.** That package is real but pre-1.0,
  untested, and unpublished. Factory functions are written as plain, synchronous
  functions today, but their signatures and return shapes are deliberately shaped to
  match what an SDK-backed provider would eventually return — so swapping a domain over
  later is a change to that domain's `data.tsx` only, not to any consuming story.
- **JSX is content, never logic.** A factory may return JSX when the field itself is rich
  content (a paragraph, a quote card) — it may never contain conditional rendering,
  layout decisions, or anything a presentation component should own instead.
