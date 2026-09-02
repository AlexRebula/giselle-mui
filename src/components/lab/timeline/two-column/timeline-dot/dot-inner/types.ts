import type { ReactNode } from 'react';

/** Props for the `DotInner` internal sub-component. @internal */
export type DotInnerProps = {
  done: boolean;
  icon: ReactNode;
  animationKey: number;
  iconSize: number;
};
