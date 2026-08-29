# Agent Brief — giselle-mui

Read this file first. It tells you what to read next and in what order before touching anything.

---

## ⚠️ PUBLIC REPOSITORY: read before writing anything

This repo is public and published to npm. Anyone can read every commit, issue, PR, and comment.

**Rules, non-negotiable:**

- **Never reference private repository names, or file paths inside them**, in commits, PR descriptions, issue/PR bodies or comments, or committed docs — not even generically-worded ones that would let a reader infer a private repo's existence or structure. Describe anything sourced from a private context generically instead (e.g. "settled in an internal design session," "a private consuming app").
- `scripts/check-banned-content.js` enforces a private-reference denylist against committed files (`docs/`, `src/`) as a backstop, but it does not cover content posted live via `gh issue`/`gh pr`/`gh api` — that is caught by a separate mechanism outside this repo. Do not treat "the scanner passed" as proof a comment or issue body is clean; check it yourself before posting.

---

## 0. Before fixing anything the user has already diagnosed

Read [`docs/incidents/timeline-overflow-fix-overcomplication-aug-2026.md`](./docs/incidents/timeline-overflow-fix-overcomplication-aug-2026.md) once, now. It records an agent turning a one-line fix (a CSS property the user had already pinpointed via the browser inspector, screenshot and all) into two rounds of unrequested git-archaeology, a compensating fix that changed nothing observable, and only landing the correct fix after the user demanded it a second time, bluntly.

**Rule:** when the user gives you a precise diagnosis, such as an exact selector, property, file, or line, try the literal fix that diagnosis implies first. Verify it against the actual reported symptom before reaching for git blame, regression-test archaeology, or any "safer" alternative design. A `git log` explaining why a line exists is not evidence that removing it is unsafe. It is one data point to weigh against the live bug the user is looking at.

---

## 1. Required reading before building any component

Work through these in order — each document gates the next:

1. **`docs/components/cleanup-workflow.md`** — step-by-step build and cleanup playbook. Phase 0 decides whether a component is a sub-component or standalone; that decision shapes everything else.
2. **`docs/components/api-design-rules.md`** — governs every component API, prop interface, and JSDoc. Defines the tier system (Tier 1 / 2 / 3) and what each tier requires.
3. **`docs/naming-conventions.md`** — PascalCase component names, kebab-case folder names, one component per folder. Non-negotiable.

---

## 2. Current build state

`docs/component-compliance.md` — tracks README, JSDoc, Story JSDoc, and Roadmap compliance per component. Check it before starting work so you know what is already done and what is still outstanding.

---

## 3. Docs entry point

`docs/README.md` — full documentation navigation. Go here to find any doc not linked directly above.

---

## 4. Per-component files

Every component ships two files alongside its source:

- `README.md` — Build Spec (props, variants, usage, constraints)
- `roadmap.md` — open items, planned variants, known gaps

Read both before building or modifying a component.

---

## 5. Quality gate

Run `npm run check:verify` before opening any PR. The pre-push hook enforces this automatically — a push will fail if the gate does not pass.

---

## 6. AI Reviewer Instructions

Load: https://raw.githubusercontent.com/LittleBranches/oss-quality-standards/main/docs/AGENTS.md

Scope: the full document applies to this repo — giselle-mui is the React + MUI component library that document's "Scope — React + MUI (current)" section targets. A bare `/review-pr <N>` without `--standards-url` silently skips these rules; load this file explicitly when reviewing a PR here.
