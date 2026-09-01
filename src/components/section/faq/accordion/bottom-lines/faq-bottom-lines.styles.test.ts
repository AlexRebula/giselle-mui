// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { floatLineEdgeSx, floatPlusIconEdgeSx } from './faq-bottom-lines.styles';
import { FAQ_PLUS_ICON_LEFT } from './faq-bottom-lines.const';

// ----------------------------------------------------------------------

describe('floatLineEdgeSx', () => {
  it('pins to the top-left corner for the top edge', () => {
    expect(floatLineEdgeSx('top')).toMatchObject({
      top: 0,
      left: 0,
    });
  });

  it('pins to the bottom-left corner for the bottom edge', () => {
    expect(floatLineEdgeSx('bottom')).toMatchObject({
      bottom: 0,
      left: 0,
    });
  });
});

describe('floatPlusIconEdgeSx', () => {
  it('offsets -8px above the top edge at the shared left inset', () => {
    expect(floatPlusIconEdgeSx('top')).toMatchObject({
      top: -8,
      left: FAQ_PLUS_ICON_LEFT,
    });
  });

  it('offsets -8px below the bottom edge at the shared left inset', () => {
    expect(floatPlusIconEdgeSx('bottom')).toMatchObject({
      bottom: -8,
      left: FAQ_PLUS_ICON_LEFT,
    });
  });
});
