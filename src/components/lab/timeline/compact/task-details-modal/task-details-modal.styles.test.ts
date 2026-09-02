// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import {
  dialogCloseButtonSx,
  dialogContentSx,
  dialogDateSx,
  dialogEmptyStateSx,
  dialogSummarySx,
  dialogTitleSx,
} from './task-details-modal.styles';

// ----------------------------------------------------------------------

describe('dialogTitleSx', () => {
  it('lays out title+date on the left and the close button on the right', () => {
    expect(dialogTitleSx).toMatchObject({
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    });
  });
});

describe('dialogDateSx', () => {
  it('renders as a secondary, block-level date label', () => {
    expect(dialogDateSx).toMatchObject({
      display: 'block',
      color: 'text.secondary',
    });
  });
});

describe('dialogSummarySx', () => {
  it('adds bottom margin only when there are tasks below the summary', () => {
    expect(dialogSummarySx(true)).toMatchObject({ mb: 2 });
    expect(dialogSummarySx(false)).toMatchObject({ mb: 0 });
  });

  it('uses secondary text color', () => {
    expect(dialogSummarySx(true)).toMatchObject({ color: 'text.secondary' });
  });
});

describe('dialogEmptyStateSx', () => {
  it('uses disabled text color for the empty state', () => {
    expect(dialogEmptyStateSx).toMatchObject({ color: 'text.disabled' });
  });
});

describe('dialogCloseButtonSx', () => {
  it('nudges the close button down to align with the title text', () => {
    expect(dialogCloseButtonSx).toMatchObject({ mt: 0.5, flexShrink: 0 });
  });
});

describe('dialogContentSx', () => {
  it('adds top padding below the divider', () => {
    expect(dialogContentSx).toMatchObject({ pt: 2 });
  });
});
