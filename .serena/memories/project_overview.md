# Project Overview: Campu

## Purpose
A personal web application titled "Cẩm Pu", described as "A little corner of the world for Cẩm Pu". It appears to be a personal gift or memory site, featuring journeys, wishes, and a map of Vietnam.

## Tech Stack
- **Framework:** Next.js 15.1.11 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, `clsx`, `tailwind-merge`, `tailwindcss-animate`
- **UI Library:** Radix UI primitives, Lucide React icons
- **Authentication:** `better-auth` (Google provider)
- **Internationalization:** `next-intl`
- **Data/Backend:** Google Sheets API (likely for storing dynamic content like "wishes"), Next.js API Routes.
- **Maps:** `react-simple-maps`, `d3-scale`
- **Package Manager:** Yarn (v4.6.0)

## Directory Structure
- `src/app`: Next.js App Router pages and layouts.
  - `journey/`: Journey related pages.
  - `wish-for-pu/`: Wishes related pages.
  - `api/`: Backend API routes.
- `src/components`: React components.
  - `ui/`: Reusable UI components (shadcn/ui style).
- `src/lib`: Utility functions, authentication config, Google Sheets client.
- `src/config`: Configuration constants.
- `messages`: Locale files (`en.json`, `vi.json`).
- `public`: Static assets (images, geojson).
