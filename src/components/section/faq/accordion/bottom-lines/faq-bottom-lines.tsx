import { FaqFloatLine, FaqFloatPlusIcon } from '../accordion-svg';
import { FAQ_PLUS_ICON_LEFT } from './faq-bottom-lines.const';

// ----------------------------------------------------------------------

/**
 * Decorative bottom-edge elements for `FaqSection`.
 * Renders horizontal float lines and plus icons that frame the contact footer.
 *
 * @internal — used by `FaqSection` only.
 *
 * **Quality status (28 Aug 2026):** DoD 11/12 · Best practices 13/13 — SonarQube not yet run
 */
export function FaqBottomLines() {
  return (
    <>
      <FaqFloatLine sx={{ top: 0, left: 0 }} />
      <FaqFloatLine sx={{ bottom: 0, left: 0 }} />
      <FaqFloatPlusIcon sx={{ top: -8, left: FAQ_PLUS_ICON_LEFT }} />
      <FaqFloatPlusIcon sx={{ bottom: -8, left: FAQ_PLUS_ICON_LEFT }} />
    </>
  );
}

FaqBottomLines.displayName = 'FaqBottomLines';
