import type { BoxProps } from '@mui/material/Box';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

// ----------------------------------------------------------------------

export type HoverPhase = 'idle' | 'artistic' | 'portrait';

export type PortraitDirection =
  | 'forward'
  | 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'up-left'
  | 'up-right'
  | 'down-left'
  | 'down-right';

export type PortraitSource = {
  direction: PortraitDirection;
  src: string | readonly string[];
};

/** Shared transition descriptor used by all animated layers. */
export type FadeTransition = {
  duration: number;
  ease?: readonly [number, number, number, number];
};

// ----------------------------------------------------------------------
// Main component

// React HTML event types that framer-motion redefines with incompatible signatures
// on Box<motion.div>. Omitting them lets consumers still pass standard HTML props via
// ...other without causing TS2769 overload-resolution failures.
type FramerMotionConflictingEvents =
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onDragOver'
  | 'onDragEnter'
  | 'onDragLeave'
  | 'onDragExit'
  | 'onDrop';

export type InteractiveHeroLogoProps = Omit<
  BoxProps,
  'sx' | 'children' | 'ref' | FramerMotionConflictingEvents
> & {
  /** sx applied to the inner content container (not the 3D-perspective root). */
  sx?: BoxProps['sx'];
  /** sx applied to the outermost perspective root Box. */
  rootSx?: BoxProps['sx'];
  frameSources?: readonly string[];
  artisticLogoSrc?: string;
  /**
   * Alt text shared by the original logo and artistic logo layers.
   * @default 'Logo'
   */
  logoAlt?: string;
  portraitSrc?: string;
  portraitSources?: readonly PortraitSource[];
  /** @default 'Portrait' */
  portraitAlt?: string;
  children?: ReactNode;
};

// ----------------------------------------------------------------------
// Sub-component props
//
// `OriginalLogoLayerProps`, `ArtisticLogoLayerProps`, and `PortraitLayerProps` now
// live in their own subfolder's `types.ts` (see `original-logo-layer/`,
// `artistic-logo-layer/`, `portrait-layer/`) — each is used by exactly one
// sub-component. `HoverPhase` and `FadeTransition` above stay here because they
// are genuinely shared across sub-components and re-exported from the package barrel.

// ----------------------------------------------------------------------
// Hook

export type UseHoverPhaseTransitionOptions = {
  isHovered: boolean;
  hasPortrait: boolean;
  reducedMotion: boolean | null;
};

export type UseHoverPhaseTransitionResult = {
  hoverPhase: HoverPhase;
  hasActivatedPortrait: boolean;
  activePortraitDirection: PortraitDirection;
  setActivePortraitDirection: Dispatch<SetStateAction<PortraitDirection>>;
};
