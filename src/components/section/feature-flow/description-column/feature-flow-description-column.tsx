import Stack from '@mui/material/Stack';

import { SectionTitle } from '../../../material/layout/section-title';
import { hasExpansionData } from '../feature-flow-section.utils';
import { FeatureFlowItemRow } from '../item-row';
import type { FeatureFlowDescriptionColumnProps } from './types';

// Re-export — keeps `import { FeatureFlowDescriptionColumnProps } from
// './feature-flow-description-column'` working alongside the folder barrel.
export type { FeatureFlowDescriptionColumnProps } from './types';

// ----------------------------------------------------------------------

/**
 * `FeatureFlowDescriptionColumn` — the title and interactive row list shown
 * in `FeatureFlowSection`'s left (by default) column. Not exported from the
 * package barrel: an implementation detail of `FeatureFlowSection`, mirroring
 * `FeatureFlowImageColumn`'s own sub-component split for the opposite column.
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
          sx={{ mb: { xs: 5, md: 8 }, textAlign: { xs: 'center', md: 'left' } }}
        />
      )}

      <Stack
        spacing={1.5}
        sx={{ maxWidth: { sm: 560, md: 400 }, mx: { xs: 'auto', md: 'unset' } }}
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
          const interactive = hasExpansionData(item);
          const isSelected = index === selectedItemIndex;
          const isActive = index === activeItemIndex;
          const isExpanded = item.id === expandedItemId;

          return (
            <FeatureFlowItemRow
              key={item.id}
              icon={item.icon}
              title={item.title}
              description={item.description}
              interactive={interactive}
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
