// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import {
  taskDetailsContentSx,
  taskDetailsEmptyStateSx,
  taskDetailsSummarySx,
} from './task-details-renderer.styles';

describe('taskDetailsSummarySx', () => {
  it('uses secondary text color with bottom margin', () => {
    expect(taskDetailsSummarySx).toMatchObject({ color: 'text.secondary', mb: 2 });
  });
});

describe('taskDetailsContentSx', () => {
  it('lays out content as a gapped grid', () => {
    expect(taskDetailsContentSx).toMatchObject({ display: 'grid', gap: 2 });
  });
});

describe('taskDetailsEmptyStateSx', () => {
  it('uses disabled text color for the empty state', () => {
    expect(taskDetailsEmptyStateSx).toMatchObject({ color: 'text.disabled' });
  });
});
