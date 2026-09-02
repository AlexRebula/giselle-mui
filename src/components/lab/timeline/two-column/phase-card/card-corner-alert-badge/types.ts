import type { Ref } from 'react';
import type { CardCornerAlert } from '../types';

/** Props for the `CardCornerAlertBadge` internal sub-component. @internal */
export type CardCornerAlertBadgeProps = {
  alerts: CardCornerAlert[];
  columnSide?: 'left' | 'right';
  /** When provided, badge is a clickable button that opens the PhaseWarningPopover. */
  onClick?: () => void;
  /** Ref forwarded to the badge circle element — used as Popper anchor. */
  innerRef?: Ref<HTMLElement>;
};
