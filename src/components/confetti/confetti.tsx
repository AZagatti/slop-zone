import { component$, useVisibleTask$ } from "@builder.io/qwik";

interface ConfettiProps {
  count?: number;
  emoji?: string[];
}

interface ConfettiModule {
  shapeFromText(options: { text: string; scalar: number }): unknown;
  (options: Record<string, unknown>): void;
}

function getConfetti(): ConfettiModule | undefined {
  return (window as unknown as Record<string, unknown>).confetti as ConfettiModule | undefined;
}

export function fireConfetti(emojis?: string[]) {
  const confetti = getConfetti();
  if (!confetti) {
    return;
  }

  const defaultEmojis = ["🫠", "🤖", "💩", "🔥", "✨"];
  const shapes = (emojis || defaultEmojis).map((e) => confetti.shapeFromText({ text: e, scalar: 2 }));

  const scalar = 2;
  const defaults = {
    spread: 360,
    ticks: 60,
    gravity: 0,
    decay: 0.96,
    startVelocity: 20,
    scalar,
  };

  // biome-ignore lint/correctness/useQwikValidLexicalScope: false positive — this is a plain function, not a Qwik component
  const shoot = () => {
    confetti({
      ...defaults,
      particleCount: 30,
      shapes: shapes.slice(0, 3),
    });
    confetti({
      ...defaults,
      particleCount: 15,
      shapes: shapes.length > 3 ? shapes.slice(3) : shapes.slice(0, 2),
      scalar: scalar / 2,
    });
  };

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
}

export function fireConfettiSmall() {
  const confetti = getConfetti();
  if (!confetti) {
    return;
  }

  confetti({
    particleCount: 30,
    spread: 70,
    origin: { y: 0.7 },
    colors: ["#8B5CF6", "#EC4899", "#22D3EE", "#FACC15"],
  });
}

export default component$((props: ConfettiProps) => {
  useVisibleTask$(async () => {
    const confettiModule = await import("canvas-confetti");
    (window as unknown as Record<string, unknown>).confetti = confettiModule.default;

    if (props.count && props.count > 0) {
      fireConfetti(props.emoji);
    }
  });

  return <div class="pointer-events-none fixed inset-0 z-[9999]" />;
});
