# CI and deploy contract

Production apps are `medha-frontend` and `medha-backend`.

## Gate

1. **CI** (`.github/workflows/ci.yml`) always runs on PRs and pushes to `main`.
2. Frontend: lint → production unit tests → `vite build` (Node 22).
3. Backend: auth + API + security + OAuth Jest suites with MongoMemoryServer (Node 22).
4. **Deploy** (`.github/workflows/deploy.yml`) runs only after CI succeeds on a `main` push, then force-updates the `production` branch to that tested commit.
5. Point Hostinger Git deploy at **`production`**, not `main`. Failed CI never advances `production`.

## Frontend tests kept for production

| Suite | Why |
| --- | --- |
| `prod.smoke.test.jsx` | Coming-soon public/member screens and signup CTA |
| `notesSplit.test.js` | Notes helpers / upload limits used in production |
| `searchSplit.test.js` | Search helpers |
| `adminSplit.test.jsx` | Admin split integrity |
| `imageUtils.test.js` | Image URL helpers |

Broader exploratory suites under `src/tests/` remain in the repo but are excluded from the Vitest include list used by CI.

## Backend tests kept for production

| Suite | Why |
| --- | --- |
| `auth.test.js` | Register/login/password flows |
| `api.test.js` | Core API contract |
| `security.test.js` | CORS / hardening |
| `oauthCallback.test.js` | Google OAuth redirect allowlist |

Load tests and niche pagination/upload suites are local-only (`npm run test:load`, etc.).

## Services and secrets

CI does **not** need Atlas, Groq, Gemini, Hostinger Mail, Cloudinary, or ImageKit credentials.

- Backend tests start MongoMemoryServer (cached under `~/.cache/mongodb-binaries`).
- `sendEmail` skips the Hostinger Mail API when `NODE_ENV=test`.
- Frontend build uses `VITE_BACKEND_URL=https://medharevisionapi.shopcampuskart.in`.

Do not add production secrets to these workflows.

## Local equivalent

```bash
cd medha-frontend && npm ci && npm run lint && npm run test:run && npm run build
cd medha-backend && npm ci && npm run test:prod
```
