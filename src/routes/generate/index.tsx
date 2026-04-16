import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { fireConfetti, fireConfettiSmall } from "../../components/confetti/confetti";
import { generateSlop, generateSlopTitle } from "../../utils/slop-text";
import { playClick, playSuccess } from "../../utils/sounds";

export default component$(() => {
  const title = useSignal("");
  const content = useSignal("");
  const isGenerating = useSignal(false);
  const generationCount = useSignal(0);
  const slopMeter = useSignal(0);

  const generate = $(() => {
    playClick();
    isGenerating.value = true;
    slopMeter.value = 0;

    const meterInterval = setInterval(() => {
      slopMeter.value = Math.min(slopMeter.value + Math.random() * 15, 100);
    }, 100);

    setTimeout(() => {
      clearInterval(meterInterval);
      title.value = generateSlopTitle();
      content.value = generateSlop(3 + Math.floor(Math.random() * 3));
      isGenerating.value = false;
      slopMeter.value = 100;
      generationCount.value++;
      playSuccess();
      fireConfetti();
    }, 1500);
  });

  useVisibleTask$(() => {
    title.value = generateSlopTitle();
    content.value = generateSlop(2);
  });

  return (
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="comic-title text-4xl sm:text-5xl md:text-6xl font-bold text-gradient mb-4">✨ Slop Generator</h1>
        <p class="text-white/50 font-mono text-sm">Generate unlimited AI-powered corporate slop content™</p>
      </div>

      {/* Slop meter */}
      <div class="slop-card mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-mono text-white/50">SLOP METER</span>
          <span class="text-sm font-mono text-slop-purple">{Math.round(slopMeter.value)}%</span>
        </div>
        <div class="w-full h-3 bg-slop-bg rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${slopMeter.value}%`,
              background: "linear-gradient(90deg, #8B5CF6, #EC4899, #22D3EE)",
            }}
          />
        </div>
      </div>

      {/* Generate button */}
      <div class="flex justify-center mb-8">
        <button
          onClick$={generate}
          disabled={isGenerating.value}
          class={`slop-btn text-lg px-10 py-4 ${
            isGenerating.value ? "opacity-50 cursor-not-allowed" : "animate-glow-pulse"
          }`}
        >
          {isGenerating.value ? (
            <>
              <span class="inline-block animate-spin-slow mr-2">⚙️</span>
              Generating slop...
            </>
          ) : (
            <>🚀 Generate Slop</>
          )}
        </button>
      </div>

      {/* Generated content */}
      {content.value && (
        <div class="slop-card tilt-1 hover:tilt-0 transition-transform duration-500">
          {title.value && (
            <h2 class="comic-title text-2xl sm:text-3xl font-bold text-gradient mb-6">"{title.value}"</h2>
          )}
          <div class="space-y-4">
            {content.value.split("\n\n").map((paragraph, i) => (
              <p key={i} class="text-white/70 leading-relaxed text-sm sm:text-base">
                {paragraph}
              </p>
            ))}
          </div>
          <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span class="text-xs font-mono text-white/30">
              slop #{generationCount.value + 1} • {content.value.split(" ").length} words of pure slop
            </span>
            <button
              class="text-xs text-slop-purple hover:text-slop-pink transition-colors"
              onClick$={() => {
                navigator.clipboard.writeText(content.value);
                fireConfettiSmall();
                playClick();
              }}
            >
              📋 Copy slop
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div class="grid grid-cols-3 gap-4 mt-8">
        {[
          {
            label: "Slop Generated",
            value: generationCount.value.toString(),
            emoji: "📝",
          },
          {
            label: "Buzzwords Used",
            value: (generationCount.value * 47).toString(),
            emoji: "💼",
          },
          { label: "Synergy Score", value: "∞", emoji: "📊" },
        ].map((stat) => (
          <div key={stat.label} class="slop-card text-center py-4 px-2">
            <div class="text-2xl mb-1">{stat.emoji}</div>
            <div class="text-xl font-bold font-mono text-gradient">{stat.value}</div>
            <div class="text-xs text-white/40 font-mono mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Generate Slop — SLOP.ZONE",
  meta: [
    {
      name: "description",
      content: "Generate unlimited AI-powered corporate slop content",
    },
  ],
};
