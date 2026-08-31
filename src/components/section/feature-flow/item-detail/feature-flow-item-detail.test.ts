// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { createElement, createRef, act } from 'react';
import ReactDOM from 'react-dom/client';

import { renderWithTheme } from '../../../../test-utils';
import { GiselleThemeProvider } from '../../../theming/theme-provider/giselle/giselle';
import { FeatureFlowItemDetail } from './feature-flow-item-detail';
import type { FeatureFlowItem } from '../types';
import type * as FramerMotionModule from 'framer-motion';

// `useReducedMotion` (framer-motion, an external module boundary — not this
// package's own code) is spied on with its real implementation preserved, so
// every other test in this file still exercises real motion behaviour. Only
// the reduced-motion test below overrides its return value.
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof FramerMotionModule>();
  return { ...actual, useReducedMotion: vi.fn(actual.useReducedMotion) };
});

const baseItem: FeatureFlowItem = {
  id: 'a',
  icon: 'solar:code-bold',
  title: 'Design systems',
  description: 'Short description',
};

describe('FeatureFlowItemDetail', () => {
  it('renders the item title', () => {
    const html = renderWithTheme(createElement(FeatureFlowItemDetail, { item: baseItem }));
    expect(html).toContain('Design systems');
  });

  it('falls back to description when longDescription is absent', () => {
    const html = renderWithTheme(createElement(FeatureFlowItemDetail, { item: baseItem }));
    expect(html).toContain('Short description');
  });

  it('renders a string longDescription instead of the fallback description', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowItemDetail, {
        item: { ...baseItem, longDescription: 'Much longer prose.' },
      })
    );
    expect(html).toContain('Much longer prose.');
    expect(html).not.toContain('Short description');
  });

  it('renders a ReactNode longDescription directly', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowItemDetail, {
        item: { ...baseItem, longDescription: createElement('blockquote', null, 'A quote block') },
      })
    );
    expect(html).toContain('A quote block');
  });

  it('renders no metrics grid when metrics is absent', () => {
    const html = renderWithTheme(createElement(FeatureFlowItemDetail, { item: baseItem }));
    expect(html).not.toContain('Years');
  });

  it('renders a MetricCard for each metric', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowItemDetail, {
        item: {
          ...baseItem,
          metrics: [
            { value: '20+', label: 'Years' },
            { value: '99%', label: 'Uptime' },
          ],
        },
      })
    );
    expect(html).toContain('20+');
    expect(html).toContain('Years');
    expect(html).toContain('99%');
    expect(html).toContain('Uptime');
  });

  it('renders a MetricCardDecoration inside each MetricCard, matching the original visual treatment (issue #177)', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);

    act(() => {
      root.render(
        createElement(GiselleThemeProvider, {
          defaultMode: 'light',
          children: createElement(FeatureFlowItemDetail, {
            item: { ...baseItem, metrics: [{ value: '20+', label: 'Years' }] },
          }),
        })
      );
    });

    // MetricCard only renders its aria-hidden decoration-overlay wrapper Box
    // when a `decoration` prop is passed (see metric-card.tsx) — this metric
    // has no icon, so that wrapper's presence, containing exactly one child
    // (the decoration itself), confirms the `decoration` prop reached
    // MetricCard without depending on the decoration's own style values.
    const paper = div.querySelector('.MuiPaper-root');
    const decorationWrapper = paper?.querySelector(':scope > [aria-hidden="true"]');
    expect(decorationWrapper).not.toBeNull();
    expect(decorationWrapper?.children.length).toBe(1);

    act(() => root.unmount());
    div.remove();
  });

  it('renders a metric sublabel when present', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowItemDetail, {
        item: {
          ...baseItem,
          metrics: [{ value: '20+', label: 'Years', sublabel: 'of experience' }],
        },
      })
    );
    expect(html).toContain('of experience');
  });

  it('renders no technology chips when technologies is absent', () => {
    const html = renderWithTheme(createElement(FeatureFlowItemDetail, { item: baseItem }));
    expect(html).not.toContain('Technologies');
  });

  it("resolves tech chips from the item's own {name, icon} pairs, with no app-owned lookup", () => {
    const html = renderWithTheme(
      createElement(FeatureFlowItemDetail, {
        item: {
          ...baseItem,
          technologies: [
            { name: 'React', icon: 'logos:react' },
            { name: 'TypeScript', icon: 'logos:typescript-icon' },
          ],
        },
      })
    );
    expect(html).toContain('React');
    expect(html).toContain('TypeScript');
  });

  it('renders no highlight carousel when highlightCards is absent', () => {
    const html = renderWithTheme(createElement(FeatureFlowItemDetail, { item: baseItem }));
    expect(html).not.toContain('highlight');
  });

  it('renders the highlight-card carousel when highlightCards is present', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowItemDetail, {
        item: {
          ...baseItem,
          highlightCards: [{ title: 'Shipped 3 releases', description: 'In under a month.' }],
        },
      })
    );
    expect(html).toContain('Shipped 3 releases');
    expect(html).toContain('In under a month.');
  });

  it('marks the header icon, metric icons, and tech chip icons as decorative (aria-hidden)', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowItemDetail, {
        item: {
          ...baseItem,
          metrics: [{ value: '20+', label: 'Years', icon: 'solar:star-bold' }],
          technologies: [{ name: 'React', icon: 'logos:react' }],
        },
      })
    );

    // GiselleIcon forwards aria-hidden onto its own root <span>, not the
    // inner Iconify <Icon>. One occurrence expected per icon instance
    // rendered here: the header icon, the metric's icon, and the tech chip's
    // icon (TechIconStrip renders one per technology entry).
    const ariaHiddenCount = html.split('aria-hidden="true"').length - 1;
    expect(ariaHiddenCount).toBeGreaterThanOrEqual(3);
  });

  it('forwards arbitrary props to the root element', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowItemDetail, {
        item: baseItem,
        'data-testid': 'item-detail',
      } as never)
    );
    expect(html).toContain('data-testid="item-detail"');
  });

  it('renders nothing when item is null', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);

    act(() => {
      root.render(createElement(FeatureFlowItemDetail, { item: null }));
    });

    expect(div.textContent).toBe('');

    act(() => root.unmount());
    div.remove();
  });

  it('calls onNodeRef with the panel node and item id once mounted, and null once unmounted', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const onNodeRef = vi.fn();

    act(() => {
      root.render(createElement(FeatureFlowItemDetail, { item: baseItem, onNodeRef }));
    });

    expect(onNodeRef).toHaveBeenCalledWith('a', expect.any(HTMLDivElement));

    act(() => {
      root.render(createElement(FeatureFlowItemDetail, { item: null, onNodeRef }));
    });

    expect(onNodeRef).toHaveBeenCalledWith('a', null);

    act(() => root.unmount());
    div.remove();
  });

  it('forwards ref to the outer, always-mounted wrapper', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const ref = createRef<HTMLDivElement>();

    act(() => {
      root.render(
        createElement(GiselleThemeProvider, {
          defaultMode: 'light',
          children: createElement(FeatureFlowItemDetail, { item: baseItem, ref }),
        })
      );
    });

    expect(ref.current).toBeInstanceOf(HTMLDivElement);

    act(() => root.unmount());
    div.remove();
  });

  it('reads the reduced-motion preference (used to zero the enter/exit slide distance)', async () => {
    const { useReducedMotion } = await import('framer-motion');
    const spy = useReducedMotion as unknown as ReturnType<typeof vi.fn>;
    spy.mockClear();
    spy.mockReturnValueOnce(true);

    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);

    act(() => {
      root.render(
        createElement(GiselleThemeProvider, {
          defaultMode: 'light',
          children: createElement(FeatureFlowItemDetail, { item: baseItem }),
        })
      );
    });

    expect(useReducedMotion).toHaveBeenCalled();

    act(() => root.unmount());
    div.remove();
  });
});
