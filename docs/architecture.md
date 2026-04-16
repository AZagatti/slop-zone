# Architecture

## Framework: Qwik + Qwik City

This project uses **Qwik 1.19** with Qwik City (directory-based routing). Qwik is fundamentally different from React — understanding these differences is critical.

### Key Qwik Concepts

1. **`$()` and lazy loading** — Qwik uses `$()` to mark closures that should be serialized and lazy-loaded. Every event handler, effect, and callback must be wrapped with `$()`. Plain arrow functions inside components will break in production.

2. **`useSignal()` / `useStore()`** — Reactive state primitives. `useSignal` for single values, `useStore` for objects. Mutate `.value` (signal) or properties directly (store) to trigger re-renders.

3. **`useVisibleTask$()`** — Client-side only code (DOM access, intervals, event listeners). Runs after the component is visible in the browser. This is where game loops and DOM manipulation go.

4. **`useTask$()`** — Watcher that runs when tracked values change. Similar to React's `useEffect` but reactive.

5. **No `useEffect`** — Qwik does not have useEffect. Use `useVisibleTask$` or `useTask$`.

6. **Serializability** — Everything inside `$()` must be serializable. You cannot close over non-serializable values (DOM nodes, functions, class instances). Pass data, not references.

### Routing

Qwik City uses file-system routing in `src/routes/`:

- `index.tsx` → `/`
- `clicker/index.tsx` → `/clicker`
- `layout.tsx` → wraps all routes in the same directory

Layouts nest. The root `layout.tsx` provides `SlopNav`, `SlopFooter`, and the `Confetti` component.

### Important Rules

- **Never import React**. This is not a React project.
- **Never use `useState` or `useEffect`**. Use Qwik equivalents.
- **Always wrap event handlers with `$()`**.
- **Keep game logic in pure TypeScript** — the `src/game/` directory has zero Qwik imports and is fully testable.

## Build Pipeline

```
bun run build
  → tsc --incremental --noEmit    (type checking)
  → vite build                     (client bundle)
  → ultracite check                (linting)
```

The build runs type checking, then Vite bundling, then lint. All three must pass for a successful build.

## State Management

- **UI state** — Qwik's `useSignal` and `useStore` in components
- **Game state** — Pure TypeScript in `src/game/state.ts`, persisted to `localStorage` via JSON serialize/deserialize
- **No global state store** — State lives in the component that needs it and is passed down via props

## Styling Approach

- Tailwind CSS 3 for utility classes
- Custom CSS utilities in `src/global.css` (`.slop-card`, `.slop-btn`, `.text-gradient`, etc.)
- Custom Tailwind theme in `tailwind.config.js` (`slop.*` color tokens, animations)
- No CSS modules, no CSS-in-JS, no styled-components
- Comic Sans for headers (`font-comic`), Inter for body, JetBrains Mono for code

## Dependencies

| Package                 | Purpose           | Notes                                                           |
| ----------------------- | ----------------- | --------------------------------------------------------------- |
| `@builder.io/qwik`      | Framework         | Core runtime                                                    |
| `@builder.io/qwik-city` | Routing, SSR      | Directory-based routing                                         |
| `tailwindcss`           | Styling           | v3, not v4                                                      |
| `motion`                | Animations        | FKA framer-motion. Import from `"motion"` not `"framer-motion"` |
| `gsap`                  | Scroll animations | Used for ScrollTrigger effects                                  |
| `canvas-confetti`       | Confetti effects  | Loaded via dynamic import, stored on `window`                   |
| `ultracite`             | Linting           | Wraps Biome with presets                                        |
| `vitest`                | Testing           | Config in `vite.config.ts`                                      |

## File Naming

- Components: `kebab-case/kebab-case.tsx` (e.g., `slop-nav/slop-nav.tsx`)
- Utilities: `kebab-case.ts` (e.g., `slop-text.ts`)
- Routes: `index.tsx` inside directory (e.g., `routes/clicker/index.tsx`)
- Tests: `__tests__/filename.test.ts` (e.g., `game/__tests__/state.test.ts`)

## Mobile-First

All pages are built mobile-first. The `SlopNav` has a hamburger menu for mobile. Touch targets are large. The clicker game is fully playable on mobile. Use `responsive:` prefixes in Tailwind for breakpoints.

## No Comments Policy

Code should not contain comments unless explicitly requested. Function and variable names should be self-documenting.
