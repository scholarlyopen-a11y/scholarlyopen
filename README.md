# Scholarisch Open Access Portal

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
