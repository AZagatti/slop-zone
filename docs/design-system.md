# Design System

## "Controlled Chaos"

The design philosophy is intentional contradiction: the content and vibe are chaotic and absurd, but the underlying code and layout are clean, aligned, and responsive.

## Color Palette

All colors are defined both as Tailwind tokens (`slop-*`) and CSS custom properties (`--color-*`).

| Token      | Hex       | Tailwind Class     | Usage                |
| ---------- | --------- | ------------------ | -------------------- |
| Background | `#0F0F1A` | `bg-slop-bg`       | Page background      |
| Surface    | `#1A1A2E` | `bg-slop-surface`  | Cards, panels        |
| Purple     | `#8B5CF6` | `text-slop-purple` | Primary accent       |
| Pink       | `#EC4899` | `text-slop-pink`   | Secondary accent     |
| Cyan       | `#22D3EE` | `text-slop-cyan`   | Tertiary accent      |
| Yellow     | `#FACC15` | `text-slop-yellow` | Highlights, warnings |
| Green      | `#34D399` | `text-slop-green`  | Success, positive    |
| Orange     | `#FB923C` | `text-slop-orange` | Danger, events       |

### Gradient Usage

The primary gradient is `135deg, purple → pink → cyan`. Used for:

- `.text-gradient` — Animated gradient text
- `.glow-border` — Animated border glow
- `.slop-btn` — Button backgrounds

## Typography

| Role         | Font                    | Tailwind Class |
| ------------ | ----------------------- | -------------- |
| Headers      | Comic Sans MS           | `font-comic`   |
| Body         | Inter (400/600/700/900) | Default        |
| Code/Numbers | JetBrains Mono          | `font-mono`    |

Loaded via Google Fonts `@import` in `global.css`.

## Grid

8px base grid. All spacing should be multiples of 8 (`p-2`, `p-4`, `p-6`, `p-8`, `gap-4`, `gap-8`).

## CSS Utilities

Defined in `src/global.css` under `@layer utilities`:

### `.text-gradient`

Animated gradient text (purple → pink → cyan). Apply to any text element.

### `.glow-border`

Animated gradient border glow effect. Uses `::before` pseudo-element.

### `.slop-card`

Standard card style: `bg-slop-surface rounded-2xl p-6 border border-white/10 backdrop-blur-sm`.

### `.slop-btn`

Gradient button: `px-6 py-3 rounded-xl font-bold text-white` with purple → pink gradient and hover glow.

### `.comic-title`

Sets `font-family: Comic Sans MS` for headers.

### `.tilt-1`, `.tilt-2`, `.tilt-3`

Subtle rotations: -1deg, +1.5deg, -2deg. Apply to cards or elements for "chaotic" feel.

### `.animate-gradient-bg`

300% background-size with animated gradient for full-width elements.

## Tailwind Animations

Defined in `tailwind.config.js`:

| Class                  | Effect                              | Duration |
| ---------------------- | ----------------------------------- | -------- |
| `animate-glow-pulse`   | Purple → pink box-shadow pulse      | 2s       |
| `animate-float`        | Y-axis floating                     | 3s       |
| `animate-shake`        | Horizontal shake + rotation         | 0.5s     |
| `animate-marquee`      | Horizontal scroll (right to left)   | 30s      |
| `animate-gradient-x`   | Background position animation       | 3s       |
| `animate-spin-slow`    | Slow rotation                       | 8s       |
| `animate-bounce-crazy` | Scale + rotate bounce               | 0.6s     |
| `animate-typewriter`   | Width expansion (typewriter effect) | 2s       |

## Components

### SlopNav (`src/components/slop-nav/`)

- Fixed position top nav
- Logo with glitch CSS animation
- Desktop: horizontal link list
- Mobile: hamburger → slide-down menu
- Active route highlighting

### SlopFooter (`src/components/slop-footer/`)

- Scrolling marquee of fake legal text
- Uses `animate-marquee`

### Confetti (`src/components/confetti/`)

- Wraps `canvas-confetti` with dynamic import
- `fireConfetti(emojis?)` — Full-screen emoji confetti burst
- `fireConfettiSmall()` — Small burst with brand colors
- Confetti module stored on `window` for access from plain functions

### SlopButton (`src/components/slop-button/`)

- Reusable gradient button component
- Wraps `.slop-btn` utility class

## Sound Effects

`src/utils/sounds.ts` — Web Audio API 8-bit sounds:

| Function        | Sound               |
| --------------- | ------------------- |
| `playBeep()`    | Short beep          |
| `playClick()`   | UI click            |
| `playSuccess()` | Success chime       |
| `playError()`   | Error buzz          |
| `playBigWin()`  | Achievement fanfare |

## Responsive Breakpoints

Mobile-first. Key breakpoints:

- Default: Mobile (< 768px)
- `md:` Tablet and up (768px+)
- `lg:` Desktop (1024px+)

The nav switches to hamburger at `md:`. The clicker game layout is single-column on mobile, multi-column on `lg:`.

## Adding New Styles

1. **One-off utility** → Use Tailwind classes directly
2. **Reusable pattern** → Add to `@layer utilities` in `global.css`
3. **New animation** → Add keyframes + animation to `tailwind.config.js`
4. **New color** → Add to both `tailwind.config.js` (under `slop`) and `:root` in `global.css`
