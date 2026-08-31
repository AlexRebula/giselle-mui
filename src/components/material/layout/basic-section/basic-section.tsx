import React from 'react';

import Box from '@mui/material/Box';

import { SectionContainer } from '../section-container';
import {
  CANONICAL_FRAME,
  basicSectionRootSx,
  borderLineSx,
  cornerPlusSx,
  cornerXSx,
  dotSx,
  triangleDownSx,
  triangleLeftSx,
} from './basic-section.styles';
import type { BasicSectionProps, DecorationElement } from './types';

// ----------------------------------------------------------------------

/** Renders one `DecorationElement`, purely by `kind` — all positioning comes from the caller's `sx`. */
function Decoration({ kind, vertical, sx }: DecorationElement) {
  switch (kind) {
    case 'corner-plus':
      return (
        <Box
          aria-hidden="true"
          sx={[cornerPlusSx, ...(Array.isArray(sx) ? sx : [sx])]}
          component="svg"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 0V16M16 8H0" stroke="currentColor" />
        </Box>
      );
    case 'corner-x':
      return (
        <Box
          aria-hidden="true"
          sx={[cornerXSx, ...(Array.isArray(sx) ? sx : [sx])]}
          component="svg"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 2L7.96685 8.03315M7.96685 8.03315L2.0663 13.9337M7.96685 8.03315L13.9337 14M7.96685 8.03315L2 2.0663"
            stroke="currentColor"
          />
        </Box>
      );
    case 'border-line':
      return (
        <Box aria-hidden="true" sx={[borderLineSx(vertical), ...(Array.isArray(sx) ? sx : [sx])]} />
      );
    case 'triangle-left':
      return (
        <Box
          aria-hidden="true"
          sx={[triangleLeftSx, ...(Array.isArray(sx) ? sx : [sx])]}
          component="svg"
          viewBox="0 0 10 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 10L8.74228e-07 20L0 0L10 10Z" fill="currentColor" />
        </Box>
      );
    case 'triangle-down':
      return (
        <Box
          aria-hidden="true"
          sx={[triangleDownSx, ...(Array.isArray(sx) ? sx : [sx])]}
          component="svg"
          viewBox="0 0 20 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 10L0 0H20L10 10Z" fill="currentColor" />
        </Box>
      );
    case 'dot':
      return <Box aria-hidden="true" sx={[dotSx, ...(Array.isArray(sx) ? sx : [sx])]} />;
  }
}

/** Resolves the `decoration` prop to the list of elements to render. */
function resolveDecoration(decoration: boolean | DecorationElement[]): DecorationElement[] {
  if (decoration === true) return CANONICAL_FRAME;
  if (decoration === false) return [];
  return decoration;
}

// ----------------------------------------------------------------------

/**
 * `BasicSection` — the canonical section wrapper: a consistent decorative
 * frame (corner marks, border lines, and other subtle accents, configurable
 * via `decoration`) around a `SectionContainer`, giving every section built
 * on it the same content width and vertical rhythm for free. `decoration`:
 * `true` (the default) renders the canonical frame every section used
 * before this component existed; `false` renders none; an array of
 * `DecorationElement`s renders a fully custom set — real usage across the
 * sections this was extracted from never shares fixed offsets, so each
 * element positions itself via its own `sx`.
 *
 * `SectionContainer` is not optional here — every section previously
 * hand-rolled its own `Container` + padding (see `SectionContainer`'s own
 * README), which is precisely the inconsistency this component exists to
 * remove. Use `containerMaxWidth`/`containerPy`/`containerSx` for the rare
 * section that needs different container behaviour, rather than reaching
 * around `BasicSection` to add a second `Container` inside it.
 *
 * @example
 * ```tsx
 * <BasicSection>
 *   <Typography variant="h2">Section heading</Typography>
 * </BasicSection>
 * ```
 */
export const BasicSection = React.forwardRef<HTMLElement, BasicSectionProps>(function BasicSection(
  {
    children,
    decoration = true,
    containerMaxWidth,
    containerPy,
    containerSx,
    unconstrainedChildren,
    sx,
    ...other
  },
  ref
) {
  const elements = resolveDecoration(decoration);

  return (
    <Box
      ref={ref}
      component="section"
      sx={[basicSectionRootSx, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      {elements.map((element, index) => (
        <Decoration key={index} {...element} />
      ))}
      <SectionContainer maxWidth={containerMaxWidth} py={containerPy} sx={containerSx}>
        {children}
      </SectionContainer>
      {unconstrainedChildren}
    </Box>
  );
});

BasicSection.displayName = 'BasicSection';
