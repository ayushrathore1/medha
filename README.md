# MEDHA — India's Premier Engineering Study Platform

> A comprehensive academic platform tailored for RTU engineering students featuring verified handwritten notes, chapter video lectures, university syllabus breakdowns, and past exam paper analysis.

---

## 📁 Repository Structure

**Source of truth:** [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) · **API contract:** [docs/API_CONTRACT.md](./docs/API_CONTRACT.md)

```
MEDHA/
├── medha-frontend/        # PRODUCTION SPA (Vite) — https://medha-revision.vercel.app
├── medha-backend/         # PRODUCTION API (Express + MongoDB search)
├── medha-next/            # EXPERIMENTAL Next.js rewrite + Campus Cart
│   └── backend/           # STALE copy of medha-backend — do not patch
├── Sems/                  # EXPERIMENTAL Campu site (TanStack Start)
└── src/                   # STRAY leftover Next fragment — not deployed
```

Do not guess which tree is live. Production UI is Vite; production API is `medha-backend`. `medha-next` is a migration playground until cutover is explicitly approved. The Express copy under `medha-next/backend` is frozen (`node scripts/check-backend-drift.js`).

---

## ⚡ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express 5, Mongoose / MongoDB, In-Memory LRU Caching
- **Search Engine**: Multi-entity parallelized fuzzy search with sub-5ms cached latency
- **Authentication**: JWT & OAuth with role-based authorization

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn
- MongoDB connection URI

### 2. Backend Setup
```bash
cd medha-backend
npm install
# Configure .env with PORT, MONGO_URI, JWT_SECRET
npm run dev
```

### 3. Frontend Setup
```bash
cd medha-frontend
npm install
# Configure .env with VITE_BACKEND_URL
npm run dev
```

---

## 🛡️ License
Private project for Rajasthan Technical University academic study & preparation.
