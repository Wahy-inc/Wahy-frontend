# AGENTS.md - Wahy Frontend Engineering Guide

**Project**: Wahy - Quran Study Management System Frontend  
**Runtime**: Next.js 16.1.6, React 19.2.3, TypeScript 5, Tailwind CSS 4, shadcn/ui  
**Backend API**: FastAPI 0.1.0 (Async SQLAlchemy 2.0, PostgreSQL)  

---

## 1. Core Architecture & Conventions

```
Wahy-frontend/
├── app/
│   ├── platform/                # Main application workspace
│   │   ├── actions/             # Domain Server Actions (common, auth, students, schedules, lessons, library, invoices, analytics)
│   │   ├── auth/                # Auth route handlers (login, student login, etc.)
│   │   ├── dashboard/           # Dashboard routes
│   │   │   ├── admin/           # Sheikh admin views (students, schedules, lessons, library, invoices, analytics, calendar)
│   │   │   └── student/         # Student views (profile, schedules, lessons, library, invoices, analytics)
│   │   └── lib/                 # Zod definitions and TypeScript interfaces
│   ├── api/                     # Next.js API proxy routes
│   └── layout.tsx               # Root application layout
├── components/                  # Shared React UI components (shadcn/ui, NavBar, Footer)
└── lib/                         # Core utilities
    ├── apiClient.ts             # Deduplicated OpenAPI client factory
    ├── auth-context.tsx         # Hydration-safe React auth context provider
    ├── localization-context.tsx # Multilingual translation context provider
    └── openApi.ts               # Auto-generated OpenAPI TypeScript SDK
```

---

## 2. Server Action Design & Domain Separation

All mutation and query Server Actions are separated into single-responsibility domain modules under `app/platform/actions/`:

- **`common.ts`**: Shared `handleApiCall()` execution wrapper handling errors, HTTP status checking, and type-safe `ActionResponse<T>` returns.
- **`auth.ts`**: Authentication actions (`signinAdmin`, `signinStudent`, `refreshAccessToken`, `signout`, `checkHealth`).
- **`students.ts`**: Student management actions (`listStudents`, `getStudent`, `createStudent`, `updateStudent`, `approveStudent`, `rejectStudent`).
- **`calendar.ts`**: Calendar grid queries, day views, and ICS feed management (`calenderGetData`, `calenderGenerateFeed`, `calenderEnableFeed`).
- **`notifications.ts`**: Sheikh & student upcoming session notifications and mark-as-read actions (`notificationsGetAll`, `notificationsMarkAsRead`).
- **`schedules.ts`**: Weekly recurring schedule management actions (`listSchedules`, `createSchedule`, `updateSchedule`, `deleteSchedule`, `addLocalSchedules`).
- **`lessons.ts`**: Session recording, history tracking, and class file attachments (`listLessons`, `createLesson`, `updateLesson`, `getLessonHistory`).
- **`library.ts`**: Teaching library items, metadata, and streaming file downloads (`listLibrary`, `createLibraryItem`, `uploadLibraryFile`, `downloadLibraryFile`).
- **`invoices.ts`**: Invoice generation, item override billing logic, payment marking, and PDF downloads (`listInvoices`, `createInvoices`, `overrideInvoice`, `downloadInvoicePDF`).
- **`analytics.ts`**: KPI aggregation endpoints (`getAttendanceAnalytics`, `getPerformanceAnalytics`, `getFinancialAnalytics`, `getOperationalAnalytics`).

---

## 3. Best Practices & Quality Directives

1. **No `window.location.reload()` Hacks**: Page state invalidation MUST use standard React state updates, `useActionState` handlers, or Next.js `router.refresh()`.
2. **Clean Production Logging**: No `console.log` or `console.error` debug pollution in production action functions.
3. **HTTP-Only Cookies & Safe Token Handling**: JWT tokens must be stored in secure HTTP-only cookies and forwarded safely via API requests.
4. **Streaming Downloads**: File downloads (library attachments, PDF invoices, calendar feeds) use binary Blob streams / direct URL triggers without loading unnecessary payloads into client state.
5. **No Sync Queue Artifacts**: The backend operates as a stateless API; offline queues (`offlineSync.ts`, `offlineCache.ts`) are purged from the architecture.

---

## 4. Key Developer Commands

```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev

# TypeScript type check (0 errors required)
npx tsc --noEmit

# ESLint lint check (0 warnings required)
npx eslint --max-warnings=0 .

# Production build
npm run build
```
