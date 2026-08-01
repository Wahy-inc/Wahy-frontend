# AGENTS.md - Wahy Frontend Engineering Guide

**Project**: Wahy - Quran Study Management System Frontend
**Runtime**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4,
shadcn/ui, TanStack Query v5, react-hook-form + zod
**Backend API**: FastAPI (async SQLAlchemy 2.0, PostgreSQL) - see `../Wahy`

---

## 1. Core Architecture

```
Wahy-frontend/
├── app/
│   ├── platform/
│   │   ├── auth/                  # signin, activate, reset-request
│   │   ├── dashboard/admin/       # Sheikh portal (parents, students, schedules,
│   │   │                          #   classes, lessons, invoices, library, wird,
│   │   │                          #   calendar, analytics, reset-requests)
│   │   ├── dashboard/parent/      # Parent portal (children, schedules, classes,
│   │   │                          #   wird, library, invoices, profile)
│   │   └── lib/schemas/           # Per-domain Zod form schemas
│   ├── layout.tsx                 # Root layout: Providers (localization, query, session, toaster)
│   └── page.tsx                   # Landing page; redirects by session role
├── components/
│   ├── dashboard/                 # AppShell, nav-items, language select, RequireRole
│   ├── shared/                    # PageHeader, Pagination, EmptyState, ErrorBanner,
│   │                              #   LoadingSkeleton, StatusBadge family, ConfirmDialog,
│   │                              #   CopyCodeDialog, FieldInput, DateRangePicker
│   └── ui/                        # shadcn/ui primitives (button, card, dialog, ...)
└── lib/
    ├── api/                       # Typed API domain modules (the ONLY way to call the backend)
    ├── data-contracts.ts          # Regenerated OpenAPI types (swagger-typescript-api)
    ├── client.ts                  # Fetch transport: credentials include, 401 single-flight refresh
    ├── session-context.tsx        # Session from GET /auth/me (HTTP-only cookies)
    ├── query-provider.tsx         # TanStack Query client
    ├── dates.ts / format.ts       # date-fns and display formatters
    └── localization-context.tsx   # t() over 6 locales
```

---

## 2. Mandatory Conventions

1. **Cookie auth only**: never store tokens or roles in `localStorage`.
   Session state comes from `useSession()`; the transport refreshes silently.
   (Theme and UI language are the only `localStorage` values.)
2. **All data through `lib/api/`**: pages use TanStack Query
   (`useQuery`/`useMutation`) over the typed domain modules. No raw `fetch`
   in pages, no `useEffect` data-fetching loops.
3. **State invalidation**: after a mutation, `invalidateQueries` the domain
   keys. Never use `window.location.reload()`.
4. **Error handling**: catch `ApiError` (from `lib/api/client.ts`) and show
   `err.message` (the backend `detail`) via `toast.error` or `ErrorBanner`.
5. **No debug pollution**: no `console.log`/`console.error` in production code.
6. **Downloads**: Blob streaming via the domain modules (pdf, class files,
   library files); create an object URL and click an anchor.
7. **Pages are `"use client"`**: dynamic routes read ids with `useParams()`.
8. **Date handling**: `YYYY-MM-DD` dates and `HH:MM:SS` times via `lib/dates.ts`.
9. **Query keys**: colocated in the feature file, prefixed by domain
   (e.g. `["parents", id]`, `["my-wird"]`).
10. **Localized copy only**: every user-facing string goes through `t()`
    from `lib/localization-context.tsx` (6 locale files; `{variable}`
    interpolation). Never hardcode UI text. Form validation messages are
    localized via `useZodResolver` (error codes mapped in
    `app/platform/lib/use-zod-resolver.ts`).
11. **RTL-ready layout**: use Tailwind logical utilities (`ms-`/`me-`,
    `ps-`/`pe-`, `start-`/`end-`, `text-start`/`text-end`) instead of
    physical ones (`ml-`/`mr-`, `left-`/`right-`, `text-left`/`text-right`);
    Arabic renders RTL app-wide.

---

## 3. Adding a Feature

1. Add API functions in `lib/api/<domain>.ts` (typed against
   `lib/data-contracts.ts`); regenerate `data-contracts.ts` whenever the
   backend spec changes (see section 5).
2. Add Zod form schemas in `app/platform/lib/schemas/<domain>.ts`.
3. Create the page under `app/platform/dashboard/<admin|parent>/<feature>/`;
   use TanStack Query hooks and shared components.
4. Register the route in `components/dashboard/nav-items.ts` if it needs a
   sidebar entry.
5. Validate: `npx tsc --noEmit` and `npx eslint --max-warnings=0 .` - 0/0.

---

## 4. Quality Gates

- Zero TypeScript errors (`npx tsc --noEmit`).
- Zero ESLint warnings (`npx eslint --max-warnings=0 .`).
- `npm run build` succeeds.
- No dead code, unused imports, or unused parameters.

---

## 5. Regenerating the API Client

```bash
# From the backend repo: export the live spec
uv run python -c "import json; from app.__main__ import app; json.dump(app.openapi(), open('/tmp/wahy-openapi.json','w'))"

# From the frontend repo: regenerate types (then remove the @ts-nocheck line)
npx swagger-typescript-api generate -p /tmp/wahy-openapi.json -o lib -n data-contracts.ts --modular --no-client
```

---

## 6. Backend Caveats (verified against the API)

- Invoice generation 400s with `Lessons [ids] have no rate set` when any
  unbilled lesson has a NULL rate. Lesson creation now copies
  `student.base_rate` into `lesson.rate`, so set `base_rate` on children.
- Analytics rates (`attendance_rate`, `timeliness_rate`,
  `determination_score`) are **percentages (0-100)**; class attendance
  `attendance_rate` is a **fraction (0-1)**.
- `revenue_per_parent[].parent_id` is a parent id (the OpenAPI field name
  is `revenue_per_student` for legacy wire compatibility).
- Parent library listing returns all active items (no access filtering).
- `attendance === null` on a lesson means "not yet held" (not billable).
- `POST /auth/reset-request` always returns 204 - show the same confirmation
  to every user.
