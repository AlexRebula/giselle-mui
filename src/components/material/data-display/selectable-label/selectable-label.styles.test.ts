// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import type { Theme } from '@mui/material/styles';

import { selectableLabelSx } from './selectable-label.styles';

// ----------------------------------------------------------------------

type StyleFn = (theme: Theme) => Record<string, unknown>;

const mockTheme = {
  vars: {
    palette: {
      primary: { main: '#1976d2' },
      text: { primary: '#212b36' },
      action: { selected: 'rgba(33 43 54 / 0.08)' },
    },
  },
  transitions: {
    create: () => 'background-color 150ms',
    duration: { shorter: 150 },
  },
} as unknown as Theme;

describe('selectableLabelSx', () => {
  it('sets an explicit text color in both selected and unselected states', () => {
    expect((selectableLabelSx(false) as unknown as StyleFn)(mockTheme).color).toBe(
      mockTheme.vars!.palette.text.primary
    );
    expect((selectableLabelSx(true) as unknown as StyleFn)(mockTheme).color).toBe(
      mockTheme.vars!.palette.text.primary
    );
  });

  it('has no boxShadow when not selected', () => {
    const styles = (selectableLabelSx(false) as unknown as StyleFn)(mockTheme);
    expect(styles.boxShadow).toBeUndefined();
  });

  it('applies selection ring via boxShadow when selected', () => {
    const styles = (selectableLabelSx(true) as unknown as StyleFn)(mockTheme);
    expect(String(styles.boxShadow)).toContain('0 0 0 1.5px');
    expect(String(styles.boxShadow)).toContain(mockTheme.vars!.palette.text.primary);
  });

  it('does not tint the background when not selected', () => {
    const styles = (selectableLabelSx(false) as unknown as StyleFn)(mockTheme);
    expect(styles.bgcolor).toBeUndefined();
  });

  it('tints the background with the selected palette token when selected', () => {
    const styles = (selectableLabelSx(true) as unknown as StyleFn)(mockTheme);
    expect(styles.bgcolor).toBe(mockTheme.vars!.palette.action.selected);
  });

  it.todo('asserts selectableLabelIconSx has the expected fontSize/color for the checkmark');
});
