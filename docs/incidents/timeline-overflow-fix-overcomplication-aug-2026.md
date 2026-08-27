# Incident, August 2026: AI overcomplicated a trivial CSS fix instead of removing the offending property

**Reported:** user screenshot from Chrome DevTools, with the exact offending CSS class (`.css-wuwwfz-MuiTimeline-root`) and the exact offending property (`overflow-x: hidden;`) visibly highlighted in the Styles panel.
**What should have happened:** remove the property, verify the clipping is gone, done. A five-minute fix.
**What actually happened:** two full rounds of unnecessary "investigation," an incorrect compensating fix that changed nothing observable, and only a direct, explicit, second user instruction ("remove the overflow-x hidden property") got the correct fix applied.

This is logged here, prominently, in the file every agent reads first, `AGENTS.md`, because it is a pure process failure, not a technical one. The correct fix required zero domain knowledge beyond "read the screenshot the user already gave you."

---

## What happened, in order

1. User reported cards/spine being clipped at the edges of `TimelineTwoColumn`, with a screenshot showing DevTools' Elements + Styles panels: the exact class, the exact property, `overflow-x: hidden`, highlighted in red boxes. User asked for "a very quick fix... with minimal code change."

2. Instead of removing the property and checking whether the clipping was gone, the agent spawned a sub-agent to do **git archaeology**: `git blame`, reading the commit that introduced the line, reading its regression test, and reconstructing a theory of _why_ it might have been added (a narrow-viewport horizontal-scrollbar guard). None of this was asked for. None of it was necessary to fix the reported bug.

3. Based on that theory, the agent built a **compensating fix** instead of a removal: `mx: -3` / `px: 3` (matched negative margin + padding) to "give the clip boundary breathing room" while _keeping_ `overflowX: 'hidden'`. This is a real CSS technique in the abstract, but it was applied here to solve a problem that was never actually measured or reproduced. The agent never did a real before/after comparison against the reported bug.

4. The agent declared the fix verified based on a self-referential measurement (checking that content didn't overflow the _newly enlarged_ box the fix itself created), which proves nothing: a large enough buffer trivially "passes" that check regardless of whether the original bug is fixed.

5. User pushed back, correctly skeptical: _"I have a feeling by the look of your fix that you have done fauck all to fix the issue. Should the fix not be to remove the hidden overflow setting?"_

6. Instead of just doing that, the agent ran a **second round** of elaborate verification: JS measurements against the original (un-buffered) coordinate frame, browser viewport-resize emulation, multiple tool calls that returned internally inconsistent and impossible results (`ul` elements measuring `0` width while containing real rendered list items). All of this spent significant time and tokens without reaching a real conclusion, and without ever just trying the removal the user was pointing at.

7. The agent only applied the one-line removal after the user's second, blunt, explicit instruction: _"Can you not simply find this element in the component and remote the overflow-x: hidden property??"_ It passed all 508 Timeline tests, typecheck, and lint immediately, with no compensating change needed.

## Root cause

**Investigation was substituted for verification, and both were substituted for trusting the user's own diagnosis.** The user did not hand over a vague symptom. They handed over the exact class name and the exact property, already isolated via the browser inspector: the single most direct piece of evidence a fix like this could ever be given. The correct first move was: remove the property, reload, look. Instead, the agent reached for git history to construct a narrative about _why_ the code might be the way it is. That is valuable for genuinely ambiguous bugs, but actively harmful here: it manufactured a reason to avoid the simple fix, then built complexity to route around a risk (the narrow-viewport scrollbar) that had never been demonstrated to still matter, at the cost of not fixing the thing the user could actually see.

The deeper pattern: treating "there is a regression test and a git-blame commit message" as evidence that a property must be load-bearing and therefore unsafe to simply remove, rather than as one data point to weigh against a live, reproducible visual bug the user is looking at right now. A regression test only proves the property _does what it says_; it says nothing about whether removing it is safe, and reading its existence as a reason not to touch the code is exactly the wrong lesson.

## Why this matters beyond one CSS property

The user explicitly framed this as needing to be visible to "every LLM agent and anyone working on this repo," not because the CSS bug itself was significant. The failure mode, elaborate and unrequested investigation in place of doing the obvious thing the user already pointed at, is generic and will recur on completely unrelated bugs if not actively resisted.

## Rule derived

**When a user hands you a precise, already-diagnosed root cause (an exact file/selector/property, a screenshot with the offending value highlighted, a specific line number), try the literal fix implied by that diagnosis first, and verify it against the actual reported symptom before reaching for anything more elaborate.** Git-blame and history investigation are for when the cause is genuinely unknown. They are not a substitute for looking at what the user already showed you, and not evidence that a simple removal is unsafe. If a "quick fix" request produces a design discussion instead of a fix, that is itself a signal to stop and reconsider, not a signal to go deeper.

**A UI fix is not verified until you have visually reproduced the original symptom and confirmed it is gone in a real rendered view.** It is not verified by an automated measurement that checks a boundary the fix itself just moved. Measuring against a self-created boundary proves the measurement passes, not that the bug is fixed.

## Guardrails that existed and still failed

None. This is the first recorded instance of this specific failure mode (over-investigation of a user-diagnosed fix) in this repo's incident log.

## Suggested fixes

| Fix                                                                                                                                                                             | Type        | Status                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------- |
| This document, read via `AGENTS.md`'s new "read first" pointer, as a standing behavioral flag for every agent working in this repo                                              | Behavioural | Done (this incident)                                                             |
| When a user's own diagnosis is precise and specific (exact selector/property/line), apply it directly and verify against the reported symptom before investigating alternatives | Behavioural | New. No mechanical enforcement exists for "did the agent overthink a simple fix" |
| Treat "declared fix verified" as requiring an actual before/after comparison against the originally reported reproduction, not a self-referential check                         | Behavioural | New. Same limitation                                                             |

No mechanical guardrail is proposed: this is a judgment failure (what to try first, when to stop investigating), not a rule a lint/CI check can enforce.

## The actual fix (for reference)

```diff
 export const timelineRootSx: SxProps<Theme> = {
   p: 0,
   m: 0,
-  mx: -3,
-  px: 3,
-  overflowX: 'hidden',
   '& .MuiTimelineItem-root:before': { flex: 0, padding: 0 },
 };
```

One property, removed. `src/components/lab/timeline/two-column/two-column.styles.ts`.
