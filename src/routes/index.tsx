import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { formatNumber, pickRandom } from "../utils/chaos";

const FLOATING_EMOJIS = ["🫠", "🤖", "✨", "💀", "🔥", "🧠", "🌊", "🦄", "📦", "⚡"];

interface FloatingEmoji {
  delay: number;
  duration: number;
  emoji: string;
  id: number;
  size: number;
  x: number;
}

export default component$(() => {
  const visitorCount = useSignal(0);
  const emojis = useSignal<FloatingEmoji[]>([]);
  const titleGlitch = useSignal(false);

  useVisibleTask$(() => {
    const startCount = 89_000_000;
    visitorCount.value = startCount;
    const interval = setInterval(() => {
      visitorCount.value += Math.floor(Math.random() * 10_000) + 1000;
    }, 100);

    const generated: FloatingEmoji[] = [];
    for (let i = 0; i < 15; i++) {
      generated.push({
        id: i,
        emoji: pickRandom(FLOATING_EMOJIS),
        x: Math.random() * 100,
        size: 20 + Math.random() * 30,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 12,
      });
    }
    emojis.value = generated;

    const glitchInterval = setInterval(() => {
      titleGlitch.value = true;
      setTimeout(() => {
        titleGlitch.value = false;
      }, 300);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(glitchInterval);
    };
  });

  return (
    <div class="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-slop-bg via-slop-surface to-slop-bg animate-gradient-bg" />

      {emojis.value.map((e) => (
        <div
          key={e.id}
          class="absolute pointer-events-none select-none opacity-20 animate-float"
          style={{
            left: `${e.x}%`,
            top: `${20 + Math.random() * 60}%`,
            fontSize: `${e.size}px`,
            animationDelay: `${e.delay}s`,
            animationDuration: `${e.duration}s`,
          }}
        >
          {e.emoji}
        </div>
      ))}

      <div class="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div class={`text-center mb-8 ${titleGlitch.value ? "animate-shake" : ""}`}>
          <h1 class="comic-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-gradient mb-4 leading-tight">
            SLOP
          </h1>
          <h2 class="comic-title text-3xl sm:text-4xl md:text-5xl font-bold text-slop-cyan/80">.ZONE</h2>
        </div>

        <p class="text-lg sm:text-xl text-white/60 max-w-2xl text-center mb-4 font-mono">
          The internet's premier destination for AI-generated chaos
        </p>

        <div class="slop-card mb-8 text-center">
          <p class="text-xs text-white/40 font-mono mb-1">VISITORS TODAY</p>
          <p class="text-3xl sm:text-4xl font-bold font-mono text-gradient">{formatNumber(visitorCount.value)}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full">
          <Link href="/generate" class="slop-btn text-center tilt-1">
            ✨ Generate Slop
          </Link>
          <Link
            href="/clicker"
            class="slop-btn text-center tilt-2"
            style="background: linear-gradient(135deg, #22D3EE, #34D399);"
          >
            👆 Slop Clicker
          </Link>
          <Link
            href="/hall"
            class="slop-btn text-center tilt-3"
            style="background: linear-gradient(135deg, #FACC15, #FB923C);"
          >
            🏆 Hall of Slop
          </Link>
          <Link
            href="/quiz"
            class="slop-btn text-center tilt-1"
            style="background: linear-gradient(135deg, #EC4899, #8B5CF6);"
          >
            🧠 Is This AI?
          </Link>
        </div>

        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "SLOP.ZONE — AI-Generated Chaos",
  meta: [
    {
      name: "description",
      content: "The internet's premier destination for AI-generated chaos",
    },
  ],
};

import type { DocumentHead } from "@builder.io/qwik-city";
