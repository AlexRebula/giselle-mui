import Stack from '@mui/material/Stack';

import { FaqFloatTriangleDownIcon, FaqFloatLine } from '../accordion-svg';
import {
  topTriangleStackSx,
  smallTriangleSx,
  primaryTriangleSx,
  verticalFloatLineSx,
} from './faq-top-lines.styles';

// ----------------------------------------------------------------------

/**
 * Decorative top-edge elements for `FaqSection`.
 * Renders stacked triangle icons and a vertical float line on the left edge.
 *
 * @internal — used by `FaqSection` only.
 *
 * **Quality status (28 Aug 2026):** DoD 11/12 · Best practices 13/13 — SonarQube not yet run
 */
export function FaqTopLines() {
  return (
    <>
      <Stack spacing={8} sx={topTriangleStackSx}>
        <FaqFloatTriangleDownIcon sx={primaryTriangleSx} />
        <FaqFloatTriangleDownIcon sx={smallTriangleSx} />
      </Stack>
      <FaqFloatLine vertical sx={verticalFloatLineSx} />
    </>
  );
}

FaqTopLines.displayName = 'FaqTopLines';
