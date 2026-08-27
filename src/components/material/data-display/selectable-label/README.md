# SelectableLabel

## Why it exists

A multi-select filter chip group — persona filters, tag toggles, facet pickers — is a
frequently needed UI primitive. Getting it right without a dedicated component means every
consumer rediscovers the same pitfalls: forgetting `aria-pressed` (screen readers can't
report selection state), giving selected/unselected states no visual distinction beyond
color alone, or reaching for MUI `Chip`'s own uncontrolled `onClick` instead of an explicit
controlled toggle contract. `SelectableLabel` makes one correct implementation available
everywhere.

## Why it's not called `SelectableChip`

MUI already exports `<Chip>` — naming ours `SelectableChip` would create the exact ambiguity
this repo's naming conventions already ruled out for `StatusLabel` (`StatusChip` was
considered and rejected for the same reason). `SelectableLabel` follows that established
`*Label` suffix for small badge/chip-shaped elements while stating its own semantic role
clearly. See `docs/naming-conventions.md`.

## Why it belongs here

Any interface with a multi-select filter pattern — persona filters, tag pickers, facet
toggles — needs this. `SelectableCard` already solves the equivalent problem for a larger,
card-shaped selectable surface; `SelectableLabel` is the same interaction pattern scaled
down to inline pill size, for when several small options need to sit in a row.

## Design decisions

- **Built on MUI `Chip`'s clickable variant** — not a custom `ButtonBase` reimplementation.
  `Chip` already provides the correct focusable, keyboard-activatable pill shape; this
  component adds the controlled selection contract on top.
- **`selected` / `onSelectedChange`, not `Chip`'s own `onClick`** — mirrors
  `ToggleIconButton`'s controlled-prop convention (`pressed` / `onPressedChange`) rather than
  leaving selection state to be independently reinvented by every consumer. `onSelectedChange`
  receives the **next** selected value, the value the label will transition to.
- **`aria-pressed` communicates selection** — same ARIA pattern as `SelectableCard`: `true`
  announces "pressed", `false` announces "not pressed".
- **Selection ring via `box-shadow`, not `border`** — a border width change shifts layout; a
  `box-shadow: 0 0 0 1.5px` outline doesn't. Same reasoning as `SelectableCard`, scaled down
  for a smaller pill.
- **A checkmark icon reinforces the selected state** — at chip scale, a ring alone reads more
  subtly than on a full card; the icon makes "selected" unambiguous at a glance even before a
  reader clocks the ring or background tint.
- **No color variants** — like `SelectableCard`, this is a structural primitive. The ring and
  tint use `text.primary`/`action.selected` (theme-mode-aware) rather than a semantic palette
  key, because selection is a binary user choice, not a semantic state.

## Library safety

- Zero personal data. No proprietary identifier names. No hardcoded hex or rgba literals.
- Uses only `Chip` and `SvgIcon` from `@mui/material` — no custom theme extension, no
  `@mui/icons-material` dependency (inline SVG path, same approach as `ToggleIconButton`'s
  default icons).

## File structure

```
data-display/selectable-label/
  selectable-label.tsx            — SelectableLabel component
  selectable-label.styles.ts      — selectableLabelSx factory
  selectable-label.styles.test.ts — mock-theme assertions for the sx factory
  selectable-label.test.ts        — Vitest unit tests (ARIA, click, disabled)
  selectable-label.stories.tsx    — Toggle, MultiSelect, Disabled
  types.ts                        — SelectableLabelProps
  index.ts                        — barrel
  README.md                       — this file
```

## Related

- `SelectableCard` — the same interaction pattern, card-shaped rather than chip-shaped.
- `StatusLabel` — a non-interactive chip; `SelectableLabel` is its interactive counterpart.
- `ToggleIconButton` — the source of the `selected`/`onSelectedChange`-style controlled-prop
  convention this component follows (named `pressed`/`onPressedChange` there).
