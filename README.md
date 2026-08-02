# Wahy - Frontend Portal

The Wahy web application for **sheikhs** (admin portal) and **parents**
(parent portal). Built with Next.js 16 (App Router), React 19, TypeScript,
Tailwind CSS 4, shadcn/ui, and TanStack Query. Talks to the Wahy FastAPI
backend (`../Wahy`).

---

## 1. Quick Start

```bash
npm install

# Type check (0 errors required)
npx tsc --noEmit

# Lint (0 warnings required)
npx eslint --max-warnings=0 .

# Start the development server
npm run dev

# Production build
npm run build
```

The app runs on `http://localhost:3000` and expects the backend on
`http://localhost:9000`.

---

## 2. Configuration

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_BACKEND_URL` | Backend base URL used by the browser (credentials `include`) | falls back to `NEXT_PUBLIC_API_URL` |
| `BACKEND_URL` | Server-side fallback target for the `/api/:path*` rewrite | `NEXT_PUBLIC_API_URL` or `http://localhost:9000` |

---

## 3. Architecture

### Authentication

- The backend sets **HTTP-only cookies** (`access_token`, `refresh_token`).
  The frontend never stores tokens or roles in `localStorage`.
- `lib/api/client.ts` is the single fetch transport: it sends
  `credentials: "include"`, performs a **single-flight refresh** on `401`,
  and dispatches `wahy:unauthorized` when the refresh fails.
- `lib/session-context.tsx` resolves the session from `GET /api/v1/auth/me`
  (added to the backend for this purpose) and exposes
  `{ session, isLoading, signOut, refreshSession }`.

### Data layer

- `lib/data-contracts.ts` - regenerated from the backend OpenAPI spec
  (swagger-typescript-api, types only, fully type-checked).
- `lib/api/` - typed domain modules (auth, parents, students, schedules,
  lessons, classes, classFiles, invoices, library, wird, analytics, calendar,
  notifications, sheikh). All endpoints go through these functions.
- Pages consume the API through **TanStack Query** (`useQuery`/`useMutation`)
  with colocated query keys. Mutations invalidate their domain keys; no
  `window.location.reload()` hacks.
- Downloads (invoice PDFs, class files, library files) use Blob streaming.

### Routing

```
/platform/auth/signin            Unified signin (sheikh + parent)
/platform/auth/activate          Invite-code / password-reset activation
/platform/auth/reset-request     Forgot password (request)
/platform/dashboard/admin/*      Sheikh portal (parents, students, schedules,
                                 classes, lessons, invoices, library, wird,
                                 calendar, analytics, reset requests)
/platform/dashboard/parent/*     Parent portal (children, schedules, classes,
                                 wird, library, invoices, profile)
```

Role gates live in `app/platform/dashboard/{admin,parent}/layout.tsx`
(`RequireRole` + `AppShell`).

### Forms & validation

- `app/platform/lib/schemas/` - per-domain Zod schemas; forms use
  react-hook-form with `useZodResolver` (`app/platform/lib/use-zod-resolver.ts`),
  which translates validation messages through the locale files.

### Conventions

- All pages are `"use client"`; dynamic routes use `useParams()`.
- Dates: `lib/dates.ts` (date-fns; the backend stores dates as `YYYY-MM-DD`
  and times as `HH:MM:SS` UTC). Currency/bytes/percent: `lib/format.ts`
  (currency is USD-only and locale-aware).
- All user-facing copy goes through `t()` from
  `lib/localization-context.tsx` (6 locales: en, ar, ru, fr, de, es; keys
  support `{variable}` interpolation). The saved language applies RTL
  direction for Arabic app-wide.
- Theme (light/dark) and UI language are the only `localStorage` values;
  auth state stays in HTTP-only cookies.

---

## 4. Quality Gates

- `npx tsc --noEmit` - 0 errors.
- `npx eslint --max-warnings=0 .` - 0 warnings.
- `npm run build` - succeeds.
- No `console.log` in production code.

---

## 5. Docker

Standalone dev container: `docker compose -f docker-compose.dev.yml up --build`.
Full stack (Postgres + API + frontend) from the workspace root:
`docker compose -f docker-compose.dev.yml up --build`.
Production (Coolify / Traefik): `docker compose up -d --build`.
