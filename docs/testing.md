---
sidebar_position: 6
sidebar_label: 'Testing'
---

# Testing

Two Vitest projects run in this repo (`vitest.config.ts`), each with a different job:

| Project | Environment | Run with | Covers |
| --- | --- | --- | --- |
| `unit` | jsdom | `npm test` | Component logic, sx-factory output, hooks, scripts |
| `storybook` | Real Chromium (Playwright, via `@vitest/browser-playwright`) | `npm run test:visual` | Real-browser paint order — only what jsdom cannot answer |

## When you need the `storybook` project

jsdom does not run real CSS layout or paint. It can assert *inputs* to paint order — an
ancestor's computed `transform`, an element's `zIndex` value, DOM nesting order — but it
cannot tell you what actually ends up on screen. Reach for a real-browser test only when a
component has genuinely overlapping, stacking-sensitive elements (sticky/fixed/absolute
positioning combined with `z-index` or a transform-bearing ancestor) **and** you've confirmed
the overlap is actually reachable — see the FeatureFlowSection investigation below before
assuming it is.

For everything else — including most stacking-context bugs — a jsdom test asserting the
relevant CSS properties and DOM order (see `feature-flow-section.transition.test.ts` for the
pattern: render with real framer-motion, walk the rendered ancestor chain, assert no stray
`transform`/`zIndex` sneaks in) is cheaper, faster, and sufficient.

## Writing a real-browser story test

1. Add a story tagged `visual-regression`:

   ```tsx
   export const MyStackingCase: Story = {
     tags: ['visual-regression'],
     render: () => <MyComponent {...propsThatForceTheOverlap} />,
     play: async ({ canvasElement }) => {
       const { expect } = await import('storybook/test');
       // ...interact, then measure with getBoundingClientRect() and
       // document.elementFromPoint() — real hit-testing, unavailable in jsdom.
     },
   };
   ```

2. Run it with `npm run test:visual` (`vitest run --project=storybook`).

The `storybook` project's `tags: { include: ['visual-regression'] }` filter (see
`vitest.config.ts`) means only tagged stories run as browser tests — every other story is
skipped. This is deliberate: `@storybook/addon-vitest`'s own default is to run *every* story
as a test, which would turn this slower, Playwright-dependent project into a blanket
requirement for every component in the library. Tag a story only when it specifically needs
real-browser paint-order verification.

**A real `<img>`/element with `pointer-events: none`** (a common pattern for decorative or
crossfading image layers — see `imageColumnFrameSx`) is never returned by
`document.elementFromPoint`: hit-testing passes straight through it to whatever ancestor
actually accepts pointer events. Assert against that ancestor (e.g. `.closest('.MuiStack-root')`
on the element you found by test id/alt text), not the leaf element itself.

**A known Vite/Storybook dependency-optimization race** (`storybookjs/storybook#33067`)
surfaces as every story failing with `does not provide an export named 'elementRoles'` the
first time this project runs. `vitest.config.ts`'s `optimizeDeps.include` for `aria-query` and
the two `@testing-library` packages works around it — do not remove that block.

## Investigation: FeatureFlowSection sticky-image/detail-panel overlap (#196)

Issue #196 asked for a real-browser paint-order test mirroring the manual `elementFromPoint`
verification done once, by hand, during PR #195's review of #193 (the sticky image column
painting under the expanded detail panel). Building that test surfaced that, in the **current**
implementation, genuine on-screen pixel overlap between the two is not reachable — not just
hard to hit with the right scroll offset, but structurally prevented by two independent,
pre-existing CSS properties (both predate this investigation; neither was introduced while
building this test):

1. **The grid-stretch + padding invariant.** `FeatureFlowImageColumn`'s sticky `Stack`
   (`imageColumnStickyStackSx`) is bounded by its containing block — the `Grid` item it sits
   in, which stretches to match the row height set by the sibling description column. That
   Grid item's bottom edge is the same point the `Grid` *container* ends at, and
   `featureFlowGridContainerSx` adds a fixed `pb` once a panel is expanded specifically to keep
   the last row clear of the panel's top border. Because the sticky element can never travel
   past its own containing block's bottom, and the detail panel (rendered after the `Grid` as a
   sibling in `BasicSection`'s `unconstrainedChildren`) always starts at that same bottom edge
   plus that positive `pb` gap, the vertical gap between "image, fully unstuck" and "panel top"
   shrinks monotonically as you scroll but never reaches zero. No amount of scrolling closes it.
2. **The card's own overflow clip.** Even forcing a large mismatch between the sticky column's
   ghost-driven natural height (`imageColumnOuterGhostSx`) and the actually-displayed active
   image's natural height (e.g. selecting an item whose own `imgUrl` has a much taller aspect
   ratio than `items[0]`'s, which sets the ghost) does not spill onto the page: `imageColumnCardSx`
   sets `overflow: 'hidden'`, clipping the oversized image to the card's own (short) box.

Both were confirmed with real Chromium (Playwright) measurements, not just read from source.

**Conclusion:** given the current component, the jsdom-based regression tests already in place
(`feature-flow-section.transition.test.ts`'s ancestor-transform walk and
`image-column/feature-flow-image-column.styles.test.ts`'s `zIndex` assertion) are the correct
and sufficient coverage — they assert the exact CSS inputs that prevent the #193 regression from
recurring, and a real-browser paint-order test would exercise a scenario that cannot currently
occur. The `storybook` Vitest project and its supporting infrastructure (Playwright,
`@storybook/addon-vitest`, the `visual-regression` tag) were kept in the repo for the next
component where overlap genuinely is reachable — see "When you need the `storybook` project"
above before reaching for it.

If either of the two containments above is ever deliberately relaxed for a real product reason,
re-open this investigation: that would be the point where a real-browser test starts pulling
its weight for this component.
