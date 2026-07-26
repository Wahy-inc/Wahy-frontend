# Wahy - Quran Study Management System (Frontend Portal)

A modern Next.js 16 (App Router) and React 19 web application for Sheikhs and Students. Communicates with the Wahy FastAPI backend to provide real-time memorization tracking, schedule management, teaching material library, invoice billing, and analytics.

---

## 1. Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Type check
npx tsc --noEmit

# ESLint check
npm run lint

# Start development server
npm run dev
```

Application runs on `http://localhost:3000`.

---

## 2. Docker & Compose Setup

### Standalone Development Container

```bash
# Run Next.js hot-reloading development container:
docker compose -f docker-compose.dev.yml up --build
```

### Full-Stack Development (Frontend + Backend + Postgres)

```bash
# From workspace parent directory:
docker compose -f ../docker-compose.dev.yml up --build
```

### Production Deployment (Coolify + Traefik)

```bash
# Build & start standalone production container:
docker compose up -d --build
```

---

## 3. Configuration & Environment Variables

Create `.env.local` for local development or set environment variables in your deployment pipeline:

- `NEXT_PUBLIC_API_URL`: Backend API base URL (Default: `http://localhost:9000`)
- `BACKEND_URL`: Internal container communication URL (Default: `http://wahy-backend:9000`)
- `NEXT_PUBLIC_DEFAULT_LANGUAGE`: Default locale (`en` or `ar`)

---

## 4. Key Architecture Improvements

- **Modular Domain Actions**: Server Actions separated into clean single-responsibility files (`auth.ts`, `students.ts`, `schedules.ts`, `lessons.ts`, `library.ts`, `invoices.ts`, `analytics.ts`, `calendar.ts`, `notifications.ts`).
- **HTTP-Only Cookies & Safe Token Handling**: Auth actions forward access tokens securely and clear credentials on logout.
- **Fast Stream Downloads**: Direct Blob streaming for library attachments and PDF invoice downloads.
- **Request Deduplication**: API client automatically cancels duplicate pending requests.

---

## 5. Technology Stack

- **Framework**: Next.js 16.1.6 (App Router, Standalone Output) + React 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + Radix UI primitives + shadcn/ui
- **Icons**: Lucide React + `@deemlol/next-icons`
- **Containerization**: Multi-stage Alpine Dockerfile + Docker Compose (Coolify & Traefik compatible)
