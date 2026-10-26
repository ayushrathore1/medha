# MEDHA — India's Premier Engineering Study Platform

> A comprehensive academic platform tailored for RTU engineering students featuring verified handwritten notes, chapter video lectures, university syllabus breakdowns, and past exam paper analysis.

---

## 📁 Repository Structure

```
MEDHA/
├── medha-frontend/        # Modern React + Vite Single Page Application
├── medha-backend/         # Express.js REST API with high-speed Search Engine & MongoDB
├── medha-next/            # Next.js App Router services & Campus Cart
├── Sems/                  # Semester syllabus & curriculum datasets
└── src/                   # Shared visualization & application assets
```

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
