// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import type { Theme } from '@mui/material/styles';
import {
  ganttTrackSx,
  popoverPaperSx,
  sliderRowHeaderSx,
  actionsRowSx,
  overlapPopperSx,
  warningHeaderRowSx,
  warningTitleSx,
  closeButtonSx,
  overlapSummarySx,
  overlapHintSx,
  slidersColumnSx,
  sliderPhaseLabelSx,
  applyCancelRowSx,
} from './phase-warning-popover.styles';

const mockTheme = {
  zIndex: { tooltip: 1500 },
} as unknown as Theme;

// ----------------------------------------------------------------------

describe('ganttTrackSx', () => {
  it('is relatively positioned with a subtle background', () => {
    expect(ganttTrackSx).toMatchObject({
      position: 'relative',
      bgcolor: 'action.hover',
    });
  });
});

describe('popoverPaperSx', () => {
  it('uses fixed 340px width column layout', () => {
    expect(popoverPaperSx).toMatchObject({
      width: 340,
      display: 'flex',
      flexDirection: 'column',
    });
  });
});

describe('sliderRowHeaderSx', () => {
  it('aligns title and date range on opposite ends', () => {
    expect(sliderRowHeaderSx).toMatchObject({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    });
  });
});

describe('actionsRowSx', () => {
  it('wraps to prevent overflow on narrow popovers', () => {
    expect(actionsRowSx).toMatchObject({
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    });
  });
});

describe('overlapPopperSx', () => {
  it('floats above tooltips', () => {
    const styles = (overlapPopperSx as (theme: Theme) => Record<string, unknown>)(mockTheme);
    expect(styles).toMatchObject({
      zIndex: 1501,
    });
  });
});

describe('warningHeaderRowSx', () => {
  it('spaces the title and close button apart', () => {
    expect(warningHeaderRowSx).toMatchObject({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    });
  });
});

describe('warningTitleSx', () => {
  it('aligns the warning glyph and count inline', () => {
    expect(warningTitleSx).toMatchObject({
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
    });
  });
});

describe('closeButtonSx', () => {
  it('pins the close button to the trailing edge', () => {
    expect(closeButtonSx).toMatchObject({
      ml: 'auto',
    });
  });
});

describe('overlapSummarySx', () => {
  it('emphasises the overlap summary text', () => {
    expect(overlapSummarySx).toMatchObject({
      fontWeight: 500,
    });
  });
});

describe('overlapHintSx', () => {
  it('displays as a block with top margin', () => {
    expect(overlapHintSx).toMatchObject({
      mt: 0.5,
      display: 'block',
    });
  });
});

describe('slidersColumnSx', () => {
  it('stacks sliders in a column with spacing', () => {
    expect(slidersColumnSx).toMatchObject({
      display: 'flex',
      flexDirection: 'column',
      gap: 1.5,
    });
  });
});

describe('sliderPhaseLabelSx', () => {
  it('emphasises the phase label in a slider row header', () => {
    expect(sliderPhaseLabelSx).toMatchObject({
      fontWeight: 600,
    });
  });
});

describe('applyCancelRowSx', () => {
  it('lays out Apply and Cancel side by side', () => {
    expect(applyCancelRowSx).toMatchObject({
      display: 'flex',
      gap: 1,
    });
  });
});
