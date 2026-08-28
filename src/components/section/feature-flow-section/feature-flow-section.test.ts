// @vitest-environment jsdom
import { describe, it } from 'vitest';

// Placeholder test file: stubs filled in before implementation begins.
// See README.md for planned behaviours.

describe('FeatureFlowSection', () => {
  it.todo('renders without crashing');
  it.todo('forwards arbitrary props to the root element');
  it.todo('renders every item passed via the items prop');
  it.todo('renders the sticky image column when an image is provided');
  it.todo('crossfades the image column on item hover');
  it.todo('swaps the displayed image based on scroll direction when scrollImages is provided');
  it.todo('clicking an item with expansion data opens its detail panel');
  it.todo('clicking an expanded item again collapses its detail panel');
  it.todo('renders a metrics grid in the detail panel when the item has metrics');
  it.todo('renders technology chips resolved from the item\'s own {name, icon} pairs');
  it.todo('renders a highlight-card carousel when the item has highlightCards');
  it.todo('an item with no expansion data is not interactive');
  it.todo('the floating sub-nav appears once any item is expanded');
  it.todo('the floating sub-nav does not appear when no item is expanded');
  it.todo('switching between expanded items updates the floating sub-nav active id');
  it.todo('preloads and prewarms every item image');
});
