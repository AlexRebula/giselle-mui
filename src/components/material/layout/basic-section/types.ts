import type { SxProps, Theme } from '@mui/material/styles';
import type { BoxProps } from '@mui/material/Box';
import type { ContainerProps } from '@mui/material/Container';

import type { SectionContainerProps } from '../section-container';

/** Every decorative piece `BasicSection` knows how to render. */
export type DecorationKind =
  'corner-plus' | 'corner-x' | 'border-line' | 'triangle-left' | 'triangle-down' | 'dot';

/**
 * One decorative element, positioned entirely via `sx` — real usage across
 * the sections that inspired this component never shares fixed offsets (an
 * inset corner mark here, a flush-to-the-edge one there), so a closed enum
 * of preset positions can't cover it. `border-line` additionally takes
 * `vertical` to pick its orientation, mirroring the original `FloatLine`'s
 * own prop shape.
 */
export type DecorationElement = {
  kind: DecorationKind;
  /** Only meaningful for `kind: 'border-line'`. @default false */
  vertical?: boolean;
  /** Positions and sizes this element. Required for anything beyond the default placement. */
  sx?: SxProps<Theme>;
};

/**
 * Props for `<BasicSection>`.
 */
export interface BasicSectionProps extends Omit<BoxProps<'section'>, 'component'> {
  /** Section content. */
  children: React.ReactNode;
  /**
   * `true` renders the canonical frame (2 corner plus-marks, 3 border
   * lines — the treatment every section used before this component
   * existed). `false` renders none. Pass an array to render a fully custom
   * set of decorative elements instead.
   * @default true
   */
  decoration?: boolean | DecorationElement[];
  /**
   * `children` is always wrapped in a `SectionContainer` — that's the whole
   * point: every section built on `BasicSection` gets the same content
   * width and vertical rhythm for free, instead of each one hand-rolling
   * its own `Container` (as every section did before this existed; see
   * `SectionContainer`'s own README). These three props forward to it.
   */
  containerMaxWidth?: ContainerProps['maxWidth'];
  /** @default SectionContainer's own default, `{ xs: 8, md: 12 }` */
  containerPy?: SectionContainerProps['py'];
  containerSx?: SxProps<Theme>;
  /**
   * Rendered as an additional sibling of the `SectionContainer`, inside
   * `<section>` but outside the width-constrained container — for content
   * that must not be nested inside another container (like a detail panel
   * with its own internal `Container`, which would otherwise double up on
   * horizontal padding) or that intentionally needs the full section width
   * (like a sticky sub-nav).
   */
  unconstrainedChildren?: React.ReactNode;
  /** MUI sx prop: forwarded to the root `<section>` element. */
  sx?: SxProps<Theme>;
}
