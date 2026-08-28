import type { ReactNode } from 'react';

import type { BoxProps } from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/** One high-impact stat block shown above an item's long description. */
export interface FeatureFlowMetric {
  /** Large headline value, e.g. `'20+'`. */
  value: string;
  label: string;
  sublabel?: string;
  /** Iconify icon name, rendered via `GiselleIcon`. */
  icon?: string;
}

/**
 * One technology/tool entry for an item's tech chip list.
 * The consumer owns icon resolution entirely: no app-specific lookup map or
 * asset directory is involved. `icon` is an Iconify icon name, rendered via
 * `GiselleIcon`.
 */
export interface FeatureFlowTechnology {
  name: string;
  icon: string;
}

/** One slide in an item's highlight-card carousel. */
export interface FeatureFlowHighlightCard {
  headline: string;
  detail: string;
  /** Slide background image. Falls back to a neutral placeholder when omitted. */
  src?: string;
}

/** A single feature/expertise item rendered in the description column. */
export interface FeatureFlowItem {
  id: string;
  /** Iconify icon name, rendered via `GiselleIcon`. */
  icon: string;
  title: string;
  description: string;
  subtitle?: string;
  /** Per-item image sequence shown in the sticky image column on hover. */
  imgUrl?: readonly string[];
  /** Rich prose shown in the expanded detail panel. Falls back to `description`. */
  longDescription?: ReactNode;
  technologies?: readonly FeatureFlowTechnology[];
  /** Call-to-action label shown in the expanded detail panel. */
  ctaLabel?: string;
  /** Call-to-action URL shown in the expanded detail panel. */
  ctaHref?: string;
  highlightCards?: readonly FeatureFlowHighlightCard[];
  /** 1–3 high-impact stat blocks shown above the long description. */
  metrics?: readonly FeatureFlowMetric[];
}

/** The sticky image column's source(s). */
export interface FeatureFlowImage {
  src: string;
  alt: string;
  sx?: SxProps<Theme>;
  /** Fallback hover-stack image sequence, used when an item has no `imgUrl`. */
  stackSources?: readonly string[];
  /**
   * Two image sources swapped based on page scroll direction.
   * Index 0 = scrolling down, index 1 = scrolling up. Takes priority over
   * `stackSources` while the page is actively scrolling.
   */
  scrollImages?: readonly [string, string];
}

export type FeatureFlowGridSize = Readonly<{ xs?: number; md?: number; lg?: number }>;

export interface FeatureFlowSectionProps extends Omit<BoxProps, 'children'> {
  caption?: string;
  title?: string;
  /** Gradient-accent word appended after `title`, rendered on its own span. */
  txtGradient?: string;
  description?: ReactNode;
  items: readonly FeatureFlowItem[];
  image: FeatureFlowImage;
  /** Which side the description column renders on. @default 'left' */
  layoutDirection?: 'left' | 'right';
  columnSpacing?: Readonly<{ xs?: number; md?: number }>;
  /** @default derived from `layoutDirection` */
  descriptionGridSize?: FeatureFlowGridSize;
  /** @default derived from `layoutDirection` */
  imageGridSize?: FeatureFlowGridSize;
}

// ----------------------------------------------------------------------
// Internal sub-component prop types (not exported from the package barrel).
// ----------------------------------------------------------------------

export interface FeatureFlowImageColumnProps {
  /** The src that should be fully visible right now. */
  activeSrc: string;
  /** In-flow src used purely to give the sticky column its natural height. */
  ghostSrc: string;
  /** Every src this column may ever show — all permanently mounted, crossfaded via opacity. */
  allSrcs: readonly string[];
  alt: string;
  sx?: FeatureFlowImage['sx'];
}

export interface FeatureFlowItemDetailProps {
  item: FeatureFlowItem;
}

export interface FeatureFlowHighlightCarouselProps {
  cards: readonly FeatureFlowHighlightCard[];
}

export interface FeatureFlowSubNavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface FeatureFlowSubNavProps {
  items: readonly FeatureFlowSubNavItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
}
