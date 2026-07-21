# Primexium Advisors — Frontend

Official React frontend for the [Primexium Advisors](https://primexiumadvisors.com) website and student management platform.

**Repository:** [gullhassanmalik6/primexium-advisors-frontend](https://github.com/gullhassanmalik6/primexium-advisors-frontend)

## Tech stack

| Tool | Purpose |
|------|---------|
| React 19 + TypeScript | UI |
| Vite 8 | Build & dev server |
| Tailwind CSS 4 | Styling |
| React Router 7 | Routing |
| Axios | HTTP client |
| React Hook Form + Zod | Forms & validation |
| TanStack Query | Server state |
| Framer Motion | Animation |

## Features

- Public marketing site (home, services, countries, packages, contact, and more)
- Study-abroad **eligibility checker**
- Auth-ready API client (JWT access + refresh tokens)
- Protected routes for student and admin portals (dashboards coming soon)

## Prerequisites

- Node.js 20+ (recommended)
- npm

## Getting started

```bash
git clone https://github.com/gullhassanmalik6/primexium-advisors-frontend.git
cd primexium-advisors-frontend
npm install
cp .env.example .env
npm run dev
```

App runs at [http://localhost:5173](http://localhost:5173).

## Environment variables

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | FastAPI base URL including `/api/v1` |

For production (e.g. Vercel), set this to your deployed API, such as:

```env
VITE_API_BASE_URL=https://api.primexiumadvisors.com/api/v1
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and production build (`dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Oxlint |

## Project structure

```
src/
  api/           # Axios client & auth endpoints
  components/    # UI, layout, home, eligibility
  context/       # Auth context
  layouts/       # Public layout
  pages/         # Route pages
  routes/        # Router + protected routes
  schemas/       # Zod schemas
  styles/        # Global CSS
  types/         # TypeScript types
  utils/         # Helpers
```

## Deploy (Vercel)

1. Import this repository in [Vercel](https://vercel.com).
2. Framework: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set `VITE_API_BASE_URL` in project environment variables.
6. Deploy.

Custom domain: point `primexiumadvisors.com` to the Vercel project.

## Related

- Backend API: [primexium-advisors-backend](https://github.com/gullhassanmalik6/primexium-advisors-backend)
