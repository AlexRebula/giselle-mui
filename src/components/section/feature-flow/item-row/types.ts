import type { ComponentPropsWithoutRef } from 'react';

import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Native button attributes this component's root can safely forward as-is —
 * everything except `onFocus`/`onClick`/`onMouseEnter` (fully owned already,
 * driven by `onHover`/`onSelect` instead) and `title`/`children` (`title` is
 * repurposed as this row's own heading text). `ButtonBase` renders as a
 * plain native button here (see #192 — the entrance animation moved to an
 * outer `m.div`), so there's no framer-motion handler-signature conflict to
 * account for.
 */
type SafeButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'onFocus' | 'onClick' | 'onMouseEnter' | 'title' | 'children'
>;

export interface FeatureFlowItemRowProps extends SafeButtonProps {
  /** Solar icon name, rendered at the row's leading edge. */
  icon: string;
  title: string;
  description: string;
  /**
   * Whether this item has expansion data (metrics, technologies, highlight
   * cards, or a long description). Every row is a real `ButtonBase`
   * regardless of this value (see #198) — it only gates the visual
   * hover/press/selected/expanded treatment and whether `onSelect` is wired.
   */
  expandable: boolean;
  /** Persistent: this is the last-clicked item (only meaningful when `expandable`). */
  isSelected: boolean;
  /** Transient: this is the currently-previewed item (hover or focus, any row). */
  isActive: boolean;
  /** This item's detail panel is currently open (only meaningful when `expandable`). */
  isExpanded: boolean;
  /** Fires on mouse enter — makes this the previewed item. */
  onHover: () => void;
  /** Fires on focus — makes this the previewed item (keyboard equivalent of `onHover`). */
  onFocus: () => void;
  /** Fires on click. Only wired when `expandable` — never called otherwise. */
  onSelect: () => void;
  /** MUI sx prop: merged with the row's own computed styles. */
  sx?: SxProps<Theme>;
}
