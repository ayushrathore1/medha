# CI contract

GitHub Actions runs lint, tests, type-check, and production builds for each maintained app when that app (or this workflow) changes.

| App | Directory | Checks |
| --- | --- | --- |
| Vite frontend | `medha-frontend` | `npm ci`, `lint`, `test:run`, `vite build` |
| Express backend | `medha-backend` | `npm ci`, Jest `auth` / `api` / `security` |
| Next app | `medha-next` | `npm ci`, `lint`, `type-check`, `next build` |
| Sems / Campu | `Sems/src` | `npm ci`, `lint`, `type-check` (Vite/Cloudflare build is not applicable from this package root yet) |

Path filters skip unchanged apps. The `CI result` job fails the workflow if any executed app job failed; skipped jobs are allowed.

## Services and secrets

CI does **not** need Atlas, Groq, Gemini, Resend, SMTP, Cloudinary, or ImageKit credentials.

- Backend tests start [MongoMemoryServer](https://github.com/nodkz/mongodb-memory-server). Binaries are cached under `~/.cache/mongodb-binaries`.
- `JWT_SECRET` and other keys in `.github/workflows/ci.yml` are placeholders so modules can import. Live AI/email/upload providers are not called by these suites (`sendEmail` skips Hostinger Mail API when `NODE_ENV=test`).
- Frontend and Next builds only need public placeholders (`VITE_BACKEND_URL`, `NEXT_PUBLIC_API_URL`).
- Sems has no required secrets.

Do not add production secrets to this workflow. If a new test needs a third-party API, mock it in the test instead.

## Local equivalent

```bash
# frontend
cd medha-frontend && npm ci && npm run lint && npm run test:run && npm run build

# backend (downloads MongoMemoryServer on first run)
cd medha-backend && npm ci && npm run test:auth && npm run test:api && npm run test:security

# next
cd medha-next && npm ci && npm run lint && npm run type-check && npm run build

# sems
cd Sems/src && npm ci && npm run lint && npm run type-check
```
