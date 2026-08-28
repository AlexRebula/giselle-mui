import type { SVGMotionProps } from 'framer-motion';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Props for internal decorative SVG elements in `FaqSection`
 * (`FaqFloatLine`, `FaqFloatPlusIcon`, `FaqFloatTriangleDownIcon`).
 *
 * @internal
 */
export type SvgProps = SVGMotionProps<SVGSVGElement> & { sx?: SxProps<Theme> };
