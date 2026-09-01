import Stack from '@mui/material/Stack';

import { SectionTitle } from '../../../material/layout/section-title';
import { hasExpansionData } from '../feature-flow-section.utils';
import { FeatureFlowItemRow } from '../item-row';
import {
  descriptionColumnRowListSx,
  descriptionColumnTitleSx,
} from './feature-flow-description-column.styles';
import type { FeatureFlowDescriptionColumnProps } from './types';

// Re-export — keeps `import { FeatureFlowDescriptionColumnProps } from
// './feature-flow-description-column'` working alongside the folder barrel.
export type { FeatureFlowDescriptionColumnProps } from './types';

// ----------------------------------------------------------------------

/**
 * `FeatureFlowDescriptionColumn` — the title and row list shown in
 * `FeatureFlowSection`'s left (by default) column. Not exported from the
 * package barrel: an implementation detail of `FeatureFlowSection`, mirroring
 * `FeatureFlowImageColumn`'s own sub-component split for the opposite column.
 *
 * **Deliberately fragment-rooted, no `forwardRef`/`sx`/`...other`.** Unlike
 * its siblings (`item-row`, `item-detail`, `highlight-carousel`,
 * `image-column`), each a single positionable/stylable unit, this component
 * has exactly one call site (`feature-flow-section.tsx`) with a fixed prop
 * list — no `ref`, no `sx`, no passthrough anywhere. Its `SectionTitle` and
 * row-list `Stack` flow directly into the parent's own `Grid` item as
 * siblings; wrapping them in a single root would add API surface nothing
 * uses and change how they sit in that grid cell for no benefit.
 */
export function FeatureFlowDescriptionColumn({
  caption,
  title,
  txtGradient,
  description,
  items,
  selectedItemIndex,
  activeItemIndex,
  expandedItemId,
  onItemHover,
  onItemSelect,
  onLeave,
}: FeatureFlowDescriptionColumnProps) {
  return (
    <>
      {title && (
        <SectionTitle
          caption={caption}
          title={title}
          txtGradient={txtGradient}
          description={description}
          sx={descriptionColumnTitleSx}
        />
      )}

      <Stack
        spacing={1.5}
        sx={descriptionColumnRowListSx}
        onMouseLeave={onLeave}
        onBlur={(event) => {
          // Only reset once focus actually leaves this whole row group, not
          // when it moves from one row to the next within it (relatedTarget
          // is the element about to gain focus).
          if (
            event.relatedTarget instanceof Node &&
            event.currentTarget.contains(event.relatedTarget)
          ) {
            return;
          }
          onLeave();
        }}
      >
        {items.map((item, index) => {
          const expandable = hasExpansionData(item);
          const isSelected = index === selectedItemIndex;
          const isActive = index === activeItemIndex;
          const isExpanded = item.id === expandedItemId;

          return (
            <FeatureFlowItemRow
              key={item.id}
              icon={item.icon}
              title={item.title}
              description={item.description}
              expandable={expandable}
              isSelected={isSelected}
              isActive={isActive}
              isExpanded={isExpanded}
              onHover={() => onItemHover(index)}
              onFocus={() => onItemHover(index)}
              onSelect={() => onItemSelect(item, index)}
            />
          );
        })}
      </Stack>
    </>
  );
}
