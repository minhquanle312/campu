# Code Style and Conventions

## TypeScript

- **Strict Mode:** Enabled in `tsconfig.json`.
- **Path Aliases:** Use `@/` to import from `src/`.
- **Type Definitions:** Explicitly define props interfaces. Use `React.ReactNode` for children.

## Components

- **Structure:** Functional components.
- **Styling:** Tailwind CSS via `className` prop.
- **Utilities:** Use `cn()` (from `@/lib/utils`) to merge classes.
- **Variants:** Use `cva` (from `class-variance-authority`) for component variants (e.g., buttons).
- **Pattern:** Follows `shadcn/ui` patterns (headless Radix UI + Tailwind).

## Project Structure

- **Global Layout:** `src/app/layout.tsx` wraps the app with `NextIntlClientProvider` and standard layout elements (Nav, Footer).
- **Internationalization:** Use `next-intl` hooks (`useTranslations`, `getLocale`) for text.

## Naming

- **Files:** Kebab-case (e.g., `main-nav.tsx`, `auth-client.ts`).
- **Components:** PascalCase (e.g., `MainNav`, `Button`).
- **Utilities:** camelCase (e.g., `cn`, `betterAuth`).
