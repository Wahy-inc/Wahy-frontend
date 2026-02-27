# Wahy - Islamic Education Platform

An Islamic educational platform that helps Sheikhs supervise and monitor their students' Quran memorization progress. Wahy streamlines the management of lessons, schedules, invoices, and analytics for Islamic educators.

## Features

### For Administrators (Sheikhs)
- **Student Management** - Add, update, approve/reject student registrations
- **Lesson Tracking** - Record and manage lessons including:
  - New memorization sessions
  - Revision sessions
  - Evaluations
  - Makeup lessons
- **Schedule Management** - Create and manage recurring lesson schedules
- **Library Resources** - Upload and share educational materials with students
- **Invoice Management** - Generate invoices, track payments, handle billing
- **Analytics Dashboard** - View comprehensive analytics including:
  - Attendance analytics (present, late, absent, excused rates)
  - Performance analytics (pass rate, homework rate, timeliness)
  - Financial analytics (revenue, invoices, overdue payments)

### For Students
- **Profile Management** - View and manage personal profile
- **Lesson History** - View lesson records and progress
- **Schedule Access** - View assigned lesson schedules
- **Library Access** - Access shared educational resources
- **Invoice Viewing** - View and download invoice PDFs

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **UI Components**: [Radix UI](https://www.radix-ui.com) primitives
- **State Management**: React 19 with `useActionState`
- **Forms**: [React Hook Form](https://react-hook-form.com) with [Zod](https://zod.dev) validation
- **Data Tables**: [TanStack Table](https://tanstack.com/table)
- **Icons**: [Lucide React](https://lucide.dev), [@deemlol/next-icons](https://www.npmjs.com/package/@deemlol/next-icons)
- **API Client**: Auto-generated from OpenAPI/Swagger specification

## Project Structure

```
wahy-front/
├── app/
│   ├── layout.tsx              # Root layout with TokenRefresher
│   ├── page.tsx                # Landing page
│   ├── style/
│   │   └── globals.css         # Global styles
│   └── platform/
│       ├── layout.tsx          # Platform layout with AuthProvider
│       ├── actions/
│       │   ├── auth.ts         # Authentication actions (signup, signin, signout)
│       │   └── dashboard.ts    # Dashboard CRUD operations
│       ├── auth/
│       │   ├── login/          # Login page
│       │   └── signup/         # Signup page
│       ├── dashboard/
│       │   ├── page.tsx        # Dashboard layout with sidebar
│       │   ├── analytics/      # Analytics dashboard (Admin only)
│       │   ├── invoices/       # Invoice management
│       │   ├── lessons/        # Lesson management
│       │   ├── library/        # Library resources
│       │   ├── profile/        # Student profile (Student only)
│       │   ├── schedules/      # Schedule management
│       │   └── students/       # Student management (Admin only)
│       └── lib/
│           └── definitions.ts  # Zod schemas and TypeScript types
├── components/
│   ├── TokenRefresher.tsx      # Automatic token refresh component
│   └── ui/                     # Reusable UI components
├── lib/
│   ├── auth-context.tsx        # Authentication context provider
│   ├── dummyData.ts            # Mock data for development
│   ├── openApi.ts              # Generated API client
│   └── utils.ts                # Utility functions
└── public/                     # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/wahy-front.git
   cd wahy-front
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Configure the API endpoint:
   
   Update the `baseUrl` in `app/platform/actions/auth.ts` and `app/platform/actions/dashboard.ts` to point to your backend server.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Authentication

The platform supports two user roles:

- **Admin (Sheikh)**: Full access to all features including student management, analytics, and billing
- **Student**: Limited access to view lessons, schedules, library, and personal profile

Authentication is handled via JWT tokens with automatic refresh functionality.

## API Integration

The frontend communicates with a REST API backend. The API client is auto-generated from an OpenAPI/Swagger specification using [swagger-typescript-api](https://github.com/acacode/swagger-typescript-api).

Key API endpoints include:
- `/api/v1/auth/*` - Authentication (signup, signin, refresh, logout)
- `/api/v1/students/*` - Student management
- `/api/v1/lessons/*` - Lesson CRUD operations
- `/api/v1/schedules/*` - Schedule management
- `/api/v1/library/*` - Library resources
- `/api/v1/invoices/*` - Invoice management
- `/api/v1/analytics/*` - Analytics endpoints

## UI Components

Built with [Radix UI](https://www.radix-ui.com) primitives and styled with Tailwind CSS:

- Accordion
- Alert Dialog
- Badge
- Button
- Card
- Input
- Label
- Select
- Separator
- Table
- Item (custom list item component)
- Field (form field wrapper)


## License

This project is private and proprietary.

## Acknowledgments

- [Next.js](https://nextjs.org) - The React framework
- [Radix UI](https://www.radix-ui.com) - Unstyled, accessible UI components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Lucide](https://lucide.dev) - Beautiful & consistent icons
