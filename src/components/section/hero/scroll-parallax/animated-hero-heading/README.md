# AnimatedHeroHeading

An animated `<h1>` with a cycling gradient highlight span, built for the `heading` slot of `ScrollParallaxHero`.

## Why it exists

A hero heading with a "colour wash" accent word requires coordinating two independent animations:

1. **Fade-in on mount** — the whole heading enters via `motionProps` (a `variants` object so it
   can participate in a parent `MotionContainer`/`MotionViewport` stagger sequence).
2. **Infinite gradient cycle** — the `highlight` word's `backgroundPosition` animates on an
   infinite 20-second loop, independent of the mount animation and never resetting.

Getting the gradient-clip trick right (`backgroundClip: 'text'` plus the `-webkit-` prefix and
`WebkitTextFillColor: 'transparent'` for Safari) is easy to get subtly wrong; `AnimatedHeroHeading`
encapsulates it so every hero heading in the library looks and behaves identically.

## Why it belongs here

`AnimatedHeroHeading` is a sub-component of `ScrollParallaxHero` — it is designed to be passed as
its `heading` slot and shares that component's `fade()` stagger orchestration. It is independently
barrel-exported (from `@littlebranches/giselle-mui/motion`) because it has meaningfully independent
behaviour a developer would plausibly want to evaluate on its own: the cycling gradient animation,
a `motionProps` override point, and an `sx` override point with a documented custom-font example.

## Design decisions

### `ref` and passthrough target: the `<h1>` Box, not the outer `motion.div`

The root JSX is a `motion.div` wrapping a `Box component="h1"`. The outer `motion.div` exists
purely to carry `motionProps` (the fade-in `variants`) — it reads no other prop from outside and a
consumer has no reason to ever hold a reference to it. `ref` and `...other` are forwarded to the
inner `<h1>` Box instead, because that is the semantically meaningful DOM node: it is what a
consumer means by "the heading", it is what every other `Box`-wrapping component in this library
exposes a ref to, and it is the node an `aria-*` or `id` passthrough prop should land on.

### Gradient text via `backgroundClip`

The highlight span uses `theme.vars.palette.primary.main` and `theme.vars.palette.warning.main`
five-stop gradient, clipped to the text shape. `WebkitTextFillColor: 'transparent'` is required in
addition to `backgroundClip: 'text'` for the gradient to render on Safari — omitting it renders
solid black text with the gradient invisible behind it.

### `fontFamily` is not baked in

`headingH1Sx` intentionally does not set `fontFamily`. Override via `sx` to apply any custom
typeface from the active theme:

```tsx
<AnimatedHeroHeading
  subheading="The work of"
  highlight="Platform Team"
  sx={(theme) => ({ fontFamily: theme.typography.fontSecondaryFamily })}
/>
```

## File structure

```
animated-hero-heading/
  animated-hero-heading.tsx            — component (motion.div wrapper + h1 Box + gradient span)
  animated-hero-heading.animations.ts  — headingMotionProps, gradientHighlightAnimate, gradientHighlightTransition
  animated-hero-heading.styles.ts      — headingH1Sx, headingHighlightSx
  animated-hero-heading.styles.test.ts — mock-theme assertions for both factories
  animated-hero-heading.test.ts        — Vitest unit tests (render, forwardRef, passthrough)
  animated-hero-heading.stories.tsx    — Storybook: Default, CustomFont, NoMotion, Responsive
  types.ts                             — AnimatedHeroHeadingProps
  index.ts                             — barrel export
  README.md                            — this file
```

## Library safety

- **No hardcoded content.** `subheading` and `highlight` are always consumer-provided.
- **No personal data.** Stories, tests, and JSDoc examples use generic placeholders only
  (`highlight="Platform Team"`, `subheading="The work of"`).
- **Only allowed dependencies.** `framer-motion` and `@mui/material` — both declared as peer
  dependencies and marked external in `tsup.config.ts`.

## Quality status

**01 Sep 2026** — nested into its own subfolder per the Scenario A sub-component policy
(giselle-mui#162), given the "standalone-adjacent" treatment (own README, stories, API-surface
pass) because it is independently barrel-exported.

- `npm run check:verify` ✅
- Vitest unit tests: render, forwardRef, `...other` passthrough ✅
- `*.styles.test.ts` covers every exported sx factory ✅
- Storybook: Default, CustomFont, NoMotion, Responsive ✅

## Related

- [`../README.md`](../README.md) — `ScrollParallaxHero`, the parent hero section this heading is designed for
- [`../../../motion/variants/fade/`](../../../motion/variants/fade/) — `fade()` factory used by the default `motionProps`
