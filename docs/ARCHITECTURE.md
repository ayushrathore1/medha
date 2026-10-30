# MEDHA architecture — source of truth

This document is the canonical map of which apps are production, which are experimental, and where duplicate auth / search / API code lives. Do not infer ownership from folder names.

Production routing, DNS, and CORS allowlists are **not** changed by documenting this. Cut over only after the migration checklist below is complete.

## Deployment status

| Tree | Role | Status | Evidence |
| --- | --- | --- | --- |
| `medha-frontend/` | Vite + React SPA | **Production frontend** | `vercel.json` SPA rewrites; SEO canonical `https://medha-revision.vercel.app/`; talks to Express via `VITE_BACKEND_URL` |
| `medha-backend/` | Express 5 + Mongoose | **Production API** | CORS allowlist for the live sites; `app.js` is the canonical Express stack (booted by `server.js`) |
| `medha-next/` | Next.js App Router rewrite + Campus Cart | **Experimental / migration** | Create-next-app tree with parallel Route Handlers; not the SEO canonical host |
| `medha-next/backend/` | Copied Express app | **Stale duplicate — do not patch** | 193/209 tracked files still match `medha-backend`; 16 already drifted. Frozen by `scripts/check-backend-drift.js` |
| `Sems/src/` | TanStack Start “Campu” site | **Experimental** | Separate Vite/Cloudflare app; not the MEDHA revision product |
| `src/app/` | Stray Next fragment | **Not deployed** | Leftover `src/app/(revision)/visualization/` outside `medha-next` |

### Production hosts (frontend)

These origins are trusted by `medha-backend` CORS today. Treat them as the live product, not as Next.js:

- `https://medha-revision.vercel.app` (canonical URL in `medha-frontend/index.html`)
- `https://medha-revision.pages.dev`
- `https://medha.codelearnn.com`

Local Vite (`5173`) and local Next (`3000`–`3002`) are also allowlisted for development.

## What to edit

| Change | Land it here | Do not land it here |
| --- | --- | --- |
| Live UI (search, RTU, notes, dashboard, auth screens) | `medha-frontend` | `medha-next` unless you are working on the rewrite |
| Live REST API, JWT, OAuth, search index | `medha-backend` | `medha-next/backend` |
| Campus Cart UX and cart-only APIs that Express does not have | `medha-next` App Router | Do not fork a third Express copy |
| Campu marketing / syllabus experiments | `Sems/src` | MEDHA production trees |

## Duplicate owners

Three API surfaces exist. Only the first is production.

### 1. Canonical — `medha-backend` (production)

Mounted from `medha-backend/app.js`. Contract: [API_CONTRACT.md](./API_CONTRACT.md).

| Concern | Owner |
| --- | --- |
| Auth (OTP, password, Google OAuth, JWT) | `routes/authRoutes.js`, `routes/authExtraRoutes.js` |
| Search | `routes/searchRoutes.js` → `GET /api/search`, `/suggestions`, `/popular`, `POST /history` |
| Notes, subjects, quizzes, RTU, chatbot, campus-cart (subset) | matching `routes/*.js` |

The production SPA calls this API with `Authorization: Bearer <jwt>` against `VITE_BACKEND_URL`.

### 2. Stale Express copy — `medha-next/backend`

A near-duplicate of `medha-backend` (same route files, including `authRoutes.js` and `searchRoutes.js`). It is **not** a shared package. It already lags canonical on upload validation, note moderation, several controllers, and tests.

**Policy:** freeze it. New Express work goes only to `medha-backend`. The drift workflow fails if this copy is edited.

### 3. Next.js Route Handlers — `medha-next/src/app/api`

A TypeScript rewrite that talks to MongoDB directly (`connectDB` + Mongoose models). The Next client defaults `NEXT_PUBLIC_API_URL` to same-origin (`medha-next/src/lib/api.ts`), so this app does **not** call production Express unless that env is set.

| Concern | Next owner | vs production |
| --- | --- | --- |
| Auth | `src/app/api/auth/*` (login, register, OTP, me, forgot-password) | Incomplete vs Express (no Google OAuth routes here) |
| Search | **missing** | Production search lives only on Express + Vite `/search` |
| Notes / subjects / quizzes / RTU / chatbot | matching `src/app/api/*` | Parallel rewrite, not the live contract |
| Campus Cart | `src/app/api/campus-cart/**` | Richer than Express `campusCartRoutes.js` (wallet, fulfillment, Razorpay, admin disputes). This is the experimental cart API |

## Shared package vs controlled migration

**Decision: controlled migration. Do not extract a shared package yet.**

A package would freeze the wrong seam: the real split is “Vite + Express (live)” vs “Next App Router (rewrite)”, not “two Express apps that should stay identical”. The Express copy is accidental. The Next Route Handlers are a second implementation, not a wrapper around Express.

Until cutover:

1. One production API: `medha-backend`.
2. One production UI: `medha-frontend`.
3. `medha-next` may call Express via `NEXT_PUBLIC_API_URL` for revision features; new cart-only endpoints may stay as Route Handlers until they are ported or explicitly adopted.
4. Delete `medha-next/backend` only after no deploy points at it (none should today) and the freeze check is removed.

## Frontend routes (production)

Owned by `medha-frontend/src/App.jsx`:

| Path | Notes |
| --- | --- |
| `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/auth/google/success` | Public auth |
| `/search` | Live search UI (`RevisionSearch`) → Express `/api/search` |
| `/dashboard`, `/notes`, `/subjects`, `/upload`, `/uploads`, `/profile`, `/admin`, `/team-dashboard`, `/join-team` | Core product |
| `/rtu-exams`, `/exams`, `/recommendations`, `/personalize`, `/suggest` | RTU / study |
| `/charcha`, `/charcha/post/:idOrSlug` | Gated by `ENABLE_CHARCHA` |

`medha-next/src/app/(revision)/*` and `medha-next/src/app/campus-cart/*` are the experimental UI. They must not receive production DNS until the migration checklist passes.

## Deprecation / migration plan

Do **not** change production routing in this phase.

| Phase | Gate | Action |
| --- | --- | --- |
| **0 — now** | This document + drift check | Freeze `medha-next/backend`. Document owners. Keep shipping Vite + Express. |
| **1 — Next as UI only** | Revision flows in Next call Express (`NEXT_PUBLIC_API_URL`) and match Vite for auth, search, notes, RTU | Stop adding Next Route Handlers that duplicate Express. Prefer deleting those handlers over keeping both. |
| **2 — Campus Cart** | Cart APIs either ported to `medha-backend` or explicitly declared Next-only | One cart contract, not Express subset + Next superset. |
| **3 — cutover** | Product sign-off; CORS/SEO updated in a dedicated PR | Point `medha-revision.vercel.app` (and aliases) at the chosen frontend. Only then remove Vite or Next. |
| **4 — cleanup** | Cutover live for a bake period | Delete `medha-next/backend`, duplicate Next `/api` handlers, and root `src/app`. Remove the drift workflow. |

### Automated drift check

```bash
node scripts/check-backend-drift.js
```

- Compares `medha-backend` vs `medha-next/backend` and prints identical / diverged / only-in-one-tree counts.
- **Fails CI if `medha-next/backend` file hashes change** (the copy is frozen). Canonical Express may keep moving.
- Update the snapshot only when intentionally changing the copy (should be rare):

```bash
node scripts/check-backend-drift.js --update-baseline
```

Workflow: `.github/workflows/backend-drift.yml`.
