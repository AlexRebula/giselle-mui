/** Props for the `MarkerLabel` internal sub-component. @internal */
export type MarkerLabelProps = {
  /** Display text — pass `phase.shortTitle ?? phase.title`. */
  title: string;
  /** Optional date string appended inline after a middle-dot separator. */
  date?: string;
};
