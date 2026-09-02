// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import type { Theme } from '@mui/material/styles';

import {
  photoImgSx,
  detailBulletsRowSx,
  statusBadgeWrapperSx,
  newStatusDotSx,
  newStatusLabelSx,
  activeDotSx,
  activeStatusLabelSx,
  detailCountPillSx,
  logoStripSx,
  clientLogoSx,
  platformStripSx,
  projectLogoSx,
  buildPaperSx,
  buildDateTypographySx,
  pillIconBoxSx,
  phaseCardRootSx,
  phaseContentRowSx,
  phaseContentColumnSx,
  phaseTitleSx,
  phasePillTextSx,
  phaseDescriptionSx,
  phaseFooterSlotSx,
} from './phase-card.styles';

const mockTheme = {
  vars: {
    palette: {
      primary: { main: '#2E7D32', mainChannel: '46 125 50' },
      grey: { '500Channel': '145 158 171', '900Channel': '33 43 54' },
      error: { mainChannel: '211 47 47' },
    },
  },
} as unknown as Theme;

// ---------------------------------------------------------------------------
// photoImgSx — first-photo vs subsequent-photo margin
// ---------------------------------------------------------------------------

describe('photoImgSx — photo image sx factory', () => {
  it('first photo gets mt: 2 (breathing room after description)', () => {
    const styles = photoImgSx(true) as Record<string, unknown>;
    expect(styles['mt']).toBe(2);
  });

  it('subsequent photos get mt: 1 (tighter gap within the strip)', () => {
    const styles = photoImgSx(false) as Record<string, unknown>;
    expect(styles['mt']).toBe(1);
  });

  it('all photos share the same base styles regardless of position', () => {
    const first = photoImgSx(true) as Record<string, unknown>;
    const second = photoImgSx(false) as Record<string, unknown>;

    expect(first['width']).toBe('100%');
    expect(second['width']).toBe('100%');
    expect(first['maxWidth']).toBe(200);
    expect(second['maxWidth']).toBe(200);
    expect(first['display']).toBe('block');
    expect(second['display']).toBe('block');
  });

  it('[regression] first photo margin is 2, not 1 — prevents missing breathing room', () => {
    expect((photoImgSx(true) as Record<string, unknown>)['mt']).toBe(2);
    expect((photoImgSx(false) as Record<string, unknown>)['mt']).toBe(1);
    expect((photoImgSx(true) as Record<string, unknown>)['mt']).not.toBe(
      (photoImgSx(false) as Record<string, unknown>)['mt']
    );
  });
});

// ---------------------------------------------------------------------------
// detailBulletsRowSx — unused sibling of detailBulletsContainerSx (now owned
// by card-detail-bullets/); kept here since it has no importer of its own.
// ---------------------------------------------------------------------------

describe('detailBulletsRowSx — individual bullet row', () => {
  it('is flex row with left-aligned text', () => {
    const sx = detailBulletsRowSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['alignItems']).toBe('flex-start');
    expect(sx['textAlign']).toBe('left');
  });
});

// ---------------------------------------------------------------------------
// statusBadgeWrapperSx — shared NewBadge / ActiveBadge row wrapper
// ---------------------------------------------------------------------------

describe('statusBadgeWrapperSx — badge row wrapper', () => {
  it('is a flex row with bottom margin', () => {
    const sx = statusBadgeWrapperSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['alignItems']).toBe('center');
    expect(sx['mb']).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// newStatusDotSx / activeDotSx — pulsing status dots
// ---------------------------------------------------------------------------

describe('newStatusDotSx — NewBadge pulsing dot', () => {
  it('is circular with the given size', () => {
    const styles = newStatusDotSx(12) as Record<string, unknown>;
    expect(styles['width']).toBe(12);
    expect(styles['height']).toBe(12);
    expect(styles['borderRadius']).toBe('50%');
  });

  it('[regression] minimum dot size is 12px', () => {
    // Smaller dots fall below the 12px minimum readability size (copilot-instructions.md).
    const styles = newStatusDotSx(12) as Record<string, unknown>;
    expect(Number(styles['width'])).toBeGreaterThanOrEqual(12);
    // Width must be a static value, not a function (no theme callback on this factory)
    expect(typeof styles['width']).not.toBe('function');
  });

  it('applies success-main color (always green for New)', () => {
    const styles = newStatusDotSx(12) as Record<string, unknown>;
    expect(styles['bgcolor']).toBe('success.main');
  });

  it('contains a pulse animation', () => {
    const styles = newStatusDotSx(12) as Record<string, unknown>;
    expect(String(styles['animation'])).toContain('1.4s');
  });
});

describe('activeDotSx — ActiveBadge pulsing dot', () => {
  it('uses the dynamic color prop for bgcolor', () => {
    const styles = activeDotSx('primary', 12) as Record<string, unknown>;
    expect(styles['bgcolor']).toBe('primary.main');
  });

  it('[regression] minimum dot size is 12px', () => {
    const styles = activeDotSx('info', 12) as Record<string, unknown>;
    expect(Number(styles['width'])).toBeGreaterThanOrEqual(12);
  });
});

// ---------------------------------------------------------------------------
// newStatusLabelSx / activeStatusLabelSx — badge typography
// ---------------------------------------------------------------------------

describe('newStatusLabelSx — NewBadge label', () => {
  it('[regression] font size is at least 0.75rem (badge minimum)', () => {
    const sx = newStatusLabelSx as Record<string, unknown>;
    expect(sx['fontSize']).toBe('0.75rem');
  });

  it('is success-colored', () => {
    const sx = newStatusLabelSx as Record<string, unknown>;
    expect(sx['color']).toBe('success.main');
  });
});

describe('activeStatusLabelSx — ActiveBadge label', () => {
  it('[regression] font size is at least 0.75rem (badge minimum)', () => {
    const styles = activeStatusLabelSx('primary') as Record<string, unknown>;
    expect(styles['fontSize']).toBe('0.75rem');
  });

  it('uses the dynamic color for text', () => {
    expect((activeStatusLabelSx('error') as Record<string, unknown>)['color']).toBe('error.main');
  });
});

// ---------------------------------------------------------------------------
// detailCountPillSx — detail count pill
// ---------------------------------------------------------------------------

describe('detailCountPillSx — collapsed detail-count pill', () => {
  it('is inline-flex with action.hover background', () => {
    const sx = detailCountPillSx as Record<string, unknown>;
    expect(sx['display']).toBe('inline-flex');
    expect(sx['bgcolor']).toBe('action.hover');
    expect(sx['color']).toBe('text.secondary');
  });
});

// ---------------------------------------------------------------------------
// logoStripSx / platformStripSx — logo containers
// ---------------------------------------------------------------------------

describe('logoStripSx — clients/projects logo strip', () => {
  it('is flex-wrap with gap 2.5', () => {
    const sx = logoStripSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexWrap']).toBe('wrap');
    expect(sx['gap']).toBe(2.5);
  });
});

describe('platformStripSx — tech platform strip', () => {
  it('is flex-wrap with tighter gap 1', () => {
    const sx = platformStripSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexWrap']).toBe('wrap');
    expect(sx['gap']).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// clientLogoSx / projectLogoSx — logo images
// ---------------------------------------------------------------------------

describe('clientLogoSx — client logo image', () => {
  it('is contained, greyscale, 40px tall', () => {
    const sx = clientLogoSx as Record<string, unknown>;
    expect(sx['height']).toBe(40);
    expect(sx['objectFit']).toBe('contain');
    expect(sx['filter']).toBe('grayscale(1)');
  });

  it('removes grayscale on hover', () => {
    const hover = (clientLogoSx as Record<string, unknown>)['&:hover'] as
      Record<string, unknown> | undefined;
    expect(hover?.['filter']).toBe('none');
    expect(hover?.['opacity']).toBe(1);
  });
});

describe('projectLogoSx — project logo image', () => {
  it('is contained, 28px tall with opacity', () => {
    const sx = projectLogoSx as Record<string, unknown>;
    expect(sx['height']).toBe(28);
    expect(sx['objectFit']).toBe('contain');
    expect(sx['opacity']).toBe(0.85);
  });
});

// ---------------------------------------------------------------------------
// Done card hover behavior — regression (production sx assertion)
// ---------------------------------------------------------------------------

describe('[regression] done phase card hover styles from buildPaperSx', () => {
  it('done card uses dimmed base state and restores on hover', () => {
    const sxFactory = buildPaperSx({
      hasDetails: true,
      isDone: true,
      color: 'primary',
      phaseSide: 'right',
      isHighlighted: false,
      isScenario: false,
      isOverdue: false,
      suppressElevation: false,
      textAlign: 'left',
    }) as (theme: Theme) => Record<string, unknown>;

    const sx = sxFactory(mockTheme);
    expect(sx['opacity']).toBe(0.45);
    expect(sx['filter']).toBe('grayscale(1)');

    const hover = sx['&:hover'] as Record<string, unknown>;
    expect(hover['opacity']).toBe(1);
    expect(hover['filter']).toBe('none');
  });

  it('done state does not declare pointerEvents override in buildPaperSx', () => {
    const sxFactory = buildPaperSx({
      hasDetails: true,
      isDone: true,
      color: 'primary',
      phaseSide: 'right',
      isHighlighted: false,
      isScenario: false,
      isOverdue: false,
      suppressElevation: false,
      textAlign: 'left',
    }) as (theme: Theme) => Record<string, unknown>;

    const sx = sxFactory(mockTheme);
    expect(sx['pointerEvents']).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// phaseCardRootSx / phaseContentRowSx / phaseContentColumnSx
// ---------------------------------------------------------------------------

describe('phaseCardRootSx — root Box wrapper', () => {
  it('establishes a positioning context for absolutely-positioned badges', () => {
    expect(phaseCardRootSx).toMatchObject({
      position: 'relative',
    });
  });
});

describe('phaseContentRowSx — title content row', () => {
  it('is a flex row with top-aligned content', () => {
    expect(phaseContentRowSx).toMatchObject({
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1,
    });
  });
});

describe('phaseContentColumnSx — title content column', () => {
  it('takes the remaining width in the content row', () => {
    expect(phaseContentColumnSx).toMatchObject({
      flex: 1,
    });
  });
});

// ---------------------------------------------------------------------------
// phaseTitleSx — dynamic title sx (padding + margin depend on card state)
// ---------------------------------------------------------------------------

describe('phaseTitleSx — phase title typography', () => {
  it('reserves right padding for the corner icon unless highlighted or decoration is hidden', () => {
    const styles = phaseTitleSx({
      isHighlighted: false,
      hideDecoration: false,
      hasDetails: false,
    }) as Record<string, unknown>;
    expect(styles['pr']).toBe(6);
  });

  it('omits right padding when highlighted', () => {
    const styles = phaseTitleSx({
      isHighlighted: true,
      hideDecoration: false,
      hasDetails: false,
    }) as Record<string, unknown>;
    expect(styles['pr']).toBe(0);
  });

  it('omits right padding when decoration is hidden', () => {
    const styles = phaseTitleSx({
      isHighlighted: false,
      hideDecoration: true,
      hasDetails: false,
    }) as Record<string, unknown>;
    expect(styles['pr']).toBe(0);
  });

  it('uses a tighter bottom margin when a details pill follows', () => {
    const styles = phaseTitleSx({
      isHighlighted: false,
      hideDecoration: false,
      hasDetails: true,
    }) as Record<string, unknown>;
    expect(styles['mb']).toBe(0.5);
  });

  it('uses a larger bottom margin with no details pill', () => {
    const styles = phaseTitleSx({
      isHighlighted: false,
      hideDecoration: false,
      hasDetails: false,
    }) as Record<string, unknown>;
    expect(styles['mb']).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// phasePillTextSx / phaseDescriptionSx / phaseFooterSlotSx
// ---------------------------------------------------------------------------

describe('phasePillTextSx — details-count pill label', () => {
  it('[regression] font size meets badge-label minimum of 0.75rem', () => {
    expect(phasePillTextSx).toMatchObject({
      fontWeight: 600,
      lineHeight: 1,
      fontSize: '0.75rem',
    });
  });
});

describe('phaseDescriptionSx — expanded description text', () => {
  it('uses secondary text color with top margin', () => {
    expect(phaseDescriptionSx).toMatchObject({
      color: 'text.secondary',
      mt: 0.5,
    });
  });
});

describe('phaseFooterSlotSx — optional footer slot', () => {
  it('adds top margin above the footer content', () => {
    expect(phaseFooterSlotSx).toMatchObject({
      mt: 1,
    });
  });
});

describe('buildDateTypographySx — phase date label', () => {
  const base = { isScenario: false, isHighlighted: false, hideDecoration: false, color: undefined };

  it('uses a bold, larger, color-tinted style for scenario phases', () => {
    const styles = buildDateTypographySx({ ...base, isScenario: true, color: 'warning' });
    expect(styles.fontSize).toBe('0.875rem');
    expect(styles.fontWeight).toBe(800);
    expect(styles.color).toBe('warning.main');
  });

  it('defaults the scenario color to primary when none is given', () => {
    const styles = buildDateTypographySx({ ...base, isScenario: true, color: undefined });
    expect(styles.color).toBe('primary.main');
  });

  it('uses a muted, smaller style for non-scenario phases', () => {
    const styles = buildDateTypographySx({ ...base, isScenario: false });
    expect(styles.fontSize).toBe('0.8rem');
    expect(styles.fontWeight).toBeUndefined();
    expect(styles.color).toBe('text.disabled');
  });

  it('reserves right padding for the corner decoration unless highlighted or hidden', () => {
    expect(buildDateTypographySx({ ...base }).pr).toBe(6);
    expect(buildDateTypographySx({ ...base, isHighlighted: true }).pr).toBe(0);
    expect(buildDateTypographySx({ ...base, hideDecoration: true }).pr).toBe(0);
  });
});

describe('pillIconBoxSx — inline icon slot inside pill badges', () => {
  it('forces the inner svg to the exact requested icon size', () => {
    const styles = pillIconBoxSx(16) as Record<string, unknown>;
    expect(styles['& svg']).toEqual({ width: 16, height: 16 });
  });

  it('never shrinks inside its flex container', () => {
    const styles = pillIconBoxSx(16) as Record<string, unknown>;
    expect(styles['flexShrink']).toBe(0);
  });
});
