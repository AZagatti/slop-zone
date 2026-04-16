import { describe, expect, it } from "vitest";
import {
  applyEvent,
  buyGenerator,
  calculateBrandEquityGain,
  calculateSPS,
  checkAchievements,
  createGameState,
  generateRandomEvent,
  getEra,
  getGeneratorCost,
  getMilestoneMultiplier,
  handleClick,
  handleTick,
  loadGame,
  rebrand,
  saveGame,
} from "../state";

describe("GameState", () => {
  it("initializes with default values", () => {
    const state = createGameState();
    expect(state.slopCount).toBe(0);
    expect(state.totalSlopGenerated).toBe(0);
    expect(state.totalClicks).toBe(0);
    expect(state.slopPerClick).toBe(1);
    expect(state.generators).toHaveLength(12);
    expect(state.generators[0].owned).toBe(0);
    expect(state.brandEquity).toBe(0);
    expect(state.rebrandCount).toBe(0);
    expect(state.achievements).toEqual([]);
  });

  it("calculates cost for a generator correctly", () => {
    const state = createGameState();
    expect(getGeneratorCost(state, 0)).toBe(15);
    state.generators[0].owned = 1;
    expect(getGeneratorCost(state, 0)).toBeGreaterThan(15);
  });

  it("buys a generator when affordable", () => {
    const state = createGameState();
    state.slopCount = 100;
    const result = buyGenerator(state, 0, 1);
    expect(result.success).toBe(true);
    expect(state.generators[0].owned).toBe(1);
    expect(state.slopCount).toBeLessThan(100);
  });

  it("rejects purchase when not enough slop", () => {
    const state = createGameState();
    state.slopCount = 5;
    const result = buyGenerator(state, 0, 1);
    expect(result.success).toBe(false);
    expect(state.generators[0].owned).toBe(0);
  });

  it("buys in bulk (10x)", () => {
    const state = createGameState();
    state.slopCount = 500;
    const result = buyGenerator(state, 0, 10);
    expect(result.success).toBe(true);
    expect(state.generators[0].owned).toBe(10);
  });

  it("calculates total SPS correctly", () => {
    const state = createGameState();
    state.generators[0].owned = 5;
    expect(calculateSPS(state)).toBeGreaterThan(0);
  });

  it("handles click with correct slop gain", () => {
    const state = createGameState();
    const gained = handleClick(state);
    expect(gained).toBe(1);
    expect(state.slopCount).toBe(1);
    expect(state.totalClicks).toBe(1);
  });

  it("handles tick correctly (passive income)", () => {
    const state = createGameState();
    state.generators[0].owned = 10;
    const gained = handleTick(state, 1);
    expect(gained).toBeGreaterThan(0);
    expect(state.slopCount).toBeGreaterThan(0);
  });

  it("prestige/rebrand resets slop but grants brand equity", () => {
    const state = createGameState();
    state.slopCount = 1_000_000;
    state.totalSlopGenerated = 1_000_000;
    state.generators[0].owned = 10;

    const brandGain = calculateBrandEquityGain(state);
    expect(brandGain).toBeGreaterThan(0);

    rebrand(state);
    expect(state.slopCount).toBe(0);
    expect(state.generators[0].owned).toBe(0);
    expect(state.brandEquity).toBe(brandGain);
    expect(state.rebrandCount).toBe(1);
  });

  it("brand equity gives SPS multiplier", () => {
    const state = createGameState();
    state.generators[0].owned = 10;
    const baseSPS = calculateSPS(state);

    state.brandEquity = 50;
    const boostedSPS = calculateSPS(state);
    expect(boostedSPS).toBeGreaterThan(baseSPS);
  });

  it("milestone bonus at 10/25/50/100 owned", () => {
    const state = createGameState();
    expect(getMilestoneMultiplier(state, 0)).toBe(1);

    state.generators[0].owned = 10;
    const at10 = getMilestoneMultiplier(state, 0);
    expect(at10).toBeGreaterThan(1);

    state.generators[0].owned = 25;
    const at25 = getMilestoneMultiplier(state, 0);
    expect(at25).toBeGreaterThan(at10);
  });
});

describe("Achievements", () => {
  it("checks and unlocks achievements", () => {
    const state = createGameState();
    state.totalSlopGenerated = 100;
    const newA = checkAchievements(state);
    expect(newA.length).toBeGreaterThan(0);
    expect(newA[0]).toHaveProperty("id");
  });

  it("does not re-unlock already earned achievements", () => {
    const state = createGameState();
    state.totalSlopGenerated = 100;
    checkAchievements(state);
    const second = checkAchievements(state);
    expect(second.length).toBe(0);
  });
});

describe("Random Events", () => {
  it("generates a random event", () => {
    const state = createGameState();
    const event = generateRandomEvent(state);
    expect(event).toHaveProperty("type");
    expect(event).toHaveProperty("duration");
    expect(event).toHaveProperty("multiplier");
  });

  it("applies event multiplier to SPS", () => {
    const state = createGameState();
    state.generators[0].owned = 10;
    const baseSPS = calculateSPS(state);
    const activeEvent = {
      type: "viral" as const,
      duration: 30,
      multiplier: 7,
      remaining: 30,
    };
    expect(applyEvent(state, activeEvent)).toBe(baseSPS * 7);
  });
});

describe("Era Progression", () => {
  it("determines era from total slop generated", () => {
    expect(getEra(0).id).toBe("garage");
    expect(getEra(1000).id).toBe("growth");
    expect(getEra(10_000_000).id).toBe("scale");
    expect(getEra(100_000_000_000).id).toBe("singularity");
    expect(getEra(1_000_000_000_000).id).toBe("enshittification");
  });
});

describe("Save/Load", () => {
  it("serializes and deserializes game state", () => {
    const state = createGameState();
    state.slopCount = 42_000;
    state.generators[0].owned = 5;
    state.totalClicks = 100;

    const serialized = saveGame(state);
    expect(typeof serialized).toBe("string");

    const loaded = loadGame(serialized);
    expect(loaded.slopCount).toBe(42_000);
    expect(loaded.generators[0].owned).toBe(5);
    expect(loaded.totalClicks).toBe(100);
  });
});
