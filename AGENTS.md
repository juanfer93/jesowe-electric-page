# Agent Guide: Jesowe Electric Web Project

This document serves as a comprehensive guide for AI agents and developers working on the Jesowe Electric web application. Adhere to these guidelines to maintain code quality, consistency, and stability.

## 1. Environment & Commands

### Package Management
This project uses `pnpm` for dependency management. Ensure you have it installed and use it for all script executions.

### Build & Execution Commands
*   **Start Development Server**:
    ```bash
    pnpm dev
    ```
    This runs the Next.js development server. The app will be available at `http://localhost:3000`. Use this for interactive development and testing changes in real-time.

*   **Build for Production**:
    ```bash
    pnpm build
    ```
    Generates an optimized production build.
    **CRITICAL**: Always run this command before confirming a task is complete to ensure there are no TypeScript or build errors.

*   **Start Production Server**:
    ```bash
    pnpm start
    ```
    Runs the built application in production mode. Useful for verifying the build artifact behaves as expected.

### Code Quality & Linting
*   **Lint Code**:
    ```bash
    pnpm lint
    ```
    Uses ESLint with the Next.js configuration. Fix all warnings and errors before committing.

### Testing
*   **Current Status**: No automated test suite (Jest/Vitest) is currently configured in `package.json` or present in the source directory.
*   **Strategy**:
    *   For now, rely on manual verification and build checks (`pnpm build`).
    *   **Single Test Run**: Not applicable as there are no tests.
    *   **Adding Tests**: If instructed to add tests, propose a setup using **Vitest** (fast, modern) or **Jest** (standard) compatible with Next.js 14. Do not install testing libraries without user permission.

## 2. Code Style & Conventions

### Architecture
*   **Framework**: Next.js 14 (App Router).
*   **Language**: TypeScript.
*   **Styling**: Tailwind CSS.
*   **State Management**: Zustand.
*   **Form Handling**: React Hook Form + Zod.

### File Structure
*   `src/app/`: Contains routes (`page.tsx`), layouts (`layout.tsx`), and route groups.
*   `src/app/components/`: Reusable UI components used across the application.
*   `src/app/sections/`: Larger, page-specific sections (e.g., `Hero`, `About`, `Services`).
*   `src/app/lib/`: Constants, static content data, schemas, and utility functions.
*   `src/app/store/`: Global state management stores (e.g., `uiStore.ts`).

### Component Guidelines
*   **Syntax**: Use `export default function ComponentName() { ... }`.
*   **Client vs. Server Components**:
    *   Default to Server Components (no directive) for better performance and SEO.
    *   Add `"use client";` at the very top of the file **only** if the component uses hooks (`useState`, `useEffect`, `useUIStore`) or event listeners (`onClick`, `onChange`).
*   **Props**: Explicitly type props using `interface` or `type`.
    ```typescript
    type Props = {
      title: string;
      description?: string;
      isActive: boolean;
    };
    
    export default function MyComponent({ title, description, isActive }: Props) {
      // ...
    }
    ```

### Imports
*   **Absolute Imports**: Always use the `@` alias for internal imports to maintain clean paths.
    *   ✅ `import Header from "@/src/app/components/Header";`
    *   ❌ `import Header from "../../components/Header";`
*   **Ordering**:
    1.  React / Next.js imports (e.g., `import { useEffect } from "react";`, `import Image from "next/image";`)
    2.  Third-party libraries (e.g., `import { create } from "zustand";`)
    3.  Internal components & libs (e.g., `import { SITE } from "@/src/app/lib/content";`)
    4.  Styles (if any separate CSS files, though uncommon with Tailwind)

### Naming Conventions
*   **Files**:
    *   Components: PascalCase (e.g., `Header.tsx`, `MobileMenu.tsx`).
    *   Utilities/Hooks/Stores: camelCase (e.g., `useUIStore.ts`, `content.ts`).
*   **Variables**: camelCase (e.g., `isActive`, `mobileMenuOpen`).
*   **Constants**: UPPER_CASE for static configuration (e.g., `SITE_NAME`, `NAV_ITEMS`).
*   **Types/Interfaces**: PascalCase (e.g., `ContactStatus`, `UIState`).

### Styling (Tailwind CSS)
*   Use utility classes directly in the `className` prop.
*   **Organization**: Group related utilities (layout -> spacing -> typography -> colors -> effects).
*   **Conditionals**: Use template literals for simple logic.
    ```tsx
    <div className={`fixed top-0 w-full ${isScrolled ? 'bg-white shadow' : 'bg-transparent'}`}>
    ```
*   **Responsive**: Use `sm:`, `md:`, `lg:` prefixes. Adopt a mobile-first approach (base styles are for mobile, overrides for larger screens).
*   **Colors**: Use the `brand` colors defined in `tailwind.config.ts` (e.g., `text-brand-accent`) if available, or project-specific slate/gray scales.

### State Management (Zustand)
*   Define stores in `src/app/store/`.
*   Follow the pattern found in `uiStore.ts`:
    *   Define the `State` type (data).
    *   Define the `Actions` type (setters/methods).
    *   Use `create<State & Actions>()` to initialize the store.
    *   Keep logic inside the store actions where possible to keep components clean.

### Type Safety (TypeScript)
*   **Strict Mode**: Enabled.
*   **No Implicit Any**: Explicitly type function arguments and return values if they are not inferred clearly.
*   **Zod**: Use Zod for schema validation, especially for forms (contact forms, etc.).
*   **Avoid**: `any`. Use `unknown` or specific union types instead.

### Error Handling
*   Wrap async calls (like API requests) in `try/catch` blocks.
*   Use UI feedback (toasts, error messages) for user-facing errors.
*   Log errors to console in development.

### Documentation
*   Keep comments minimal and focused on "why", not "what".
*   Self-documenting code (clear variable names) is preferred over heavy commenting.
*   Update this `AGENTS.md` if new architectural patterns are introduced.

## 3. Workflow Rules for Agents

1.  **Read First**: Before editing any file, always read it first to understand the context, imports, and existing patterns.
2.  **Verify**: After making changes, run `pnpm build` to check for compilation errors. This is the most reliable way to catch TypeScript issues.
3.  **Atomic Changes**: Keep changes focused on the requested task. Do not refactor unrelated code unless necessary.
4.  **Dependencies**: Do not add new `npm` dependencies without checking if an existing one can solve the problem or without explicit user permission.
5.  **Clean Up**: Remove unused imports and console logs (unless used for deliberate error logging) before finishing a task.
6.  **Safety**: Never commit secrets or API keys. Check for `.env` usage.

---
*Created by OpenCode Agent.*
