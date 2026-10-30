# MEDHA API contract

**Canonical implementation:** `medha-backend` (Express), mounted in `medha-backend/app.js`.

**Production client:** `medha-frontend` via `VITE_BACKEND_URL`.

`medha-next/backend` is a stale copy of this contract. `medha-next/src/app/api` is an experimental rewrite and is **not** the live contract (see [ARCHITECTURE.md](./ARCHITECTURE.md)).

## Conventions

| Item | Rule |
| --- | --- |
| Base URL | Production API host from the SPA `VITE_BACKEND_URL` env (local Vite typically `http://localhost:5001`) |
| Auth | `Authorization: Bearer <jwt>` except where a route uses optional auth |
| JSON errors | `{ "success": false, "message": "..." }` for 404s and most handlers |
| Health | `GET /health` → 200 if Mongo connected, else 503. `GET /` → plaintext banner |
| Charcha | `/api/charcha` is mounted only when `ENABLE_CHARCHA=true` |

## Mounted prefixes

| Prefix | Router | Limiter |
| --- | --- | --- |
| `/api/auth` | `authRoutes.js` + `authExtraRoutes.js` | `authLimiter` |
| `/api/users` | `userRoutes.js` | general |
| `/api/subjects` | `subjectRoutes.js` | general |
| `/api/notes` | `noteRoutes.js` | general |
| `/api/flashcards` | `flashcardRoutes.js` | general |
| `/api/todos` | `todoRoutes.js` | general |
| `/api/dashboard` | `dashboard.js` | general |
| `/api/quizzes` | `quizRoutes.js` | general |
| `/api/rtu` | `rtuRoutes.js` | general |
| `/api/learn` | `learnRoutes.js` | general |
| `/api/practice` | `practiceRoutes.js` | general |
| `/api/search` | `searchRoutes.js` | general |
| `/api/chatbot` | `chatbotRoutes.js` | `aiLimiter` |
| `/api/chat` | `chatStreamRoutes.js` | `aiLimiter` |
| `/api/voice` | `voiceRoutes.js` | `aiLimiter` |
| `/api/chat-history` | `chatHistoryRoutes.js` | general |
| `/api/ocr` | `ocrRoutes.js` | `aiLimiter` |
| `/api/recommendations` | `recommendationRoutes.js` | `aiLimiter` |
| `/api/messages` | `messageRoutes.js` | general |
| `/api/chats` | `chatRoutes.js` | general |
| `/api/notifications` | `notificationRoutes.js` | general |
| `/api/premium` | `premiumRoutes.js` | general |
| `/api/wallpapers` | `wallpaperRoutes.js` | general |
| `/api/campus-cart` | `campusCartRoutes.js` | general |
| `/api/charcha` | `charchaRoutes.js` | feature flag |
| `/api/admin` | `adminRoutes.js` | general |
| `/api/suggestions` | `suggestionRoutes.js` | general |
| `/api/team` | `teamRoutes.js` | general |
| `/api/seed` | `seedRoutes.js` | general |

## Auth (canonical)

Owned by `medha-backend/routes/authRoutes.js` and `authExtraRoutes.js`.

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/api/auth/send-otp` | Registration / login / verify |
| POST | `/api/auth/verify-otp` | |
| POST | `/api/auth/login-otp` | |
| POST | `/api/auth/register` | |
| POST | `/api/auth/login` | |
| POST | `/api/auth/change-password` | |
| GET | `/api/auth/me` | JWT |
| GET | `/api/auth/google` | OAuth start |
| GET | `/api/auth/google/callback` | OAuth callback — tokens must not be put in the frontend URL (see issue #7) |
| POST | `/api/auth/forgot-password` | |
| POST | `/api/auth/reset-password` | |
| POST | `/api/auth/admin/trigger-reset` | Admin |

**Duplicates (not production):** `medha-next/backend/routes/authRoutes.js` (frozen copy) and `medha-next/src/app/api/auth/{login,login-otp,register,send-otp,me,forgot-password}/route.ts` (rewrite, no Google routes).

## Search (canonical)

Owned by `medha-backend/routes/searchRoutes.js`. Live UI: Vite `/search`.

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/api/search` | optional |
| GET | `/api/search/suggestions` | public |
| GET | `/api/search/popular` | public |
| POST | `/api/search/history` | optional |

There is **no** `medha-next/src/app/api/search` handler. Next must not be treated as a search owner.

## Remaining canonical routes

Paths below are relative to the prefix in the first column.

### `/api/users`

| Method | Path |
| --- | --- |
| GET | `/stats`, `/me`, `/activity-history`, `/search`, `/profile/:userId` |
| POST | `/:userId/follow`, `/increment-notification-view`, `/verify-email` |
| DELETE | `/:userId/follow`, `/me` |
| PATCH | `/me` |
| PUT | `/change-password` |

### `/api/subjects`

`POST /`, `GET /`, `GET /:id`, `PUT /:id`, `DELETE /:id`

### `/api/notes`

`GET /public`, `GET /`, `POST /`, `POST /text`, `GET /:noteId`, `PUT /:noteId`, `DELETE /:noteId`, `PATCH /:noteId/visibility`, `POST /:noteId/like`, `POST /:noteId/download`

### `/api/flashcards`

`POST /`, `POST /generate-ai`, `GET /`, `GET /topics/all`, `GET /:id`, `PUT /:id`, `PATCH /:id/difficulty`, `PATCH /topic/:topicName/difficulty`, `PATCH /:id/viewed`, `GET /list/review`, `DELETE /topic/:topicName`, `DELETE /:id`

### `/api/todos`

`GET /`, `POST /`, `PATCH /:id`, `DELETE /:id`

### `/api/dashboard`

`GET /stats`, `POST /plan`, `GET /plan`, `GET /quote`

### `/api/quizzes`

`POST /`, `POST /generate-ai`, `POST /generate-topic-ai`, `GET /`, `GET /:id`, `POST /:id/attempt`, `GET /:id/results`, `PUT /:id`, `DELETE /:id`

### `/api/rtu`

`GET /3rd-sem`, `GET /subjects/:subjectName/years`, `GET /subjects/:subjectName/years/:year/weightage`, `PUT /.../questions/:qCode/ai-links`, `GET /imagekit-auth`, `POST|DELETE /.../questions/:qCode/image`, `GET /subjects/:subjectName/multi-year-weightage`, `POST /subjects/:subjectName/ai-predict-topics`

### `/api/learn`

Subject content, likes/views, admin content + ImageKit, slide/voice/note-image, animation audio/timings/transcribe.

### `/api/practice`

Questions, categories, execute, submit, hint, solution, stats, admin CRUD.

### `/api/chatbot`

`POST /ask`, `POST /solve`, `POST /solve/check-cache`

### `/api/chat`

`POST /stream`

### `/api/voice`

`POST /transcribe`, `POST /transcribe-with-timestamps`, `POST /ask`, `POST /chat`, `GET /status`

### `/api/chat-history`

Session CRUD + `POST /sessions/:sessionId/messages`

### `/api/ocr`

`POST /`

### `/api/recommendations`

`POST /search`, `GET /trending`, `GET /subjects`, `GET /units/:subjectName`, channel CRUD, syllabus upload/list/delete.

### `/api/messages`

User + admin message inbox (`/`, `/my-messages`, `/admin/*`, `/check-admin`).

### `/api/chats`

Conversations, messages, unread, admin users/contacts, broadcast.

### `/api/notifications`

`GET /`, `PUT /:id/read`

### `/api/premium`

`POST /notify`, `GET /count`, `GET /status`

### `/api/wallpapers`

`GET /`

### `/api/campus-cart` (Express subset)

`GET|POST /products`, `GET|PUT|DELETE /products/:id`, `GET /categories`, `GET|POST|PUT|DELETE /cart`, `GET|POST /orders`

The Next Campus Cart Route Handlers add wallet, fulfillment, payments, wishlist, reviews, and admin disputes. Those extras are **experimental**, not this contract.

### `/api/charcha` (flagged)

Posts, comments, votes, follow, mentions, admin mentions.

### `/api/admin`

Users, roles, team invite, email, history, reengagement, transcribe.

### `/api/suggestions`

`POST /`, `GET /admin/all`, `PATCH /admin/:id`, `DELETE /admin/:id`

### `/api/team`

`POST /join`, `GET /check`, `GET /users`, `GET /members`

### `/api/seed`

`POST|GET /university-context`

## Experimental Next Route Handlers (not this contract)

Prefixes under `medha-next/src/app/api/`: `auth`, `campus-cart`, `charcha`, `chatbot`, `dashboard`, `flashcards`, `health`, `notes`, `notifications`, `quizzes`, `rtu`, `subjects`, `suggestions`, `todos`, `upload`, `users`.

Do not add production clients against these paths. If Next needs revision data during migration, point `NEXT_PUBLIC_API_URL` at canonical Express.
