# Contributing to SLOP.ZONE

## Prerequisites

- [Bun](https://bun.sh) (not npm, not yarn, not pnpm)
- Node.js 18.17+ or 20.3+

## Setup

```bash
bun install
bun run dev
```

Dev server runs at `http://localhost:5173` with SSR mode.

## Development Workflow

1. Create a branch from `main`
2. Make changes
3. Run `bun run lint` — fix any issues
4. Run `bun run test` — all 23 tests must pass
5. Run `bun run build` — full build must succeed (types + client + lint)
6. Commit with a descriptive message

## Before Every Commit

```bash
bun run fix       # Auto-fix lint issues
bun run test      # Run tests
bun run build     # Full build verification
```

The build command runs `tsc` → `vite build` → `ultracite check` sequentially. All three must pass.

## Code Conventions

### No Comments

Do not add comments to code. Use descriptive names instead.

### Qwik, Not React

- Use `component$()` not `function Component()`
- Use `useSignal()` not `useState()`
- Use `useVisibleTask$()` not `useEffect()`
- Always wrap event handlers with `$()`
- Closures inside `$()` must be serializable (no DOM nodes, class instances, or functions)

### Game Logic: Pure TypeScript

All game mechanics go in `src/game/state.ts` or `src/game/format.ts`. These files have **zero Qwik imports**. This keeps them testable and separates concerns.

If you need game state in a component, import the pure functions and call them inside `useVisibleTask$` or event handlers.

### Styling

- Use Tailwind utility classes
- Use custom utilities from `global.css` (`.slop-card`, `.slop-btn`, `.text-gradient`, etc.)
- Use `slop-*` color tokens, not arbitrary hex values
- Mobile-first: write mobile styles, then add `md:` and `lg:` overrides

### File Organization

- New page → `src/routes/page-name/index.tsx`
- New component → `src/components/component-name/component-name.tsx`
- New utility → `src/utils/utility-name.ts`
- Game logic → `src/game/`
- Tests → `src/**/__tests__/*.test.ts`

### Naming

- Files and directories: `kebab-case`
- Components: PascalCase exports
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE for arrays/objects, camelCase for functions
- CSS classes: kebab-case utilities, `slop-` prefix for custom ones

## Testing

Tests use Vitest. All game engine tests are in `src/game/__tests__/`.

```bash
bun run test          # Run once
bun run test.watch    # Watch mode
```

When adding game features:

1. Write tests first (TDD)
2. Add pure functions to `src/game/state.ts`
3. Wire into the UI component

## Linting

Ultracite wraps Biome with opinionated presets (`ultracite/biome/core` + `ultracite/biome/qwik`).

```bash
bun run lint    # Check
bun run fix     # Auto-fix
```

Config is in `biome.jsonc`. Key overrides:

- `noUnusedVariables`: warn (not error)
- `noQwikUseVisibleTask`: off (we use it intentionally)
- `useSortedClasses`: off (Tailwind sorting is disabled)
- `noUnknownAtRules`: off (Tailwind directives)
- `lineWidth`: 120

## Common Pitfalls

### Qwik Lexical Scope

If you see `Non-serializable expression must be wrapped with $(...)`:

- If inside a component → wrap with `$()`
- If in a plain function (not a component) → it's a false positive from the Qwik preset. Suppress with `// biome-ignore lint/correctness/useQwikValidLexicalScope: false positive`

### Window Access

Always cast through `unknown`: `(window as unknown as Record<string, unknown>)` — TypeScript won't allow direct casts from `Window`.

### Dynamic Imports

Use `await import("module")` inside `useVisibleTask$()` for client-only modules like `canvas-confetti`.

## Feature Roadmap

Planned but not yet built:

- Era-specific visual themes (backgrounds, fonts, sounds per era)
- Buzzword Bingo mini-feature
- Research Tree visual
- Employee Morale UI (meter + "Pizza Party" button)
- Golden Hashtag (random clickable buff, like Cookie Clicker's golden cookie)
- "Content Calendar" minigame
- "A/B Testing" minigame
- "Stakeholder Meeting" stock market minigame
- GSAP ScrollTrigger animations on generate, hall pages
- More quiz questions and difficulty levels
- Era-specific 8-bit sound design
