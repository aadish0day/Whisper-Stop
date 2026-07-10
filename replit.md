# WhisperStop

A community-powered WhatsApp misinformation fact-checker. Users can submit forwarded messages for verification, browse fact-check verdicts with a distinctive "stamp" UI, and share shareable fact-check cards.

## Run & Operate

### Frontend (React + Vite)
```
pnpm --filter @workspace/web run dev
```
Required env: `PORT` and `BASE_PATH` (injected automatically by the Replit artifact workflow `apps/web: web`).

### API Server (Express 5)
```
pnpm --filter @workspace/api run dev
```
Required env: `PORT` (injected by workflow), `DATABASE_URL` — Postgres connection string (not yet configured).

### Other commands
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite, React Router DOM v6, plain CSS with CSS variables (no Tailwind)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (not yet connected)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec in `packages/api-spec/`)
- Build: esbuild (CJS bundle)
- Charts: Recharts
- Icons: lucide-react

## Where things live

- `apps/web/src/` — React frontend source (pages, components, context, data, hooks)
- `apps/web/src/data/` — mock data (no live backend calls in the current build)
- `apps/api/src/` — Express API server
- `packages/api-spec/` — OpenAPI spec (source of truth for API contracts)
- `packages/api-client-react/` — generated React Query hooks
- `packages/api-zod/` — generated Zod schemas
- `packages/db/` — Drizzle ORM schema and DB client

## Architecture decisions

- Frontend-first: the current UI build uses mock data only — no backend calls required to run the frontend
- Design system: CSS custom properties with `[data-theme]` on `<html>` for dark/light switching; no Tailwind, no CSS-in-JS
- Stamp aesthetic: the verification verdict badge renders as a rotated double-ring stamp; flat pills used everywhere else
- Type pairing: Space Grotesk (headings), Inter (body), JetBrains Mono (data/timestamps)
- API server requires `DATABASE_URL` to start — configure a Postgres connection before running the backend

## Product

WhisperStop lets users submit WhatsApp forwards for community fact-checking. Verdicts are displayed with a distinctive rubber-stamp visual language. Users can export shareable PNG fact-check cards via html2canvas.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Both `PORT` and `BASE_PATH` must be set to run the frontend dev server; the Replit artifact workflow handles this automatically
- `DATABASE_URL` must be set before the API server will start
- Run `pnpm --filter @workspace/api-spec run codegen` after editing the OpenAPI spec in `packages/api-spec/`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
