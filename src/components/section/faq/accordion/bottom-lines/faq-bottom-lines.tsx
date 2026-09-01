import { FaqFloatLine, FaqFloatPlusIcon } from '../accordion-svg';
import { floatLineEdgeSx, floatPlusIconEdgeSx } from './faq-bottom-lines.styles';

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
      <FaqFloatLine sx={floatLineEdgeSx('top')} />
      <FaqFloatLine sx={floatLineEdgeSx('bottom')} />
      <FaqFloatPlusIcon sx={floatPlusIconEdgeSx('top')} />
      <FaqFloatPlusIcon sx={floatPlusIconEdgeSx('bottom')} />
    </>
  );
}

FaqBottomLines.displayName = 'FaqBottomLines';
