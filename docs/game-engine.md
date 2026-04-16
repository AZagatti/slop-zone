# Game Engine

The Slop Clicker game engine is in `src/game/state.ts` and `src/game/format.ts`. It is **pure TypeScript** with zero Qwik or DOM dependencies, making it fully testable in isolation.

## Core Types

### `GameState`

The entire game state is a single serializable object:

```typescript
interface GameState {
  slopCount: number; // Current slop (currency)
  totalSlopGenerated: number; // Lifetime total (across all sessions, resets on rebrand)
  totalClicks: number; // Lifetime clicks
  slopPerClick: number; // Base slop per click
  generators: Generator[]; // 12 generator tiers
  brandEquity: number; // Prestige currency
  rebrandCount: number; // Number of prestiges
  achievements: string[]; // Unlocked achievement IDs
  activeEvents: ActiveEvent[]; // Currently running random events
  morale: number; // Employee morale (0-100, decays over time)
  lastSaveTime: number; // Unix timestamp for offline earnings
  researchCompleted: string[]; // Placeholder for research tree
  bingoWords: string[]; // Placeholder for buzzword bingo
  version: number; // Save format version (currently 1)
}
```

### `Generator`

Each of the 12 tiers:

```typescript
interface Generator {
  id: string; // Machine name (e.g., "intern", "farm")
  name: string; // Display name (e.g., "Intern with ChatGPT")
  emoji: string; // Display emoji
  description: string; // Short description
  baseCost: number; // Cost of first purchase
  costMultiplier: number; // Cost growth per purchase (always 1.15)
  baseOutput: number; // Slop per second per unit
  owned: number; // How many the player owns
  upgrades: number; // Upgrade count (each doubles output)
}
```

### Generator Tiers

| #   | ID        | Name                     | Base Cost          | Base Output  |
| --- | --------- | ------------------------ | ------------------ | ------------ |
| 0   | intern    | Intern with ChatGPT      | 15                 | 0.1/s        |
| 1   | farm      | Content Farm             | 100                | 1/s          |
| 2   | seo       | SEO Keyword Sprayer      | 1,100              | 8/s          |
| 3   | linkedin  | LinkedIn Thought Leader  | 12,000             | 47/s         |
| 4   | medium    | Medium Essay Mill        | 130,000            | 260/s        |
| 5   | ai_seo    | AI SEO Empire            | 1,400,000          | 1,400/s      |
| 6   | substack  | Substack Clone Network   | 20,000,000         | 7,800/s      |
| 7   | startup   | VC-Backed Startup        | 330,000,000        | 44,000/s     |
| 8   | synergy   | Corporate Synergy Engine | 5,100,000,000      | 260,000/s    |
| 9   | swarm     | AI Agent Swarm           | 75,000,000,000     | 1,600,000/s  |
| 10  | metaverse | Metaverse Content Portal | 1,000,000,000,000  | 10,000,000/s |
| 11  | algorithm | The Algorithm Itself     | 14,000,000,000,000 | 65,000,000/s |

## Cost Formula

```
cost(n) = floor(baseCost * costMultiplier ^ owned)  // for the next unit
totalCostFor(n) = sum of cost(owned) to cost(owned + n - 1)
```

## SPS (Slop Per Second) Calculation

```typescript
calculateSPS(state) =
  sum(
    generators[i].baseOutput *
      generators[i].owned *
      milestoneMultiplier(i) *
      upgradeMultiplier(i),
  ) *
  brandMultiplier *
  moraleMultiplier;
```

Where:

- `milestoneMultiplier` = product of all reached milestone bonuses
- `upgradeMultiplier` = `2 ^ upgrades`
- `brandMultiplier` = `1 + brandEquity * 0.02`
- `moraleMultiplier` = `0.5 + (morale / 100) * 0.5`

## Milestone Bonuses

Owned thresholds that multiply output for that generator:

| Owned | Multiplier |
| ----- | ---------- |
| 10    | 2x         |
| 25    | 3x         |
| 50    | 5x         |
| 100   | 10x        |
| 200   | 25x        |
| 500   | 100x       |

Milestones stack multiplicatively (e.g., owning 100 gives 2 _ 3 _ 5 \* 10 = 300x).

## Bulk Buy

The UI supports buying 1x, 10x, 100x, or MAX units. `buyGenerator(state, index, count)` handles this:

- `count = -1` means "buy max"
- Falls back to affordable amount if requested count is too expensive

## Prestige: Rebrand System

`rebrand(state)` resets all progress except:

- Brand Equity (gained)
- Rebrand count (incremented)
- Achievements (kept)

Brand Equity gain = `floor(sqrt(totalSlopGenerated / 1000))`

Each point of Brand Equity gives a permanent +2% SPS multiplier.

## Achievements

30 achievements across 6 categories: `production`, `clicks`, `prestige`, `generator`, `shadow`, `event`.

`checkAchievements(state)` returns newly unlocked achievements (those whose `condition` returns true and aren't yet in `state.achievements`).

Shadow achievements are hidden/secret (e.g., "Nice" at 69,000 clicks, "Blaze It" at 420K slop).

## Random Events

6 event types triggered randomly:

| Event            | Weight | Multiplier | Duration | Flavor                     |
| ---------------- | ------ | ---------- | -------- | -------------------------- |
| Viral            | 30     | 7x         | 30s      | "Your content went viral!" |
| Brand Deal       | 25     | 1x         | 0s       | Instant bonus              |
| AI Hype          | 15     | 10x        | 60s      | "AI is the future!"        |
| Cancel Culture   | 10     | 0.5x       | 30s      | Negative event             |
| Bull Market      | 15     | 777x       | 13s      | Rare jackpot               |
| Algorithm Update | 5      | 3x         | 45s      | "The algorithm changed"    |

## Era Progression

5 eras based on `totalSlopGenerated`:

| Era                  | Threshold         | Emoji |
| -------------------- | ----------------- | ----- |
| Garage Startup       | 0                 | 🏠    |
| Growth Phase         | 1,000             | 📈    |
| Scale Empire         | 10,000,000        | 🏢    |
| AI Singularity       | 100,000,000,000   | 🤖    |
| The Enshittification | 1,000,000,000,000 | 💀    |

Each era has a `bgClass` for the clicker page background gradient.

## Save/Load

```typescript
saveGame(state): string    // JSON.stringify
loadGame(json): GameState  // JSON.parse + merge with fresh state for forward compat
```

The UI auto-saves every 5 seconds and on page unload. On load, it calculates offline earnings using `getOfflineEarnings(state, awaySeconds)` at 50% efficiency.

## Number Formatting

`src/game/format.ts` provides `formatNumber(n)`:

| Range         | Suffix | Example |
| ------------- | ------ | ------- |
| < 1,000       | none   | 999     |
| 1K - 999.9K   | K      | 1.5K    |
| 1M - 999.9M   | M      | 42.0M   |
| 1B - 999.9B   | B      | 1.0B    |
| 1T - 999.9T   | T      | 7.5T    |
| 1Qa - 999.9Qa | Qa     | 3.2Qa   |
| >= 1Qi        | Qi     | 1.0Qi   |

## Testing

23 tests in `src/game/__tests__/`:

- `state.test.ts` — Game state creation, buying generators, SPS calculation, milestones, upgrades, rebranding, achievements, events, eras, save/load, offline earnings
- `format.test.ts` — Number formatting for all suffixes and edge cases

Run with `bun run test`. All tests must pass before merging.

## Adding New Features

To add a new generator tier: add to `GENERATOR_DEFS` array. The game auto-adapts.

To add a new achievement: add to `ACHIEVEMENTS` array with a `condition` function.

To add a new event type: add to the `events` array in `generateRandomEvent()`.

To add a new era: add to `ERAS` array with ascending `threshold`.
