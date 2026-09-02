// @vitest-environment jsdom
import { describe, it } from 'vitest';

// Placeholder test file — stubs filled in before implementation begins.
// See README.md and docs/components/timeline/two-column/timeline-plan.md for planned behaviours.

describe('RoadmapTimeline', () => {
  it.todo('renders without crashing');
  it.todo('renders one TimelineItem per step, in order');
  it.todo('renders each step title, description, and date');
  it.todo('renders the step icon inside its TimelineDot');
  it.todo('defaults the dot color to primary when a step has no color');
  it.todo('applies the done color/opacity treatment when a step is done');
  it.todo('renders detail bullets when a step has details');
  it.todo('does not render a detail list when a step has no details');
  it.todo('renders the scenario visual treatment when isScenario is true');
  it.todo('renders the scenario label badge when scenarioLabel is provided');
  it.todo('does not render a connector after the last step');
  it.todo('forwards the position prop to the underlying Timeline root');
  it.todo('forwards arbitrary props (sx, className) to the root element');
  it.todo('forwards ref to the root element');
});
