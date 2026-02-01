# AGENTS.md

This file contains essential information for agentic coding agents working in this
repository.

## Project Overview

Levanta.me is a Next.js 16 productivity tracker application with automatic face detection
capabilities. It helps users track work and rest time with camera-based presence detection
and notification systems.

## Commands

### Development

- `pnpm run dev` - Start development server (Next.js)
- `pnpm run build` - Build production application
- `pnpm run start` - Start production server

### Code Quality

- `pnpm run lint` - Run ESLint on app, components, hooks, and lib directories
- `pnpm run format` - Format code with Prettier
- `pnpm run prepare` - Set up Husky git hooks

### Testing

This project does not have explicit test commands configured. Check for test files or ask
the user for test commands.

## Code Style Guidelines

### Import Organization

- Use ES6 imports/exports
- Import order: React → third-party → local imports (prefixed with @/)
- Use absolute imports with @/ alias for internal modules
- Example import structure:
  ```tsx
  import React from 'react'
  import { Button } from '@/components/ui/button'
  import { useWorkTimerStore } from '@/lib/store'
  ```

### TypeScript & Types

- Use TypeScript with strict mode enabled
- Define interfaces and types for props and complex objects
- Use `React.ComponentProps` for extending component props
- Prefer type annotations over interfaces when appropriate
- Use `Readonly` for immutable props where applicable

### Naming Conventions

- Components: PascalCase (e.g., `WorkTimer`, `HelpDialog`)
- Functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case for components, PascalCase for main component files
- Hooks: use camelCase prefix (e.g., `useFaceDetection`)

### File Structure

```
app/          # Next.js app router pages
components/   # React components
  ui/        # Reusable UI components (shadcn/ui)
hooks/       # Custom React hooks
lib/         # Utilities, stores, and shared logic
```

### Formatting Rules (Prettier)

- Print width: 90 characters
- Use tabs (2 width)
- No semicolons
- Single quotes for strings
- Trailing commas: ES5
- Arrow parens: avoid when possible
- Bracket spacing: enabled
- JSX single quotes: enabled

### ESLint Configuration

- React with hooks enforcement
- TypeScript strict rules
- Import sorting with member sorting
- Padding between statements (before returns, after declarations)
- React prop sorting (callbacks last, shorthand first)
- Self-closing components when possible

### Component Patterns

- Use `'use client'` directive for client components
- Export named components with descriptive names
- Use compound variants with class-variance-authority (CVA) for UI components
- Implement proper cleanup in useEffect hooks
- Use useCallback for event handlers and memoized functions

### State Management

- Use Zustand for global state (see `lib/store.ts`)
- Local state with useState for component-specific data
- Proper TypeScript typing for all state

### Styling

- Use Tailwind CSS with CSS-in-JS approach
- Utilize the `cn()` utility function for conditional classes
- Follow shadcn/ui component patterns
- Implement dark mode support with proper class toggling

### Error Handling

- Use try-catch blocks for async operations
- Implement proper error states and loading states
- Console logging for development (warn/error/info allowed)
- User-friendly error messages for camera/feature failures

### Accessibility

- Use semantic HTML elements
- Implement proper ARIA labels and descriptions
- Screen reader support with sr-only classes
- Keyboard navigation support

## Key Libraries & Patterns

### UI Framework

- Next.js 16 with App Router
- React 19 with TypeScript
- Tailwind CSS for styling
- Radix UI primitives for accessible components

### State & Data

- Zustand for global state management
- React Hook Form with Zod validation
- Immer for immutable state updates

### Special Features

- Face detection with @vladmandic/face-api
- Telegram bot integration for notifications
- Camera access with MediaDevices API
- Local storage for persistence

## Best Practices

1. Always run `pnpm run lint` and `pnpm run format` before committing
2. Use the `cn()` utility for conditional class names
3. Implement proper cleanup in useEffect hooks (especially for camera/intervals)
4. Follow the existing component patterns in the codebase
5. Use TypeScript strictly - no `any` types unless absolutely necessary
6. Implement loading states and error boundaries where appropriate
7. Test camera/feature permissions before use
8. Use semantic HTML and proper accessibility attributes
9. Follow the established naming and file organization patterns
10. Ensure dark mode compatibility for all new components
