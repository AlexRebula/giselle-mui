import React from 'react';

import Box from '@mui/material/Box';

import {
  basicSectionRootSx,
  borderLineSx,
  cornerMarkSx,
  type BorderLinePosition,
  type CornerMarkPosition,
} from './basic-section.styles';
import type { BasicSectionProps } from './types';

// ----------------------------------------------------------------------

const CORNER_MARK_POSITIONS: CornerMarkPosition[] = ['top-left', 'bottom-left'];
const BORDER_LINE_POSITIONS: BorderLinePosition[] = ['top', 'bottom', 'left'];

/** A small plus-shaped mark at one corner of the section. Purely decorative. */
function CornerMark({ position }: { position: CornerMarkPosition }) {
  return (
    <Box
      aria-hidden="true"
      sx={cornerMarkSx(position)}
      component="svg"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 0V16M16 8H0" stroke="currentColor" />
    </Box>
  );
}

/** A subtle dashed line along one edge of the section. Purely decorative. */
function BorderLine({ position }: { position: BorderLinePosition }) {
  return <Box aria-hidden="true" sx={borderLineSx(position)} />;
}

// ----------------------------------------------------------------------

/**
 * `BasicSection` — a section wrapper providing a consistent decorative frame:
 * corner plus-marks and border lines, matching the standard treatment used
 * across landing-page sections. Set `decorated={false}` to render a plain
 * section with none of it.
 *
 * Composes with, rather than replaces, `SectionContainer` (the spacing-only
 * shell) — nest a `SectionContainer` (or a component with its own internal
 * `Container`, like `FeatureFlowSection`) inside `BasicSection` for the full
 * standard treatment.
 *
 * @example
 * ```tsx
 * <BasicSection>
 *   <FeatureFlowSection {...expertiseAreas} />
 * </BasicSection>
 * ```
 */
export const BasicSection = React.forwardRef<HTMLElement, BasicSectionProps>(function BasicSection(
  { children, decorated = true, sx, ...other },
  ref
) {
  return (
    <Box
      ref={ref}
      component="section"
      sx={[basicSectionRootSx, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      {decorated && (
        <>
          {CORNER_MARK_POSITIONS.map((position) => (
            <CornerMark key={position} position={position} />
          ))}
          {BORDER_LINE_POSITIONS.map((position) => (
            <BorderLine key={position} position={position} />
          ))}
        </>
      )}
      {children}
    </Box>
  );
});

BasicSection.displayName = 'BasicSection';
