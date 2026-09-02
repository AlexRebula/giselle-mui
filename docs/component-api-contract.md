---
sidebar_position: 5
sidebar_label: 'Component API Contract'
---

# Component API contract

> Narrow by design. This file holds the one rule that [`components/cleanup-workflow.md`](./components/cleanup-workflow.md) cites it for. Broader API design guidance lives in [`components/api-design-rules.md`](./components/api-design-rules.md); the folder definition of done lives in [`components/cleanup-workflow.md`](./components/cleanup-workflow.md). Do not grow this file into a third playbook.
>
> _Last updated: 02 Sep 2026_

---

## Where a shared style constant lives

> **Not the same question as** [`components/api-design-rules.md`](./components/api-design-rules.md) §"Shared style vs shared component". That section decides **whether** a shared thing should be a style constant or a wrapper component (visual → constant; structural with named slots → thin component). This section assumes that decision already came out "constant" and answers the follow-on: **which `*.styles.ts` file does it go in?**

Once a style is extracted out of JSX — which the zero-tolerance `sx` policy requires of every `sx` object, regardless of property count — there is still a decision to make: **which `*.styles.ts` file does it belong in?**

The rule is about the number of callers, not the size of the style:

- A style used by **exactly one** component belongs in **that component's own** `<component-name>.styles.ts`.
- A style used by **more than one** sub-component belongs in the **parent's** `<parent-name>.styles.ts`, and each sub-component imports it from there.

Reach for the parent, not for a new wrapper component. A shared style is a shared _constant_ — it does not justify creating a component whose only job is to apply it. That is the same principle `api-design-rules.md` states for the public API ("if wrapping an MUI component adds nothing beyond a style constant, ship the style constant — not a wrapper component"), applied one level down to internal sub-components.

**Why placement matters.** Duplicating a style into two sibling files is the failure mode this rule prevents. Two copies drift: one gets updated during a refactor and the other silently does not, so two sub-components that were meant to look identical stop matching, and nothing fails to catch it. Keeping the single shared definition in the parent makes the sharing visible at the import site and gives the style exactly one place to change.

The mirror-image failure is hoisting a single-caller style into the parent "in case someone else needs it." That leaves the parent's styles file full of constants with one import each, and makes it impossible to tell at a glance which styles are genuinely shared. Hoist on the second caller, not in anticipation of one.

### Before

`phase-card/` and `milestone-badge/` both need the same card surface treatment, so each declares it:

```ts
// phase-card/phase-card.styles.ts
export const cardSurfaceSx: SxProps<Theme> = {
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
};
```

```ts
// milestone-badge/milestone-badge.styles.ts
// Same treatment, second copy — this is the drift risk.
export const badgeSurfaceSx: SxProps<Theme> = {
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
};
```

### After

One definition in the parent; both sub-components import it. Each keeps its own genuinely local styles where they are.

```ts
// two-column.styles.ts  (the parent)
export const cardSurfaceSx: SxProps<Theme> = {
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
};
```

```ts
// phase-card/phase-card.styles.ts
// Local to PhaseCard only — stays here.
export const phaseCardDetailsSx: SxProps<Theme> = { pt: 1.5, pl: 2 };
```

```tsx
// phase-card/phase-card.tsx
import { cardSurfaceSx } from '../two-column.styles';
import { phaseCardDetailsSx } from './phase-card.styles';
```

```tsx
// milestone-badge/milestone-badge.tsx
import { cardSurfaceSx } from '../two-column.styles';
```

If the shared style needs to vary by one dimension between callers (`side: 'left' | 'right'`, `blurred: boolean`), make it a single factory in the parent rather than two constants — see the factory unification rule in [`components/cleanup-workflow.md`](./components/cleanup-workflow.md) Step 3.

---

## Related

- [`components/cleanup-workflow.md`](./components/cleanup-workflow.md) — Step 3 (styles extraction) and the Scenario A / Scenario B definitions of done
- [`components/api-design-rules.md`](./components/api-design-rules.md) — prop interfaces, tier system, and public API rules
- [`naming-conventions.md`](./naming-conventions.md) — how to name the extracted constant
