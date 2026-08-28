// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';

import { renderWithTheme } from '../../../test-utils';
import { FeatureFlowItemDetail } from './feature-flow-item-detail';
import type { FeatureFlowItem } from './types';

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
          highlightCards: [{ headline: 'Shipped 3 releases', detail: 'In under a month.' }],
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
});
