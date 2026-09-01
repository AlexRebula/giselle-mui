import type { FadeTransition } from '../types';

// ----------------------------------------------------------------------

export type ArtisticLogoLayerProps = {
  artisticLogoSrc?: string;
  showArtisticLogo: boolean;
  logoFadeTransition: FadeTransition;
  /** Alt text for the artistic logo `<img>` element. @default 'Logo' */
  logoAlt?: string;
};
