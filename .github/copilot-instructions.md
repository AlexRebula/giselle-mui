# @alexrebula/giselle-mui — Copilot Instructions

This is an open-source React component library built on top of `@mui/material` v7.
It is authored by Alex Rebula and licensed MIT.

## What this library is

A set of small, focused MUI wrapper components that encode non-obvious design and
accessibility decisions so consumers don't have to rediscover them. Every component
in this library exists because it solves a recurring problem that is either:

- easy to get wrong (e.g. `Paper onClick` vs `ButtonBase` for keyboard accessibility), or
- non-trivial to implement correctly with MUI alone (e.g. icon baseline gaps, CSS-var color tinting)

## Stack

- React 18+ with TypeScript — strict mode, no `any`
- `@mui/material` v7 (CSS variables mode — `theme.vars.palette.*` not `theme.palette.*`)
- `@iconify/react` for icons (Apache 2.0 — the only allowed icon peer dependency)
- Vitest + jsdom for unit tests
- Storybook for visual development and autodoc

## Component rules (non-negotiable)

1. **Zero proprietary dependencies.** Only `react`, `react-dom`, `@mui/material`,
   `@emotion/react`, `@emotion/styled`, and `@iconify/react` are allowed as
   peer/direct dependencies.

2. **`sx` array spread on root element.** Always:
   `sx={[baseStyles, ...(Array.isArray(sx) ? sx : [sx])]}`.

3. **`...other` spread on root element.** Enables `data-*`, `aria-*`, `id`,
   `className` without prop drilling.

4. **Only own props get JSDoc.** Never redeclare or document props inherited from
   MUI interfaces. TypeScript inheritance carries MUI's own descriptions into
   Storybook autodoc automatically.

5. **ReactNode slots for icons and decoration.** Components never import an icon
   library internally. Accept `icon?: ReactNode` and let the consumer fill it.

6. **`color` prop follows MUI palette key convention.**
   `'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'`
   with `@default 'primary'`.

7. **Decorative elements carry `aria-hidden`.** Quote marks, separator dots,
   background shapes.

8. **No hardcoded hex or rgba literals.** Use `theme.vars.palette[color].mainChannel`
   for tints.

## File structure per component

```
src/components/<name>/
  <name>.tsx     — component + exported Props interface
  index.ts       — barrel: re-exports component and types
  README.md      — why it exists, why it belongs here, design decisions, library safety
  <name>.test.ts — Vitest unit tests
```

## Test conventions

- File extension must be `.test.ts` (not `.tsx`) — vitest config uses `include: ['src/**/*.test.ts']`
- Add `// @vitest-environment jsdom` at top of every test file
- Use `React.createElement` (not JSX) — avoids JSX transform requirement in `.ts` files
- Use `renderToStaticMarkup` for structure/ARIA tests
- Use `ReactDOM.createRoot` + `act` for interaction/click tests
- Mock all MUI components that have `theme.vars` in sx callbacks (MUI v7 CSS vars
  require `CssVarsProvider` which is not available in tests without the full theme setup)

## What Copilot should help build

- New components following all rules above
- Unit tests using the established Vitest patterns
- Storybook Stories with `argTypes: { control: false }` for `ReactNode` and `SxProps` slots
- README files: Why it exists → Why it belongs here → Design decisions → Library safety → File structure → Related
- Barrel index updates when new components are added

When asked to add a component, always verify: does this encode a non-obvious decision
that saves every consumer from rediscovering it? If not, it should not be in this library.
