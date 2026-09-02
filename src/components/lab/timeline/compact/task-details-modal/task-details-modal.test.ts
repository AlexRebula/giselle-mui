// @vitest-environment jsdom
import React from 'react';
import { act } from 'react-dom/test-utils';
import ReactDOM from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';

import { TaskDetailsModal } from './task-details-modal';

function renderModal(props: Partial<React.ComponentProps<typeof TaskDetailsModal>> = {}) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);
  act(() => {
    root.render(
      React.createElement(TaskDetailsModal, {
        task: null,
        open: true,
        onClose: () => {},
        ...props,
      })
    );
  });
  return { container, root };
}

describe('TaskDetailsModal', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders nothing when there is no task', () => {
    renderModal({ task: null, open: true });

    expect(document.body.textContent).toBe('');
  });

  it('renders the task title and description when open', () => {
    renderModal({
      task: { key: 'task-1', title: 'Accordion', description: 'A generic accordion.' },
      open: true,
    });

    expect(document.body.textContent).toContain('Accordion');
    expect(document.body.textContent).toContain('A generic accordion.');
  });
});
