# Scholarly Open Access Portal

Marketing website for an open-access publishing/journals brand, built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Radix UI primitives + reusable UI components
- pnpm

## Requirements

- Node.js >= 20.9.0
- pnpm

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the dev server:

```bash
pnpm dev
```

Open:

- http://localhost:3000

## Local Email Setup

Submission and contact forms send real emails through SMTP (works locally, no Vercel-only config required).

1. Copy env template:

```bash
cp .env.example .env.local
```

2. Fill these values in `.env.local`:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `SUBMISSIONS_TO` (optional override)
- `CONTACT_TO` (optional override)

For Gmail, use an App Password (not your normal account password).

### Quick SMTP Test (Local)

In development, open `/contact` and use the `Send Test Email` button in the `Local SMTP Test` block.

- It calls `POST /api/test-email`
- It sends a test email to `CONTACT_TO` (or fallback default)
- It is disabled automatically in production

## Scripts

- `pnpm dev` - start local development server
- `pnpm build` - create production build
- `pnpm start` - run production server (after build)
- `pnpm lint` - lint

## Project Structure

- `app/` - routes (App Router) + global layout/styles
- `components/` - shared components (header/footer, cards, UI primitives)
- `lib/` - shared utilities and app-level providers (e.g. language context)
- `styles/` - global styles (if needed beyond `app/globals.css`)
