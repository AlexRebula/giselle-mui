# Storybook deployment to Vercel

> _Set up: Apr 2026_

Storybook is deployed to Vercel automatically every time a PR is merged into `main`.
The deploy only runs if the full quality gate passes — no broken stories can ever go live.

---

## How the pipeline works

```
Developer opens a PR
        │
        ▼
ci.yml runs quality gate on the PR branch
(Prettier → ESLint → tsc → Vitest → tsup build → Storybook build)
        │
        ▼
PR is reviewed and merged into main
        │
        ▼
deploy-storybook.yml triggers (push to main)
        │
        ├─ Job 1: quality-gate (same six checks, runs again on merged code)
        │         if any check fails → deploy job is BLOCKED, old Storybook stays live
        │
        └─ Job 2: deploy (needs: quality-gate)
                  vercel pull → vercel build --prod → vercel deploy --prebuilt --prod
                  ✅ New Storybook is live
```

Two GitHub Actions workflow files in `.github/workflows/`:

| File | Triggers on | What it does |
|---|---|---|
| `ci.yml` | Every push, every PR | Quality gate only |
| `deploy-storybook.yml` | Push to `main` only | Quality gate → Vercel deploy |

---

## What was set up (one-time steps already completed)

### 1. Vercel CLI login

```bash
npm install -g vercel
vercel login   # opens browser OAuth
```

### 2. Vercel project created

```bash
cd giselle-mui
vercel link
```

Answers given at the prompts:

```
? Set up "C:\work\projects\ar\giselle-mui"? → yes
? Which scope should contain your project? → alexrebula's projects
? Link to existing project? → no
? What's your project's name? → giselle-mui-storybook
? In which directory is your code located? → ./
? Want to modify these settings? → no
```

`vercel link` read the existing `vercel.json` and picked up the Storybook build settings automatically:
- Build command: `npm run build-storybook`
- Output directory: `storybook-static`
- Install command: `npm install`

This created `.vercel/project.json` with the project credentials. That file is in `.gitignore`
and must never be committed.

### 3. Vercel auto-deploy disabled

`vercel.json` has `"github": { "enabled": false }`. This prevents Vercel from watching the
GitHub repo and deploying on its own. **Only the GitHub Actions workflow deploys to Vercel.**
This is intentional — it ensures the quality gate always runs before any deploy.

### 4. GitHub repository secrets added

At **github.com/AlexRebula/giselle-mui → Settings → Secrets and variables → Actions**:

| Secret | Value source |
|---|---|
| `VERCEL_TOKEN` | Created at [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | `orgId` field from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` field from `.vercel/project.json` |

The workflow file references these as `${{ secrets.VERCEL_TOKEN }}` etc. — they are never
exposed in logs.

---

## Vercel project details

- **Project name:** `giselle-mui-storybook`
- **Scope:** alexrebula's projects
- **Production URL:** assigned by Vercel after first deploy (visible in Vercel dashboard)

---

## If you need to set this up again (e.g. on a new machine or new project)

```bash
# 1. Login
vercel login

# 2. Link — creates .vercel/project.json
vercel link
# Answer: no to "link to existing", yes to create new, name it giselle-mui-storybook

# 3. Get the IDs
cat .vercel/project.json
# Copy orgId and projectId

# 4. Add secrets to GitHub
# github.com/AlexRebula/giselle-mui → Settings → Secrets → Actions
# VERCEL_TOKEN   → new token from vercel.com/account/tokens
# VERCEL_ORG_ID  → orgId from step 3
# VERCEL_PROJECT_ID → projectId from step 3
```

Everything else (workflows, vercel.json) is already in the repo.

---

## Verifying the deploy ran

After merging a PR into `main`:

1. Go to **github.com/AlexRebula/giselle-mui → Actions**
2. Look for the **Deploy Storybook** workflow run
3. Expand the `deploy` job to see the Vercel deployment URL in the output

Or go directly to the **Vercel dashboard → giselle-mui-storybook** project to see deployment history.

---

## See also

- [`local-development.md`](./local-development.md) — full local dev workflow, HMR setup, the ESM pitfall
- [`.github/workflows/deploy-storybook.yml`](../.github/workflows/deploy-storybook.yml) — the workflow file
- [`vercel.json`](../vercel.json) — Vercel project config
