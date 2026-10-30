# medha-next (experimental)

**Status:** migration / Campus Cart playground — **not** the production MEDHA site.

Production frontend is `medha-frontend` (Vite) at `https://medha-revision.vercel.app`. Production API is `medha-backend`. Read [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) before editing.

- Do **not** patch `backend/` here. That tree is a stale Express copy; land API fixes in `medha-backend`.
- App Router handlers under `src/app/api` are an experimental rewrite, not the live contract ([docs/API_CONTRACT.md](../docs/API_CONTRACT.md)).
- Prefer `NEXT_PUBLIC_API_URL` pointing at Express for revision features. Campus Cart extras that Express does not have may stay as Route Handlers until they are ported.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
