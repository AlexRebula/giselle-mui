import type { RefObject, ReactNode } from 'react';

import type { MotionValue } from 'framer-motion';
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

/**
 * One slide in an item's highlight-card carousel. Deliberately generic
 * (`title`/`description`, not e.g. `headline`/`detail`) — this shape is
 * reused for any kind of documentation content, not just marketing
 * highlights (see #200): a skill-flow's individual skills, for instance,
 * are exactly a list of these.
 */
export interface FeatureFlowHighlightCard {
  title: string;
  description: string;
  /** Slide background image. Falls back to a neutral placeholder when omitted. */
  media?: string;
  /** Optional link — e.g. to a full docs page for this card's subject. */
  href?: string;
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

/**
 * Scroll-linked entrance transform for the image column card as a whole —
 * opacity, y-offset, scale, and blur. Additive to the column's own per-image
 * opacity crossfade (keyed to `activeSrc`), which this does not affect.
 * Used directly by the main component (`useImageRevealTransform`) and by
 * `image-column` (`FeatureFlowImageColumnProps['revealStyle']`), so it lives
 * here rather than in either one's own sub-component `types.ts`. Each field
 * also accepts a plain value so callers outside `FeatureFlowSection`
 * (stories, tests) can render the column at a fixed resting state.
 */
export interface FeatureFlowImageRevealStyle {
  opacity: MotionValue<number> | number;
  y: MotionValue<number> | number;
  scale: MotionValue<number> | number;
  filter: MotionValue<string> | string;
}

/** Return value of `useImageRevealTransform`. */
export interface ImageRevealTransform {
  /** Attach to the element whose scroll-into-view progress drives the transform. */
  ref: RefObject<HTMLDivElement | null>;
  style: FeatureFlowImageRevealStyle;
}

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
  /** @default { xs: 0, md: 8 } */
  columnSpacing?: Readonly<{ xs?: number; md?: number }>;
  /** @default derived from `layoutDirection` */
  descriptionGridSize?: FeatureFlowGridSize;
  /** @default derived from `layoutDirection` */
  imageGridSize?: FeatureFlowGridSize;
  /**
   * Renders the standard `BasicSection` decorative frame (corner marks,
   * border lines) around the whole section.
   * @default true
   */
  decoration?: boolean;
  /**
   * Overrides what renders in the image column: called with the currently
   * previewed item (hover, focus, or last-selected) and whether that
   * item's own detail panel is expanded. Defaults to the built-in
   * `FeatureFlowImageColumn` (driven by `image`) when omitted — for
   * example, a skills-documentation consumer could render a heading and
   * short description here instead of an image, swapping to a fuller
   * carousel-style view once expanded.
   */
  renderRightPanel?: (activeItem: FeatureFlowItem, isActiveExpanded: boolean) => ReactNode;
}

// ----------------------------------------------------------------------
// Internal sub-component prop types live with their own sub-component now
// (see highlight-carousel/types.ts, image-column/types.ts, item-detail/types.ts)
// per the sub-component nesting policy — only types shared across sub-components
// or used directly by the main component stay here.
// ----------------------------------------------------------------------

export interface FeatureFlowSubNavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

/** Visual state driving a single item row's `sx` in the description column. */
export interface FeatureFlowItemButtonState {
  isSelected: boolean;
  isActive: boolean;
  isExpanded: boolean;
  /**
   * Whether this item has expansion data (metrics, technologies, highlight
   * cards, or a long description) — gates the hover/press/selected/expanded
   * *visual* treatment. Every row is a real, focusable `ButtonBase`
   * regardless of this value; items without expansion data just don't get
   * an `onClick` handler (see #198) and stay visually quiet.
   */
  expandable: boolean;
}
