import { $, component$, type QwikMouseEvent, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { fireConfettiSmall } from "../../components/confetti/confetti";
import { formatNumber } from "../../game/format";
import {
  ACHIEVEMENTS,
  type ActiveEvent,
  buyGenerator,
  calculateBrandEquityGain,
  calculateSPS,
  checkAchievements,
  createGameState,
  ERAS,
  type GameState,
  generateRandomEvent,
  getEra,
  getGeneratorCost,
  getMaxBuyable,
  getMilestoneMultiplier,
  getOfflineEarnings,
  getStakeholderConfidence,
  handleTick,
  loadGame,
  rebrand,
  saveGame,
} from "../../game/state";
import { playBigWin, playClick, playSuccess } from "../../utils/sounds";

const SAVE_KEY = "slop-zone-save";

function getEraButtonEmoji(eraId: string) {
  if (eraId === "enshittification") {
    return "💀";
  }
  if (eraId === "singularity") {
    return "🤖";
  }
  return "🫠";
}

function getMilestoneNext(genOwned: number): number {
  const milestones = [10, 25, 50, 100, 200, 500];
  for (const m of milestones) {
    if (genOwned < m) {
      return m;
    }
  }
  return -1;
}

export default component$(() => {
  const game = useSignal<GameState>(createGameState());
  const buyMode = useSignal<1 | 10 | 100 | -1>(1);
  const showAchievements = useSignal(false);
  const showRebrand = useSignal(false);
  const showOffline = useSignal(false);
  const offlineEmails = useSignal<string[]>([]);
  const newAchievementPopup = useSignal<{ name: string; emoji: string } | null>(null);
  const clickScale = useSignal(1);
  const clickParticles = useSignal<{ id: number; x: number; y: number; amount: number }[]>([]);
  const activeEventDisplay = useSignal<ActiveEvent | null>(null);
  const eventTimer = useSignal(0);
  const autoSaveCounter = useSignal(0);
  useVisibleTask$(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const loaded = loadGame(saved);
        const awaySeconds = (Date.now() - loaded.lastSaveTime) / 1000;
        if (awaySeconds > 60) {
          const { gained, emails } = getOfflineEarnings(loaded, awaySeconds);
          loaded.slopCount += gained;
          loaded.totalSlopGenerated += gained;
          offlineEmails.value = emails;
          showOffline.value = true;
        }
        game.value = loaded;
      }
    } catch {
      // corrupted save
    }
  });

  useVisibleTask$(({ cleanup }) => {
    const tick = setInterval(() => {
      const state = game.value;
      handleTick(state, 0.1);
      autoSaveCounter.value++;
      if (autoSaveCounter.value >= 50) {
        autoSaveCounter.value = 0;
        state.lastSaveTime = Date.now();
        try {
          localStorage.setItem(SAVE_KEY, saveGame(state));
        } catch {
          // storage full
        }
      }
      game.value = { ...state };

      const newA = checkAchievements(state);
      if (newA.length > 0) {
        newAchievementPopup.value = {
          name: newA[0].name,
          emoji: newA[0].emoji,
        };
        playSuccess();
        setTimeout(() => {
          newAchievementPopup.value = null;
        }, 3000);
      }
    }, 100);
    cleanup(() => clearInterval(tick));
  });

  useVisibleTask$(({ cleanup }) => {
    const eventInterval = setInterval(() => {
      if (activeEventDisplay.value) {
        return;
      }
      if (Math.random() > 0.7) {
        const event = generateRandomEvent(game.value);
        activeEventDisplay.value = event;
        eventTimer.value = event.duration;
        const countdown = setInterval(() => {
          eventTimer.value--;
          if (eventTimer.value <= 0) {
            activeEventDisplay.value = null;
            clearInterval(countdown);
          }
        }, 1000);
      }
    }, 30_000);
    cleanup(() => clearInterval(eventInterval));
  });

  const doClick = $((e: QwikMouseEvent) => {
    const state = game.value;
    const eventMult = activeEventDisplay.value?.multiplier || 1;
    const brandMult = 1 + state.brandEquity * 0.02;
    const confidence = getStakeholderConfidence(state);
    const gained = state.slopPerClick * brandMult * confidence * eventMult;
    state.slopCount += gained;
    state.totalSlopGenerated += gained;
    state.totalClicks++;
    clickScale.value = 1.25;
    setTimeout(() => {
      clickScale.value = 1;
    }, 80);
    playClick();
    const id = Date.now();
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    clickParticles.value = [
      ...clickParticles.value,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top, amount: gained },
    ];
    setTimeout(() => {
      clickParticles.value = clickParticles.value.filter((p) => p.id !== id);
    }, 800);
    game.value = { ...state };
  });

  const doBuy = $((index: number) => {
    const state = game.value;
    const count = buyMode.value;
    const result = buyGenerator(state, index, count);
    if (result.success) {
      playClick();
      if (state.generators[index].owned >= 10 && state.generators[index].owned - result.bought < 10) {
        fireConfettiSmall();
      }
      game.value = { ...state };
    }
  });

  const doRebrand = $(() => {
    const state = game.value;
    const gain = calculateBrandEquityGain(state);
    if (gain <= 0) {
      return;
    }
    rebrand(state);
    playBigWin();
    fireConfettiSmall();
    showRebrand.value = false;
    game.value = { ...state };
  });

  const closeOffline = $(() => {
    showOffline.value = false;
  });

  const resetGame = $(() => {
    localStorage.removeItem(SAVE_KEY);
    game.value = createGameState();
  });

  const state = game.value;
  const sps = calculateSPS(state);
  const era = getEra(state.totalSlopGenerated);
  const brandGain = calculateBrandEquityGain(state);
  const confidence = getStakeholderConfidence(state);
  const totalAchievements = ACHIEVEMENTS.length;

  if (showOffline.value) {
    return (
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-slop-bg/90 backdrop-blur-xl p-4">
        <div class="slop-card max-w-md w-full text-center">
          <h2 class="comic-title text-3xl font-bold text-gradient mb-4">Welcome Back! 📬</h2>
          <div class="space-y-2 mb-6">
            {offlineEmails.value.map((email, i) => (
              <p key={i} class="text-sm text-white/60 font-mono">
                {email}
              </p>
            ))}
          </div>
          <button onClick$={closeOffline} class="slop-btn" type="button">
            Check Inbox 📬
          </button>
        </div>
      </div>
    );
  }

  return (
    <div class={`min-h-screen bg-gradient-to-br ${era.bgClass} transition-all duration-1000`}>
      {newAchievementPopup.value && (
        <div class="fixed top-20 right-4 z-50 slop-card bg-slop-yellow/10 border-slop-yellow/30 animate-bounce-crazy max-w-xs">
          <p class="text-sm font-bold">
            {newAchievementPopup.value.emoji} {newAchievementPopup.value.name}
          </p>
          <p class="text-xs text-white/40">+1% Stakeholder Confidence</p>
        </div>
      )}

      {activeEventDisplay.value && (
        <div class="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-slop-yellow/20 to-slop-orange/20 backdrop-blur-xl border-b border-slop-yellow/30 py-2 px-4 text-center">
          <span class="font-bold text-slop-yellow text-sm">
            🔥 TRENDING: {activeEventDisplay.value.type.toUpperCase()} ×{activeEventDisplay.value.multiplier}
          </span>
          <span class="text-xs text-white/40 ml-2">{eventTimer.value}s</span>
        </div>
      )}

      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="text-center mb-6">
          <div class="flex items-center justify-center gap-2 mb-1">
            <span class="text-2xl">{era.emoji}</span>
            <h1 class="comic-title text-3xl sm:text-4xl font-bold text-gradient">Slop Clicker</h1>
          </div>
          <p class="text-xs text-white/40 font-mono">
            {era.description} — Era {ERAS.indexOf(era) + 1}/5
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-1 flex flex-col items-center gap-4">
            <div class="slop-card w-full text-center">
              <p class="text-4xl sm:text-5xl font-bold font-mono text-gradient mb-1">
                {formatNumber(Math.floor(state.slopCount))}
              </p>
              <p class="text-xs text-white/40 font-mono">SLOP</p>
              <div class="flex justify-center gap-4 mt-2 text-xs text-white/50 font-mono">
                <span>{formatNumber(sps)}/sec</span>
                <span>
                  {formatNumber(state.slopPerClick * (1 + state.brandEquity * 0.02) * confidence)}
                  /click
                </span>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 w-full">
              <div class="slop-card text-center py-2 px-1">
                <div class="text-xs text-white/40">Brand</div>
                <div class="font-bold font-mono text-sm text-slop-purple">{formatNumber(state.brandEquity)}</div>
              </div>
              <div class="slop-card text-center py-2 px-1">
                <div class="text-xs text-white/40">Rebrands</div>
                <div class="font-bold font-mono text-sm text-slop-cyan">{state.rebrandCount}</div>
              </div>
              <div class="slop-card text-center py-2 px-1">
                <div class="text-xs text-white/40">KPIs</div>
                <div class="font-bold font-mono text-sm text-slop-yellow">
                  {state.achievements.length}/{totalAchievements}
                </div>
              </div>
            </div>

            <div class="relative">
              <button
                class="w-40 h-40 sm:w-48 sm:h-48 rounded-full text-6xl sm:text-7xl bg-gradient-to-br from-slop-purple to-slop-pink shadow-[0_0_60px_rgba(139,92,246,0.3)] hover:shadow-[0_0_80px_rgba(236,72,153,0.5)] transition-transform duration-75 select-none"
                style={{ transform: `scale(${clickScale.value})` }}
                onClick$={doClick}
                type="button"
              >
                {getEraButtonEmoji(era.id)}
              </button>
              {clickParticles.value.map((p) => (
                <span
                  key={p.id}
                  class="absolute pointer-events-none text-lg animate-float text-slop-yellow font-bold font-mono"
                  style={{ left: `${p.x}px`, top: `${p.y}px` }}
                >
                  +{formatNumber(p.amount)}
                </span>
              ))}
            </div>

            <div class="flex gap-2 flex-wrap justify-center">
              <button
                onClick$={() => {
                  showRebrand.value = true;
                }}
                class="px-4 py-2 rounded-xl text-sm font-bold bg-slop-purple/20 text-slop-purple border border-slop-purple/30 hover:bg-slop-purple/30 transition-colors"
                disabled={brandGain <= 0}
                type="button"
              >
                🔄 Rebrand (+{formatNumber(brandGain)})
              </button>
              <button
                onClick$={() => {
                  showAchievements.value = !showAchievements.value;
                }}
                class="px-4 py-2 rounded-xl text-sm font-bold bg-slop-yellow/20 text-slop-yellow border border-slop-yellow/30 hover:bg-slop-yellow/30 transition-colors"
                type="button"
              >
                🏆 KPIs
              </button>
              <button
                onClick$={resetGame}
                class="px-3 py-2 rounded-xl text-xs text-white/30 hover:text-white/60 transition-colors"
                type="button"
              >
                Reset
              </button>
            </div>
          </div>

          <div class="lg:col-span-2">
            {!showAchievements.value && (
              <div class="flex items-center gap-2 mb-4">
                <span class="text-xs text-white/40 font-mono">BUY:</span>
                {[1, 10, 100, -1].map((mode) => (
                  <button
                    key={mode}
                    onClick$={() => {
                      buyMode.value = mode as 1 | 10 | 100 | -1;
                    }}
                    class={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${buyMode.value === mode ? "bg-slop-purple/30 text-slop-purple" : "text-white/40 hover:text-white/60"}`}
                    type="button"
                  >
                    {mode === -1 ? "MAX" : `${mode}x`}
                  </button>
                ))}
              </div>
            )}

            {showAchievements.value ? (
              <div>
                <h2 class="comic-title text-xl font-bold text-slop-yellow mb-4">
                  🏆 KPI Milestones ({state.achievements.length}/{totalAchievements})
                </h2>
                <p class="text-xs text-white/40 mb-4">
                  Stakeholder Confidence: +{((confidence - 1) * 100).toFixed(0)}%
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ACHIEVEMENTS.map((a) => {
                    const unlocked = state.achievements.includes(a.id);
                    return (
                      <div
                        key={a.id}
                        class={`slop-card py-3 px-4 flex items-center gap-3 ${unlocked ? "" : "opacity-30"}`}
                      >
                        <span class="text-2xl">{unlocked ? a.emoji : "🔒"}</span>
                        <div>
                          <p class="text-sm font-bold">{unlocked ? a.name : "???"}</p>
                          <p class="text-xs text-white/40">{a.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <h2 class="comic-title text-xl font-bold text-slop-cyan mb-4">🏪 Slop Shop</h2>
                <div class="space-y-2">
                  {state.generators.map((gen, i) => {
                    const count = buyMode.value === -1 ? getMaxBuyable(state, i) : buyMode.value;
                    const cost = getGeneratorCost(state, i, count);
                    const canAfford = state.slopCount >= cost && count > 0;
                    const milestoneNext = getMilestoneNext(gen.owned);
                    const milestoneMult = getMilestoneMultiplier(state, i);
                    const isLocked = i > 0 && state.generators[i - 1].owned === 0;
                    if (isLocked && i > 2) {
                      return null;
                    }

                    return (
                      <button
                        key={gen.id}
                        onClick$={() => doBuy(i)}
                        disabled={!canAfford}
                        class={`w-full slop-card flex items-center gap-3 text-left transition-all duration-200 py-3 px-4 ${canAfford ? "hover:bg-white/5 cursor-pointer border-slop-purple/20" : "opacity-40 cursor-not-allowed"}`}
                        type="button"
                      >
                        <span class="text-2xl shrink-0">{gen.emoji}</span>
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-2 flex-wrap">
                            <span class="font-bold text-sm">{gen.name}</span>
                            {gen.owned > 0 && (
                              <span class="text-xs bg-slop-purple/20 text-slop-purple px-2 py-0.5 rounded-full font-mono">
                                x{gen.owned}
                              </span>
                            )}
                            {milestoneMult > 1 && (
                              <span class="text-xs bg-slop-green/20 text-slop-green px-2 py-0.5 rounded-full font-mono">
                                ×{milestoneMult}
                              </span>
                            )}
                          </div>
                          <p class="text-xs text-white/40">{gen.description}</p>
                          {milestoneNext > 0 && gen.owned > 0 && (
                            <div class="mt-1 w-full h-1 bg-slop-bg rounded-full overflow-hidden">
                              <div
                                class="h-full bg-slop-purple/50 rounded-full"
                                style={{
                                  width: `${Math.min((gen.owned / milestoneNext) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div class="text-right shrink-0">
                          <div class="text-sm font-mono font-bold text-gradient">{formatNumber(cost)}</div>
                          <div class="text-xs text-white/30">
                            {buyMode.value === -1 ? `${count}` : `${buyMode.value}x`}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showRebrand.value && (
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slop-bg/90 backdrop-blur-xl p-4">
          <div class="slop-card max-w-md w-full text-center">
            <h2 class="comic-title text-3xl font-bold text-gradient mb-2">🔄 REBRAND</h2>
            <p class="text-sm text-white/50 mb-4">"We're excited to announce our new direction..."</p>
            <div class="slop-card bg-slop-purple/10 mb-4">
              <p class="text-3xl font-bold font-mono text-slop-purple">+{formatNumber(brandGain)}</p>
              <p class="text-xs text-white/40">Brand Equity (+{brandGain * 2}% SPS forever)</p>
            </div>
            <p class="text-xs text-white/30 mb-6">
              You will lose all slop, generators, and upgrades. Brand Equity and achievements are permanent.
            </p>
            <div class="flex gap-3 justify-center">
              <button onClick$={doRebrand} disabled={brandGain <= 0} class="slop-btn" type="button">
                🔄 Synergize & Pivot
              </button>
              <button
                onClick$={() => {
                  showRebrand.value = false;
                }}
                class="px-4 py-2 rounded-xl text-white/50 hover:text-white transition-colors"
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Slop Clicker — SLOP.ZONE",
  meta: [
    {
      name: "description",
      content: "Click the slop. Buy upgrades. Achieve singularity.",
    },
  ],
};
