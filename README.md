# MEDHA Revision

**Open-source exam revision for engineering students** — owned by [Shop Campuskart](https://www.shopcampuskart.in).

> Most engineering students study in the last week before exams. MEDHA Revision exists so they do not waste that week hunting for material. Open a topic and get the notes, mapped YouTube videos, GeeksforGeeks links, and (for universities like RTU) previous-year papers that students already rely on — search less, revise more.

**Live:** [medharevision.shopcampuskart.in](https://medharevision.shopcampuskart.in)  
**Campuskart:** [www.shopcampuskart.in](https://www.shopcampuskart.in)

---

## Why MEDHA

Engineering prep usually fails on discovery, not effort. Students already know *what* to study; they lose time figuring out *where* to study from.

MEDHA Revision curates the resources that most students already use and maps them to the syllabus so a new student can:

- Search or click a topic name
- Open verified notes for that topic
- Watch mapped YouTube lectures
- Follow GeeksforGeeks / reference links
- Practice with previous-year papers where available (e.g. RTU)

Built to **use together and build together** — interesting students are welcome to ship improvements, not just consume the catalog.

---

## Ownership & credits

| | |
| --- | --- |
| **Owned by** | [Shop Campuskart](https://www.shopcampuskart.in) |
| **Started by** | [Ayush Rathore](https://github.com/ayushrathore1) · [LinkedIn](https://www.linkedin.com/in/ayushrathore1) |
| **License** | Open source — contributions welcome |

---

## Contribute

This is an open-source project by Campuskart. If you want to add a feature, improve a flow, or fix a bug:

1. Fork the repo and open a pull request
2. Or share suggestions with the team — we read them

**Support / queries:** [support@shopcampuskart.in](mailto:support@shopcampuskart.in)

Thank you — **Team Campuskart**

---

## Repository structure

**Source of truth:** [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) · **API contract:** [docs/API_CONTRACT.md](./docs/API_CONTRACT.md)

```
MEDHA/
├── medha-frontend/        # Production SPA (Vite) — medharevision.shopcampuskart.in
├── medha-backend/         # Production API (Express + MongoDB)
├── medha-next/            # Experimental Next.js rewrite + Campus Cart
│   └── backend/           # Stale copy of medha-backend — do not patch
├── Sems/                  # Experimental Campu site (TanStack Start)
└── src/                   # Leftover Next fragment — not deployed
```

Production UI is Vite (`medha-frontend`). Production API is `medha-backend`. Do not treat `medha-next` or `medha-next/backend` as live.

---

## Tech stack

- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express 5, Mongoose / MongoDB
- **Auth:** JWT and Google OAuth with role-based access
- **Search:** Multi-entity fuzzy search with caching

---

## Getting started

### Prerequisites

- Node.js **20.19+** (22 recommended)
- npm
- MongoDB connection URI

### Backend

```bash
cd medha-backend
npm install
# Configure .env (PORT, MONGO_URI, JWT_SECRET, FRONTEND_URL, …)
npm run dev
```

### Frontend

```bash
cd medha-frontend
npm install
# Configure .env with VITE_BACKEND_URL
npm run dev
```

CI and local production checks: see [.github/CI.md](./.github/CI.md).

---

## Links

- Product: [medharevision.shopcampuskart.in](https://medharevision.shopcampuskart.in)
- Campuskart: [www.shopcampuskart.in](https://www.shopcampuskart.in)
- GitHub (starter): [@ayushrathore1](https://github.com/ayushrathore1)
- LinkedIn: [@ayushrathore1](https://www.linkedin.com/in/ayushrathore1)
- Email: [support@shopcampuskart.in](mailto:support@shopcampuskart.in)
