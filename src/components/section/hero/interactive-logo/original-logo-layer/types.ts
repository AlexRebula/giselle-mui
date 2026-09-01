import type { ReactNode } from 'react';
import type { FadeTransition, HoverPhase } from '../types';

// ----------------------------------------------------------------------

export type OriginalLogoLayerProps = {
  hoverPhase: HoverPhase;
  logoFadeTransition: FadeTransition;
  activeFrame?: string;
  /** Alt text for the frame `<img>` element. @default 'Logo' */
  logoAlt?: string;
  children?: ReactNode;
  /**
   * Pass `true` when an artistic logo src is supplied. When `false`, the original logo
   * layer stays visible at full opacity in the idle phase (no artistic content to show
   * in its place).
   * @default false
   */
  hasArtisticContent?: boolean;
};
