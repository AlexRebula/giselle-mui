// @vitest-environment jsdom
import React from 'react';
import { act } from 'react-dom/test-utils';
import ReactDOM from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { RoadmapTimeline } from './roadmap-timeline';
import type { TimelineStep } from './types';

// ----------------------------------------------------------------------

function buildStep(overrides: Partial<TimelineStep> & { key: TimelineStep['key'] }): TimelineStep {
  return {
    title: `Step ${overrides.key}`,
    description: `Description for step ${overrides.key}`,
    date: 'Jan 2026',
    ...overrides,
  };
}

describe('RoadmapTimeline', () => {
  it('renders without crashing', () => {
    const html = renderToStaticMarkup(
      React.createElement(RoadmapTimeline, { steps: [buildStep({ key: 1 })] })
    );
    expect(html).toContain('Step 1');
  });

  it('renders one TimelineItem per step, in order', () => {
    const steps = [buildStep({ key: 1, title: 'First' }), buildStep({ key: 2, title: 'Second' })];
    const html = renderToStaticMarkup(React.createElement(RoadmapTimeline, { steps }));
    expect(html.indexOf('First')).toBeLessThan(html.indexOf('Second'));
  });

  it('renders each step title, description, and date', () => {
    const step = buildStep({
      key: 1,
      title: 'Launch',
      description: 'Ship the first release',
      date: 'Jun 2026',
    });
    const html = renderToStaticMarkup(React.createElement(RoadmapTimeline, { steps: [step] }));
    expect(html).toContain('Launch');
    expect(html).toContain('Ship the first release');
    expect(html).toContain('Jun 2026');
  });

  it('renders the step icon inside its TimelineDot', () => {
    const step = buildStep({
      key: 1,
      icon: React.createElement('span', { 'data-testid': 'icon' }, '★'),
    });
    const html = renderToStaticMarkup(React.createElement(RoadmapTimeline, { steps: [step] }));
    expect(html).toContain('data-testid="icon"');
  });

  it('defaults the dot color to primary when a step has no color', () => {
    const step = buildStep({ key: 1, color: undefined });
    const html = renderToStaticMarkup(React.createElement(RoadmapTimeline, { steps: [step] }));
    expect(html).toContain('MuiTimelineDot-filledPrimary');
  });

  it('uses the requested color when a step is not done', () => {
    const step = buildStep({ key: 1, color: 'warning', done: false });
    const html = renderToStaticMarkup(React.createElement(RoadmapTimeline, { steps: [step] }));
    expect(html).toContain('MuiTimelineDot-filledWarning');
  });

  it('overrides to success color when a step is done', () => {
    const step = buildStep({ key: 1, color: 'error', done: true });
    const html = renderToStaticMarkup(React.createElement(RoadmapTimeline, { steps: [step] }));
    expect(html).toContain('MuiTimelineDot-filledSuccess');
  });

  it('renders detail bullets when a step has details', () => {
    const step = buildStep({ key: 1, details: ['First detail', 'Second detail'] });
    const html = renderToStaticMarkup(React.createElement(RoadmapTimeline, { steps: [step] }));
    expect(html).toContain('First detail');
    expect(html).toContain('Second detail');
  });

  it('does not render a detail list when a step has no details', () => {
    const step = buildStep({ key: 1, details: undefined });
    const html = renderToStaticMarkup(React.createElement(RoadmapTimeline, { steps: [step] }));
    // The Timeline root itself is a <ul> — count occurrences rather than
    // asserting absence, so this only catches an extra <ul> from the detail list.
    const ulCount = (html.match(/<ul[ >]/g) ?? []).length;
    expect(ulCount).toBe(1);
  });

  it('applies a distinct sx-driven class to scenario steps vs regular steps', () => {
    // Style VALUES (e.g. "1px dashed") are covered by roadmap-timeline.styles.test.ts;
    // this only verifies the component actually wires isScenario through to a
    // different generated class, without depending on emotion's server-side
    // <style> tag emission being present on every renderToStaticMarkup call.
    const scenarioHtml = renderToStaticMarkup(
      React.createElement(RoadmapTimeline, { steps: [buildStep({ key: 1, isScenario: true })] })
    );
    const regularHtml = renderToStaticMarkup(
      React.createElement(RoadmapTimeline, { steps: [buildStep({ key: 2, isScenario: false })] })
    );
    const extractContentClass = (html: string) => /MuiTimelineContent-root[^"]*"/.exec(html)?.[0];
    expect(extractContentClass(scenarioHtml)).not.toBe(extractContentClass(regularHtml));
  });

  it('renders the scenario label badge when scenarioLabel is provided', () => {
    const step = buildStep({ key: 1, isScenario: true, scenarioLabel: 'Scenario A' });
    const html = renderToStaticMarkup(React.createElement(RoadmapTimeline, { steps: [step] }));
    expect(html).toContain('Scenario A');
  });

  it('does not render a scenario badge when isScenario is false, even with a scenarioLabel', () => {
    const step = buildStep({ key: 1, isScenario: false, scenarioLabel: 'Scenario A' });
    const html = renderToStaticMarkup(React.createElement(RoadmapTimeline, { steps: [step] }));
    expect(html).not.toContain('Scenario A');
  });

  it('does not render a connector after the last step', () => {
    const steps = [buildStep({ key: 1 }), buildStep({ key: 2 })];
    const html = renderToStaticMarkup(React.createElement(RoadmapTimeline, { steps }));
    // Match the rendered element itself, not the emotion <style> tag whose
    // data-emotion attribute and CSS class selector also contain this substring.
    const connectorCount = (html.match(/<span class="MuiTimelineConnector-root/g) ?? []).length;
    expect(connectorCount).toBe(1);
  });

  it('forwards the position prop to the underlying Timeline root', () => {
    const html = renderToStaticMarkup(
      React.createElement(RoadmapTimeline, { steps: [buildStep({ key: 1 })], position: 'left' })
    );
    expect(html).toContain('MuiTimeline-positionLeft');
  });

  it('forwards arbitrary props (className) to the root element', () => {
    const html = renderToStaticMarkup(
      React.createElement(RoadmapTimeline, {
        steps: [buildStep({ key: 1 })],
        className: 'custom-class',
      })
    );
    expect(html).toContain('custom-class');
  });

  it('forwards ref to the root element', () => {
    let receivedRef: HTMLUListElement | null = null;
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);
    act(() => {
      root.render(
        React.createElement(RoadmapTimeline, {
          steps: [buildStep({ key: 1 })],
          ref: (el: HTMLUListElement | null) => {
            receivedRef = el;
          },
        })
      );
    });
    expect(receivedRef).not.toBeNull();
    expect((receivedRef as HTMLElement | null)?.tagName).toBe('UL');
    document.body.removeChild(container);
  });
});
