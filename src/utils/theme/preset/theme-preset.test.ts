// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { grey } from '@mui/material/colors';

import { hexToChannel } from '../theme-utils/theme-utils';
import {
  GISELLE_PRIMARY_DARK_MAIN,
  GISELLE_PRIMARY_MAIN,
  GISELLE_SECONDARY_MAIN,
  giselleTheme,
} from './theme-preset';

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;

// ----------------------------------------------------------------------

describe('palette constants', () => {
  it('GISELLE_PRIMARY_MAIN is a valid 6-digit hex colour', () => {
    expect(GISELLE_PRIMARY_MAIN).toMatch(HEX_REGEX);
  });

  it('GISELLE_PRIMARY_DARK_MAIN is a valid 6-digit hex colour', () => {
    expect(GISELLE_PRIMARY_DARK_MAIN).toMatch(HEX_REGEX);
  });

  it('GISELLE_SECONDARY_MAIN is a valid 6-digit hex colour', () => {
    expect(GISELLE_SECONDARY_MAIN).toMatch(HEX_REGEX);
  });

  it('light-mode and dark-mode primaries are different (dark mode is lighter)', () => {
    expect(GISELLE_PRIMARY_MAIN).not.toBe(GISELLE_PRIMARY_DARK_MAIN);
  });

  it('GISELLE_PRIMARY_MAIN is Deep grove green', () => {
    expect(GISELLE_PRIMARY_MAIN).toBe('#2E7D32');
  });

  it('GISELLE_PRIMARY_DARK_MAIN is Lime green', () => {
    expect(GISELLE_PRIMARY_DARK_MAIN).toBe('#76C442');
  });

  it('GISELLE_SECONDARY_MAIN is Mango gold', () => {
    expect(GISELLE_SECONDARY_MAIN).toBe('#F5A623');
  });
});

// ----------------------------------------------------------------------

describe('giselleTheme', () => {
  // Non-null assertions are safe: extendTheme always populates both schemes
  // when colorSchemes.light and .dark are explicitly provided.
  const light = giselleTheme.colorSchemes.light!;
  const dark = giselleTheme.colorSchemes.dark!;

  it('is defined and is an object', () => {
    expect(giselleTheme).toBeDefined();
    expect(typeof giselleTheme).toBe('object');
  });

  it('both light and dark colour schemes are present', () => {
    expect(light).toBeDefined();
    expect(dark).toBeDefined();
  });

  it('light palette primary.main matches GISELLE_PRIMARY_MAIN', () => {
    expect(light.palette.primary.main).toBe(GISELLE_PRIMARY_MAIN);
  });

  it('dark palette primary.main matches GISELLE_PRIMARY_DARK_MAIN', () => {
    expect(dark.palette.primary.main).toBe(GISELLE_PRIMARY_DARK_MAIN);
  });

  it('secondary.main is Mango gold in both light and dark schemes', () => {
    expect(light.palette.secondary.main).toBe(GISELLE_SECONDARY_MAIN);
    expect(dark.palette.secondary.main).toBe(GISELLE_SECONDARY_MAIN);
  });

  it('all six palette keys present in light scheme', () => {
    expect(light.palette.primary.main).toBeDefined();
    expect(light.palette.secondary.main).toBeDefined();
    expect(light.palette.info.main).toBeDefined();
    expect(light.palette.success.main).toBeDefined();
    expect(light.palette.warning.main).toBeDefined();
    expect(light.palette.error.main).toBeDefined();
  });

  it('all six palette keys present in dark scheme', () => {
    expect(dark.palette.primary.main).toBeDefined();
    expect(dark.palette.secondary.main).toBeDefined();
    expect(dark.palette.info.main).toBeDefined();
    expect(dark.palette.success.main).toBeDefined();
    expect(dark.palette.warning.main).toBeDefined();
    expect(dark.palette.error.main).toBeDefined();
  });

  it('all palette main values are valid 6-digit hex colours', () => {
    const keys = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;
    for (const key of keys) {
      expect(light.palette[key].main).toMatch(HEX_REGEX);
      expect(dark.palette[key].main).toMatch(HEX_REGEX);
    }
  });

  it('success.main is distinct from primary.main (no visual ambiguity)', () => {
    expect(light.palette.success.main).not.toBe(GISELLE_PRIMARY_MAIN);
  });
});

// ----------------------------------------------------------------------
// Regression test for issue #190: an unset `colorSchemeSelector` silently
// defaults to `'media'` in `extendTheme()`, under which MUI's `setMode`
// (what `GiselleThemeProvider`'s `defaultMode` prop drives) has no effect —
// a consumer passing `defaultMode="light"` would silently keep tracking the
// OS/browser `prefers-color-scheme` instead. Pinning the non-`'media'` value
// here guards against that regression re-appearing at the theme-options
// level; the behavioural half (the attribute actually flips) is covered in
// `giselle.test.ts`.
describe('giselleTheme — colorSchemeSelector (issue #190)', () => {
  it('does not default to "media" (which would make defaultMode overrides a no-op)', () => {
    expect(giselleTheme.colorSchemeSelector).not.toBe('media');
  });

  it('uses the data-mui-color-scheme attribute documented in docs/theming/nextjs.md', () => {
    expect(giselleTheme.colorSchemeSelector).toBe('data-mui-color-scheme');
  });
});

// ----------------------------------------------------------------------
// Regression test for issue #185: `--mui-palette-grey-500Channel` never
// existed in the generated CSS-vars stylesheet. `extendTheme()` only
// auto-generates `*Channel` tokens for palette entries shaped like a
// `PaletteColor` (anything with a `.main`), plus a short hardcoded list
// (`background.default/paper`, `common.background/onBackground`, `divider`,
// `text.primary/secondary`, `action.active/selected`) — `grey` is not among
// them. Every `channelAlpha(GREY_500_CHANNEL, …)` call across the component
// library (feature-flow, faq-accordion, timeline pieces, status-label, …)
// therefore compiled to `rgba(var(--mui-palette-grey-500Channel) / alpha)`,
// an invalid value (unresolved custom property) that browsers silently drop
// — the declaration falls back to its initial value instead of erroring, so
// the box-shadow/background-tint simply never appeared. Confirmed live via
// Storybook + DevTools `getComputedStyle` before writing this test: the
// variable was present nowhere in the generated `:root, .mode-light` (or
// `.mode-dark`) rule, unlike `--mui-palette-grey-500` itself (the plain hex,
// which */is/* auto-generated for every shade).
describe('giselleTheme — grey Channel token (issue #185)', () => {
  const light = giselleTheme.colorSchemes.light!;
  const dark = giselleTheme.colorSchemes.dark!;
  const RGB_CHANNEL_REGEX = /^\d{1,3} \d{1,3} \d{1,3}$/;

  it('exposes grey.500Channel as a space-separated RGB channel string in the light scheme', () => {
    const grey500Channel = (light.palette.grey as unknown as Record<string, string>)['500Channel'];
    expect(grey500Channel).toMatch(RGB_CHANNEL_REGEX);
  });

  it('exposes grey.500Channel as a space-separated RGB channel string in the dark scheme', () => {
    const grey500Channel = (dark.palette.grey as unknown as Record<string, string>)['500Channel'];
    expect(grey500Channel).toMatch(RGB_CHANNEL_REGEX);
  });

  it('grey.500Channel is the RGB decomposition of grey.500 itself', () => {
    const grey500 = light.palette.grey!['500'] as unknown as string;
    const grey500Channel = (light.palette.grey as unknown as Record<string, string>)['500Channel'];
    expect(grey500Channel).toBe(hexToChannel(grey500));
  });

  it('the resolved theme.vars proxy also carries grey.500Channel (what components actually read via `var(--mui-palette-grey-500Channel)`)', () => {
    const varsGrey = giselleTheme.vars?.palette.grey as unknown as Record<string, string>;
    expect(varsGrey['500Channel']).toBeDefined();
    // theme.vars values are `var(--token, fallback)` references, not raw values.
    expect(varsGrey['500Channel']).toContain('--mui-palette-grey-500Channel');
  });

  // The three tests above only walk the in-memory theme object — the actual
  // bug was that the CSS variable never made it into the *generated
  // stylesheet* MUI injects into the page (that's what a real
  // `getComputedStyle()` in a browser reads from). This test exercises the
  // same `generateStyleSheets()` call `CssVarsProvider` uses at runtime, so a
  // future regression in the CSS-var emission path — not just the theme
  // object's shape — would fail here too.
  it('generateStyleSheets() actually emits --mui-palette-grey-500Channel as a real CSS custom property', () => {
    const themeWithStyleSheets = giselleTheme as unknown as {
      generateStyleSheets?: () => Record<string, unknown>[];
    };
    const sheets = themeWithStyleSheets.generateStyleSheets?.();
    const serialized = JSON.stringify(sheets);
    expect(serialized).toContain(`"--mui-palette-grey-500Channel":"${hexToChannel(grey[500])}"`);
  });
});

// ----------------------------------------------------------------------
// Regression test: `common` has the exact same gap #185 fixed for `grey`,
// missed by that fix since it only added the `grey` token.
// `--mui-palette-common-blackChannel`/`whiteChannel` never existed in the
// generated CSS-vars stylesheet either — `common` isn't on `extendTheme()`'s
// auto-generation list any more than `grey` is. `feature-flow-section.
// styles.ts` reads both via `channelAlpha(COMMON_BLACK_CHANNEL/WHITE_CHANNEL,
// …)` for FeatureFlowItemRow's hover/selected box-shadows and
// FeatureFlowHighlightCarousel's scrim/description text — all of which
// silently render as if the declaration were never there. Confirmed live: a
// consumer wrapped only in GiselleThemeProvider (no other MUI theme) had
// `getComputedStyle` report `--mui-palette-common-blackChannel` as an empty
// string on the scrim element, and its `background` computed to fully
// transparent instead of the authored gradient.
describe('giselleTheme — common black/white Channel tokens (issue #185 gap)', () => {
  const light = giselleTheme.colorSchemes.light!;
  const dark = giselleTheme.colorSchemes.dark!;
  const RGB_CHANNEL_REGEX = /^\d{1,3} \d{1,3} \d{1,3}$/;

  it('exposes common.blackChannel and common.whiteChannel as space-separated RGB channel strings in the light scheme', () => {
    const common = light.palette.common as unknown as Record<string, string>;
    expect(common.blackChannel).toMatch(RGB_CHANNEL_REGEX);
    expect(common.whiteChannel).toMatch(RGB_CHANNEL_REGEX);
  });

  it('exposes common.blackChannel and common.whiteChannel as space-separated RGB channel strings in the dark scheme', () => {
    const common = dark.palette.common as unknown as Record<string, string>;
    expect(common.blackChannel).toMatch(RGB_CHANNEL_REGEX);
    expect(common.whiteChannel).toMatch(RGB_CHANNEL_REGEX);
  });

  it('common.blackChannel/whiteChannel are the RGB decomposition of #000000/#ffffff', () => {
    const common = light.palette.common as unknown as Record<string, string>;
    expect(common.blackChannel).toBe(hexToChannel('#000000'));
    expect(common.whiteChannel).toBe(hexToChannel('#ffffff'));
  });

  it('the resolved theme.vars proxy also carries both channels (what components actually read via var(--mui-palette-common-blackChannel/whiteChannel))', () => {
    const varsCommon = giselleTheme.vars?.palette.common as unknown as Record<string, string>;
    expect(varsCommon.blackChannel).toContain('--mui-palette-common-blackChannel');
    expect(varsCommon.whiteChannel).toContain('--mui-palette-common-whiteChannel');
  });

  // Same rationale as the grey-500Channel test above: only a real
  // generateStyleSheets() check catches a regression in the CSS-var
  // emission path itself, not just the in-memory theme object's shape.
  it('generateStyleSheets() actually emits both as real CSS custom properties', () => {
    const themeWithStyleSheets = giselleTheme as unknown as {
      generateStyleSheets?: () => Record<string, unknown>[];
    };
    const sheets = themeWithStyleSheets.generateStyleSheets?.();
    const serialized = JSON.stringify(sheets);
    expect(serialized).toContain(
      `"--mui-palette-common-blackChannel":"${hexToChannel('#000000')}"`
    );
    expect(serialized).toContain(
      `"--mui-palette-common-whiteChannel":"${hexToChannel('#ffffff')}"`
    );
  });
});
