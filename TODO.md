# Build Fix Task - TODO

## Goal
Fix Vercel production build failing due to ESLint errors.

## Steps
- [x] Step 0: Analyze build failure (root cause = ESLint errors in ~46 files: `import/order` and `react/no-unescaped-entities`)
- [x] Step 1: Get user approval on approach (Option A: relax ESLint config)
- [x] Step 2: Update `.eslintrc.json` to disable problematic rules
- [x] Step 3: Fix genuine code issues (unused imports/params)
- [x] Step 4: Verify build passes locally with `npm run build` (build succeeded — all static pages generated)
