export interface Generator {
  baseCost: number;
  baseOutput: number;
  costMultiplier: number;
  description: string;
  emoji: string;
  id: string;
  name: string;
  owned: number;
  upgrades: number;
}

export interface Achievement {
  category: "production" | "clicks" | "prestige" | "generator" | "shadow" | "event";
  condition: (state: GameState) => boolean;
  description: string;
  emoji: string;
  id: string;
  name: string;
}

export type EventType = "viral" | "brandDeal" | "aiHype" | "cancelCulture" | "bullMarket" | "algorithmUpdate";

export interface ActiveEvent {
  duration: number;
  multiplier: number;
  remaining: number;
  type: EventType;
}

export interface Era {
  bgClass: string;
  description: string;
  emoji: string;
  id: string;
  name: string;
  threshold: number;
}

export interface GameState {
  achievements: string[];
  activeEvents: ActiveEvent[];
  bingoWords: string[];
  brandEquity: number;
  generators: Generator[];
  lastSaveTime: number;
  morale: number;
  rebrandCount: number;
  researchCompleted: string[];
  slopCount: number;
  slopPerClick: number;
  totalClicks: number;
  totalSlopGenerated: number;
  version: number;
}

export const ERAS: Era[] = [
  {
    id: "garage",
    name: "Garage Startup",
    emoji: "🏠",
    threshold: 0,
    bgClass: "from-slop-bg via-slop-surface to-slop-bg",
    description: "Two interns in a garage. Dreaming big.",
  },
  {
    id: "growth",
    name: "Growth Phase",
    emoji: "📈",
    threshold: 1000,
    bgClass: "from-slop-bg via-slop-purple/20 to-slop-bg",
    description: "We got funding!",
  },
  {
    id: "scale",
    name: "Scale Empire",
    emoji: "🏢",
    threshold: 10_000_000,
    bgClass: "from-slop-bg via-slop-cyan/20 to-slop-bg",
    description: "We're a platform now.",
  },
  {
    id: "singularity",
    name: "AI Singularity",
    emoji: "🤖",
    threshold: 100_000_000_000,
    bgClass: "from-slop-bg via-slop-pink/20 to-slop-bg",
    description: "The content is writing itself.",
  },
  {
    id: "enshittification",
    name: "The Enshittification",
    emoji: "💀",
    threshold: 1_000_000_000_000,
    bgClass: "from-slop-bg via-slop-orange/20 to-slop-bg",
    description: "Cory Doctorow was right.",
  },
];

export const GENERATOR_DEFS: Omit<Generator, "owned" | "upgrades">[] = [
  {
    id: "intern",
    name: "Intern with ChatGPT",
    emoji: "🎒",
    description: "+0.1 slop/sec",
    baseCost: 15,
    costMultiplier: 1.15,
    baseOutput: 0.1,
  },
  {
    id: "farm",
    name: "Content Farm",
    emoji: "🏭",
    description: "+1 slop/sec",
    baseCost: 100,
    costMultiplier: 1.15,
    baseOutput: 1,
  },
  {
    id: "seo",
    name: "SEO Keyword Sprayer",
    emoji: "🔍",
    description: "+8 slop/sec",
    baseCost: 1100,
    costMultiplier: 1.15,
    baseOutput: 8,
  },
  {
    id: "linkedin",
    name: "LinkedIn Thought Leader",
    emoji: "💼",
    description: "+47 slop/sec",
    baseCost: 12_000,
    costMultiplier: 1.15,
    baseOutput: 47,
  },
  {
    id: "medium",
    name: "Medium Essay Mill",
    emoji: "📝",
    description: "+260 slop/sec",
    baseCost: 130_000,
    costMultiplier: 1.15,
    baseOutput: 260,
  },
  {
    id: "ai_seo",
    name: "AI SEO Empire",
    emoji: "🤖",
    description: "+1.4K slop/sec",
    baseCost: 1_400_000,
    costMultiplier: 1.15,
    baseOutput: 1400,
  },
  {
    id: "substack",
    name: "Substack Clone Network",
    emoji: "📧",
    description: "+7.8K slop/sec",
    baseCost: 20_000_000,
    costMultiplier: 1.15,
    baseOutput: 7800,
  },
  {
    id: "startup",
    name: "VC-Backed Startup",
    emoji: "🚀",
    description: "+44K slop/sec",
    baseCost: 330_000_000,
    costMultiplier: 1.15,
    baseOutput: 44_000,
  },
  {
    id: "synergy",
    name: "Corporate Synergy Engine",
    emoji: "⚡",
    description: "+260K slop/sec",
    baseCost: 5_100_000_000,
    costMultiplier: 1.15,
    baseOutput: 260_000,
  },
  {
    id: "swarm",
    name: "AI Agent Swarm",
    emoji: "🐝",
    description: "+1.6M slop/sec",
    baseCost: 75_000_000_000,
    costMultiplier: 1.15,
    baseOutput: 1_600_000,
  },
  {
    id: "metaverse",
    name: "Metaverse Content Portal",
    emoji: "🌐",
    description: "+10M slop/sec",
    baseCost: 1_000_000_000_000,
    costMultiplier: 1.15,
    baseOutput: 10_000_000,
  },
  {
    id: "algorithm",
    name: "The Algorithm Itself",
    emoji: "👁️",
    description: "+65M slop/sec",
    baseCost: 14_000_000_000_000,
    costMultiplier: 1.15,
    baseOutput: 65_000_000,
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_slop",
    name: "Content Is King",
    description: "Generate your first slop",
    emoji: "👑",
    category: "production",
    condition: (s) => s.totalSlopGenerated >= 1,
  },
  {
    id: "slop_100",
    name: "Getting Started",
    description: "Generate 100 slop",
    emoji: "🌱",
    category: "production",
    condition: (s) => s.totalSlopGenerated >= 100,
  },
  {
    id: "slop_1k",
    name: "Content at Scale",
    description: "Generate 1,000 slop",
    emoji: "📊",
    category: "production",
    condition: (s) => s.totalSlopGenerated >= 1000,
  },
  {
    id: "slop_10k",
    name: "Going Viral",
    description: "Generate 10,000 slop",
    emoji: "🔥",
    category: "production",
    condition: (s) => s.totalSlopGenerated >= 10_000,
  },
  {
    id: "slop_100k",
    name: "Influencer Status",
    description: "Generate 100,000 slop",
    emoji: "🌟",
    category: "production",
    condition: (s) => s.totalSlopGenerated >= 100_000,
  },
  {
    id: "slop_1m",
    name: "LinkedInfluencer",
    description: "Generate 1,000,000 slop",
    emoji: "💼",
    category: "production",
    condition: (s) => s.totalSlopGenerated >= 1_000_000,
  },
  {
    id: "slop_1b",
    name: "The Medium Is The Message",
    description: "Generate 1,000,000,000 slop",
    emoji: "📜",
    category: "production",
    condition: (s) => s.totalSlopGenerated >= 1_000_000_000,
  },
  {
    id: "slop_1t",
    name: "Slop Singularity",
    description: "Generate 1T slop",
    emoji: "🌌",
    category: "production",
    condition: (s) => s.totalSlopGenerated >= 1e12,
  },
  {
    id: "click_100",
    name: "Click Enthusiast",
    description: "Click 100 times",
    emoji: "👆",
    category: "clicks",
    condition: (s) => s.totalClicks >= 100,
  },
  {
    id: "click_1k",
    name: "Power User",
    description: "Click 1,000 times",
    emoji: "💪",
    category: "clicks",
    condition: (s) => s.totalClicks >= 1000,
  },
  {
    id: "click_10k",
    name: "Carpal Tunnel",
    description: "Click 10,000 times",
    emoji: "🤕",
    category: "clicks",
    condition: (s) => s.totalClicks >= 10_000,
  },
  {
    id: "click_69k",
    name: "Nice",
    description: "Click 69,000 times",
    emoji: "😏",
    category: "shadow",
    condition: (s) => s.totalClicks >= 69_000,
  },
  {
    id: "gen_first",
    name: "First Hire",
    description: "Buy your first generator",
    emoji: "🤝",
    category: "generator",
    condition: (s) => s.generators.some((g) => g.owned > 0),
  },
  {
    id: "gen_10_all",
    name: "Synergy Achieved",
    description: "Own 10 of every generator",
    emoji: "🔗",
    category: "generator",
    condition: (s) => s.generators.every((g) => g.owned >= 10),
  },
  {
    id: "gen_100_any",
    name: "Content Factory",
    description: "Own 100 of any generator",
    emoji: "🏭",
    category: "generator",
    condition: (s) => s.generators.some((g) => g.owned >= 100),
  },
  {
    id: "gen_all",
    name: "Disruption Incarnate",
    description: "Own at least 1 of every generator",
    emoji: "🎯",
    category: "generator",
    condition: (s) => s.generators.every((g) => g.owned >= 1),
  },
  {
    id: "rebrand_1",
    name: "Paradigm Shift",
    description: "Rebrand for the first time",
    emoji: "🔄",
    category: "prestige",
    condition: (s) => s.rebrandCount >= 1,
  },
  {
    id: "rebrand_5",
    name: "Serial Pivoter",
    description: "Rebrand 5 times",
    emoji: "🔀",
    category: "prestige",
    condition: (s) => s.rebrandCount >= 5,
  },
  {
    id: "rebrand_10",
    name: "Professional Rebrander",
    description: "Rebrand 10 times",
    emoji: "🎪",
    category: "prestige",
    condition: (s) => s.rebrandCount >= 10,
  },
  {
    id: "brand_100",
    name: "Thought Leader",
    description: "Earn 100 Brand Equity",
    emoji: "🧠",
    category: "prestige",
    condition: (s) => s.brandEquity >= 100,
  },
  {
    id: "brand_1k",
    name: "Visionary",
    description: "Earn 1,000 Brand Equity",
    emoji: "👁️",
    category: "prestige",
    condition: (s) => s.brandEquity >= 1000,
  },
  {
    id: "era_growth",
    name: "We Got Funding!",
    description: "Reach the Growth era",
    emoji: "📈",
    category: "production",
    condition: (s) => s.totalSlopGenerated >= 1000,
  },
  {
    id: "era_scale",
    name: "Platform Play",
    description: "Reach the Scale Empire era",
    emoji: "🏢",
    category: "production",
    condition: (s) => s.totalSlopGenerated >= 10_000_000,
  },
  {
    id: "era_singularity",
    name: "The Awakening",
    description: "Reach the AI Singularity era",
    emoji: "🤖",
    category: "production",
    condition: (s) => s.totalSlopGenerated >= 100_000_000_000,
  },
  {
    id: "era_enshit",
    name: "Peak Enshittification",
    description: "Reach The Enshittification",
    emoji: "💀",
    category: "production",
    condition: (s) => s.totalSlopGenerated >= 1e12,
  },
  {
    id: "shadow_69m",
    name: "Nice Margins",
    description: "Generate exactly 69M slop (hidden)",
    emoji: "🤫",
    category: "shadow",
    condition: (s) => s.totalSlopGenerated >= 69_000_000,
  },
  {
    id: "slop_420",
    name: "Blaze It",
    description: "Generate 420K slop",
    emoji: "🌿",
    category: "shadow",
    condition: (s) => s.totalSlopGenerated >= 420_000,
  },
  {
    id: "spc_10",
    name: "Click Power",
    description: "Reach 10 slop per click",
    emoji: "⚡",
    category: "clicks",
    condition: (s) => s.slopPerClick >= 10,
  },
  {
    id: "sps_1m",
    name: "Slop Machine",
    description: "Reach 1M slop per second",
    emoji: "🎰",
    category: "production",
    condition: (s) => calculateSPS(s) >= 1_000_000,
  },
  {
    id: "morale_0",
    name: "Pizza Party!",
    description: "Let morale hit 0",
    emoji: "🍕",
    category: "shadow",
    condition: (s) => s.morale <= 0,
  },
];

const MILESTONES = [
  { owned: 10, multiplier: 2 },
  { owned: 25, multiplier: 3 },
  { owned: 50, multiplier: 5 },
  { owned: 100, multiplier: 10 },
  { owned: 200, multiplier: 25 },
  { owned: 500, multiplier: 100 },
];

export function createGameState(): GameState {
  return {
    slopCount: 0,
    totalSlopGenerated: 0,
    totalClicks: 0,
    slopPerClick: 1,
    generators: GENERATOR_DEFS.map((def) => ({
      ...def,
      owned: 0,
      upgrades: 0,
    })),
    brandEquity: 0,
    rebrandCount: 0,
    achievements: [],
    activeEvents: [],
    morale: 100,
    lastSaveTime: Date.now(),
    researchCompleted: [],
    bingoWords: [],
    version: 1,
  };
}

export function getGeneratorCost(state: GameState, index: number, count = 1): number {
  const gen = state.generators[index];
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.floor(gen.baseCost * gen.costMultiplier ** (gen.owned + i));
  }
  return total;
}

export function getMaxBuyable(state: GameState, index: number): number {
  const gen = state.generators[index];
  let count = 0;
  let totalCost = 0;
  while (true) {
    const nextCost = Math.floor(gen.baseCost * gen.costMultiplier ** (gen.owned + count));
    if (totalCost + nextCost > state.slopCount) {
      break;
    }
    totalCost += nextCost;
    count++;
    if (count > 10_000) {
      break;
    }
  }
  return count;
}

export interface BuyResult {
  bought: number;
  cost: number;
  success: boolean;
}

export function buyGenerator(state: GameState, index: number, count: number): BuyResult {
  const actualCount = count === -1 ? getMaxBuyable(state, index) : count;
  if (actualCount <= 0) {
    return { success: false, bought: 0, cost: 0 };
  }

  const cost = getGeneratorCost(state, index, actualCount);
  if (state.slopCount < cost) {
    if (actualCount === 1) {
      return { success: false, bought: 0, cost: 0 };
    }
    const affordable = getMaxBuyable(state, index);
    if (affordable <= 0) {
      return { success: false, bought: 0, cost: 0 };
    }
    const affordableCost = getGeneratorCost(state, index, affordable);
    state.slopCount -= affordableCost;
    state.generators[index].owned += affordable;
    return { success: true, bought: affordable, cost: affordableCost };
  }

  state.slopCount -= cost;
  state.generators[index].owned += actualCount;
  return { success: true, bought: actualCount, cost };
}

export function getMilestoneMultiplier(state: GameState, index: number): number {
  const gen = state.generators[index];
  let mult = 1;
  for (const milestone of MILESTONES) {
    if (gen.owned >= milestone.owned) {
      mult *= milestone.multiplier;
    }
  }
  return mult;
}

export function getUpgradeMultiplier(gen: Generator): number {
  return 2 ** gen.upgrades;
}

export function calculateSPS(state: GameState): number {
  let total = 0;
  for (let i = 0; i < state.generators.length; i++) {
    const gen = state.generators[i];
    const milestoneMult = getMilestoneMultiplier(state, i);
    const upgradeMult = getUpgradeMultiplier(gen);
    total += gen.baseOutput * gen.owned * milestoneMult * upgradeMult;
  }

  const brandMult = 1 + state.brandEquity * 0.02;
  const moraleMult = 0.5 + (state.morale / 100) * 0.5;
  return total * brandMult * moraleMult;
}

export function applyEvent(state: GameState, event: ActiveEvent): number {
  const baseSPS = calculateSPS(state);
  return baseSPS * event.multiplier;
}

export function handleClick(state: GameState): number {
  const brandMult = 1 + state.brandEquity * 0.02;
  const gained = state.slopPerClick * brandMult;
  state.slopCount += gained;
  state.totalSlopGenerated += gained;
  state.totalClicks++;
  return gained;
}

export function handleTick(state: GameState, deltaSeconds: number): number {
  const sps = calculateSPS(state);
  const gained = sps * deltaSeconds;
  state.slopCount += gained;
  state.totalSlopGenerated += gained;

  state.morale = Math.max(0, state.morale - deltaSeconds * 0.01);
  return gained;
}

export function calculateBrandEquityGain(state: GameState): number {
  return Math.floor((state.totalSlopGenerated / 1000) ** 0.5);
}

export function rebrand(state: GameState): void {
  const gain = calculateBrandEquityGain(state);
  if (gain <= 0) {
    return;
  }

  state.brandEquity += gain;
  state.rebrandCount++;

  state.slopCount = 0;
  state.totalSlopGenerated = 0;
  state.totalClicks = 0;
  state.slopPerClick = 1;
  state.morale = 100;
  state.activeEvents = [];
  for (const gen of state.generators) {
    gen.owned = 0;
    gen.upgrades = 0;
  }
}

export function checkAchievements(state: GameState): Achievement[] {
  const newAchievements: Achievement[] = [];
  for (const achievement of ACHIEVEMENTS) {
    if (!state.achievements.includes(achievement.id) && achievement.condition(state)) {
      state.achievements.push(achievement.id);
      newAchievements.push(achievement);
    }
  }
  return newAchievements;
}

export function getStakeholderConfidence(state: GameState): number {
  return 1 + state.achievements.length * 0.01;
}

export function generateRandomEvent(_state: GameState): ActiveEvent {
  const events: {
    type: EventType;
    weight: number;
    multiplier: number;
    duration: number;
  }[] = [
    { type: "viral", weight: 30, multiplier: 7, duration: 30 },
    { type: "brandDeal", weight: 25, multiplier: 1, duration: 0 },
    { type: "aiHype", weight: 15, multiplier: 10, duration: 60 },
    { type: "cancelCulture", weight: 10, multiplier: 0.5, duration: 30 },
    { type: "bullMarket", weight: 15, multiplier: 777, duration: 13 },
    { type: "algorithmUpdate", weight: 5, multiplier: 3, duration: 45 },
  ];

  const totalWeight = events.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const event of events) {
    roll -= event.weight;
    if (roll <= 0) {
      return {
        type: event.type,
        duration: event.duration,
        multiplier: event.multiplier,
        remaining: event.duration,
      };
    }
  }

  return { type: "viral", duration: 30, multiplier: 7, remaining: 30 };
}

export function getEra(totalSlop: number): Era {
  let era = ERAS[0];
  for (const e of ERAS) {
    if (totalSlop >= e.threshold) {
      era = e;
    }
  }
  return era;
}

export function saveGame(state: GameState): string {
  return JSON.stringify(state);
}

export function loadGame(serialized: string): GameState {
  const loaded = JSON.parse(serialized) as GameState;
  const fresh = createGameState();
  return {
    ...fresh,
    ...loaded,
    generators: loaded.generators || fresh.generators,
    achievements: loaded.achievements || [],
    activeEvents: loaded.activeEvents || [],
    researchCompleted: loaded.researchCompleted || [],
    bingoWords: loaded.bingoWords || [],
  };
}

export function getOfflineEarnings(state: GameState, awaySeconds: number): { gained: number; emails: string[] } {
  const sps = calculateSPS(state);
  const efficiency = 0.5;
  const gained = sps * awaySeconds * efficiency;

  const emails = [
    `📧 You have ${Math.floor(awaySeconds / 10)} unread emails`,
    `📢 Your content generated ${gained > 1_000_000 ? `${(gained / 1_000_000).toFixed(1)}M` : Math.floor(gained)} slop while you were away`,
  ];

  if (Math.random() > 0.5) {
    emails.push('🔥 A post "went viral" (+bonus!)');
  }
  if (Math.random() > 0.7) {
    emails.push('💀 An intern was "let go" (nothing happens, just funny)');
  }
  if (awaySeconds > 3600) {
    emails.push("📊 Quarterly review: EXCEEDS EXPECTATIONS");
  }

  return { gained, emails };
}
