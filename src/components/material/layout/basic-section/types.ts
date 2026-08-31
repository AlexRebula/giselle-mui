import type { SxProps, Theme } from '@mui/material/styles';
import type { BoxProps } from '@mui/material/Box';

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
  /** MUI sx prop: forwarded to the root `<section>` element. */
  sx?: SxProps<Theme>;
}
