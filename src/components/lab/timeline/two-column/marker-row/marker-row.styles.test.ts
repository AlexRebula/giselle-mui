// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';

import {
  markerPhaseLiSx,
  markerLabelSlotSx,
  markerCenterSx,
  markerRowInnerSx,
} from './marker-row.styles';

// ---------------------------------------------------------------------------
// markerPhaseLiSx
// ---------------------------------------------------------------------------

describe('markerPhaseLiSx — marker phase li', () => {
  it('has a minimum height for the dot', () => {
    const sx = markerPhaseLiSx as Record<string, unknown>;
    expect(sx['minHeight']).toBe(40);
  });

  it('is column flex, relatively positioned', () => {
    const sx = markerPhaseLiSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexDirection']).toBe('column');
    expect(sx['position']).toBe('relative');
    expect(sx['zIndex']).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// markerLabelSlotSx (unified factory — replaces separate markerLeftLabelSx / markerRightLabelSx)
// Named *SlotSx not *LabelSx: the Box is a structural container (slot), not the label itself.
// Unified into a factory to avoid duplicating identical structure for left/right variants.
// ---------------------------------------------------------------------------

describe('markerLabelSlotSx("left") — left label slot', () => {
  it('right-aligns content with right padding', () => {
    const sx = markerLabelSlotSx('left') as Record<string, unknown>;
    expect(sx['justifyContent']).toBe('flex-end');
    expect(sx['pr']).toBe(1.5);
    expect(sx['pl']).toBe(0);
    expect(sx['flex']).toBe(1);
  });

  it('[regression] has minWidth:0 and overflow:hidden to clip nowrap labels at narrow widths', () => {
    const sx = markerLabelSlotSx('left') as Record<string, unknown>;
    expect(sx['minWidth']).toBe(0);
    expect(sx['overflow']).toBe('hidden');
  });

  it('[regression: left slot hidden xs] left slot hidden so left-side labels shift to the right slot on mobile', () => {
    const sx = markerLabelSlotSx('left') as Record<string, unknown>;
    const display = sx['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('none');
    expect(display['md']).toBe('flex');
  });
});

describe('markerLabelSlotSx("right") — right label slot', () => {
  it('left-aligns content with left padding', () => {
    const sx = markerLabelSlotSx('right') as Record<string, unknown>;
    expect(sx['justifyContent']).toBe('flex-start');
    expect(sx['pl']).toBe(1.5);
    expect(sx['pr']).toBe(0);
    expect(sx['flex']).toBe(1);
  });

  it('[regression] has minWidth:0 and overflow:hidden to clip nowrap labels at narrow widths', () => {
    const sx = markerLabelSlotSx('right') as Record<string, unknown>;
    expect(sx['minWidth']).toBe(0);
    expect(sx['overflow']).toBe('hidden');
  });

  it('[regression: right slot always visible] right slot visible on all breakpoints', () => {
    const sx = markerLabelSlotSx('right') as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
  });
});

describe('markerCenterSx — centre column', () => {
  it('is column flex centered, relatively positioned', () => {
    const sx = markerCenterSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexDirection']).toBe('column');
    expect(sx['alignItems']).toBe('center');
    expect(sx['position']).toBe('relative');
  });

  it('[regression] has flexShrink:0 so the spine dot is never squeezed', () => {
    const sx = markerCenterSx as Record<string, unknown>;
    expect(sx['flexShrink']).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// markerRowInnerSx
// ---------------------------------------------------------------------------

describe('markerRowInnerSx — marker row inner', () => {
  it('is horizontal flex row with centred alignment', () => {
    const sx = markerRowInnerSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexDirection']).toBe('row');
    expect(sx['alignItems']).toBe('center');
  });
});
