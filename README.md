# SLOP.ZONE

The internet's premier destination for AI-generated chaos. A satirical clicker game and content generator wrapped in maximum corporate buzzword energy.

**[Live Site](https://slop.zone)**

## What is this?

SLOP.ZONE is a humorous, chaotic web experience built around "slop" — the AI-generated, SEO-optimized, buzzword-laden content flooding the internet. It features:

- **Slop Clicker** — A full idle/clicker game with 12 generator tiers, 30 achievements, prestige (Rebrand), random events, era progression, and localStorage persistence
- **Slop Generator** — Markov-chain powered corporate nonsense text generator
- **Hall of Slop** — Fake testimonials and awards celebrating terrible AI content
- **Is This AI? Quiz** — Test your ability to spot AI-generated content

## Tech Stack

| Layer           | Choice                                    |
| --------------- | ----------------------------------------- |
| Framework       | [Qwik](https://qwik.dev) 1.19 + Qwik City |
| Styling         | Tailwind CSS 3 + custom utilities         |
| Animations      | Motion (`motion`), GSAP, CSS keyframes    |
| Effects         | canvas-confetti (emoji shapes)            |
| Sound           | Web Audio API (8-bit bleeps)              |
| Linting         | Ultracite + Biome (with Qwik preset)      |
| Testing         | Vitest (23 tests, TDD)                    |
| Package Manager | Bun                                       |
| Build           | Vite + Qwik optimizer                     |

## Quick Start

```bash
bun install
bun run dev
```

## Scripts

```bash
bun run dev          # Start dev server (SSR mode)
bun run build        # Production build (types → client → lint)
bun run preview      # Preview production build locally
bun run test         # Run tests (vitest)
bun run test.watch   # Run tests in watch mode
bun run lint         # Check linting (ultracite/biome)
bun run fix          # Auto-fix lint issues
bun run check        # Alias for lint
```

## Project Structure

```
src/
├── components/
│   ├── confetti/        # canvas-confetti wrapper with emoji shapes
│   ├── router-head/     # Qwik City head management
│   ├── slop-button/     # Reusable gradient button
│   ├── slop-footer/     # Scrolling marquee legal text
│   └── slop-nav/        # Fixed nav with mobile hamburger + glitch animation
├── game/
│   ├── state.ts         # Pure TS game engine (no Qwik deps)
│   ├── format.ts        # Number formatting (K/M/B/T/Qa/Qi)
│   └── __tests__/       # 23 vitest tests
├── utils/
│   ├── chaos.ts         # Random helpers, emoji arrays, tilt values
│   ├── slop-text.ts     # Markov chain slop text generator
│   └── sounds.ts        # Web Audio API 8-bit sound effects
├── routes/
│   ├── layout.tsx       # Root layout (nav + footer + confetti)
│   ├── index.tsx        # Landing page
│   ├── clicker/         # Slop Clicker game
│   ├── generate/        # Slop text generator
│   ├── hall/            # Hall of Slop testimonials
│   └── quiz/            # "Is This AI?" quiz
├── global.css           # Tailwind + custom utilities
└── root.tsx             # QwikCityProvider + RouterHead
```

## Design System

**"Controlled Chaos"** — 8px grid, chaotic content, clean engineering.

| Token       | Value          |
| ----------- | -------------- |
| Background  | `#0F0F1A`      |
| Surface     | `#1A1A2E`      |
| Purple      | `#8B5CF6`      |
| Pink        | `#EC4899`      |
| Cyan        | `#22D3EE`      |
| Yellow      | `#FACC15`      |
| Green       | `#34D399`      |
| Orange      | `#FB923C`      |
| Header font | Comic Sans MS  |
| Body font   | Inter          |
| Mono font   | JetBrains Mono |

CSS utilities: `.text-gradient`, `.glow-border`, `.slop-card`, `.slop-btn`, `.comic-title`, `.tilt-1/2/3`, `.animate-gradient-bg`

## Game Engine

The clicker game engine lives in `src/game/state.ts` and is pure TypeScript with zero Qwik dependencies. See `docs/game-engine.md` for full details.

## Documentation

Full docs for contributors and AI agents:

- [`docs/architecture.md`](docs/architecture.md) — System architecture and conventions
- [`docs/game-engine.md`](docs/game-engine.md) — Clicker game engine API reference
- [`docs/design-system.md`](docs/design-system.md) — Colors, typography, components, animations
- [`docs/contributing.md`](docs/contributing.md) — How to add features, run tests, follow conventions

## License

MIT
