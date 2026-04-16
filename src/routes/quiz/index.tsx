import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { fireConfettiSmall } from "../../components/confetti/confetti";
import { playBigWin, playError, playSuccess } from "../../utils/sounds";

interface QuizQuestion {
  category: string;
  isAI: boolean;
  text: string;
}

const QUESTIONS: QuizQuestion[] = [
  {
    text: "In today's rapidly evolving digital landscape, leveraging synergistic paradigms is not just an option—it's a necessity for stakeholders seeking to maximize their ROI potential.",
    isAI: true,
    category: "🤖 AI Slop",
  },
  {
    text: "I accidentally put salt instead of sugar in my coffee this morning and now I'm questioning every decision I've ever made.",
    isAI: false,
    category: "👤 Human",
  },
  {
    text: "Our cloud-native microservices architecture delivers unprecedented scalability through quantum-enhanced blockchain optimization.",
    isAI: true,
    category: "🤖 AI Slop",
  },
  {
    text: "My cat knocked over my coffee and I just stood there watching it spill because honestly it felt like a metaphor for my life.",
    isAI: false,
    category: "👤 Human",
  },
  {
    text: "The intersection of AI-driven analytics and human-centered design thinking creates a paradigm shift in how we approach digital transformation.",
    isAI: true,
    category: "🤖 AI Slop",
  },
  {
    text: "Just spent 20 minutes looking for my phone while using its flashlight. I'm doing great.",
    isAI: false,
    category: "👤 Human",
  },
  {
    text: "Harnessing the power of next-generation machine learning algorithms, our platform delivers actionable insights that drive meaningful business outcomes.",
    isAI: true,
    category: "🤖 AI Slop",
  },
  {
    text: "I told my mom I was a full-stack developer and she asked me to fix her pancake stack. I did. They were good pancakes.",
    isAI: false,
    category: "👤 Human",
  },
  {
    text: "By seamlessly integrating omnichannel touchpoints with data-driven personalization engines, we create immersive experiences that resonate with modern consumers.",
    isAI: true,
    category: "🤖 AI Slop",
  },
  {
    text: "Got an email saying 'congratulations on your achievement' and it turned out to be a LinkedIn bot. Still my proudest moment this month.",
    isAI: false,
    category: "👤 Human",
  },
  {
    text: "Unlock exponential growth through our proprietary synergy-maximization framework, designed to disrupt traditional value proposition paradigms.",
    isAI: true,
    category: "🤖 AI Slop",
  },
  {
    text: "My code works on my machine. Ship my machine.",
    isAI: false,
    category: "👤 Human",
  },
  {
    text: "Revolutionize your workflow with AI-powered thought leadership automation that generates unprecedented engagement metrics across all digital channels.",
    isAI: true,
    category: "🤖 AI Slop",
  },
  {
    text: "I've decided my spirit animal is a rubber duck because I solve most of my problems by just talking to myself.",
    isAI: false,
    category: "👤 Human",
  },
];

function getRank(percentage: number) {
  if (percentage >= 90) {
    return {
      title: "Slop Detector 3000",
      emoji: "🎯",
      color: "text-slop-green",
    };
  }
  if (percentage >= 70) {
    return { title: "Buzzword Spotter", emoji: "🔍", color: "text-slop-cyan" };
  }
  if (percentage >= 50) {
    return { title: "Easily Confused", emoji: "🤔", color: "text-slop-yellow" };
  }
  return { title: "Full Slop Mode", emoji: "🫠", color: "text-slop-pink" };
}

function getResultMessage(percentage: number) {
  if (percentage >= 70) {
    return "You can spot corporate slop from a mile away!";
  }
  if (percentage >= 50) {
    return "You got confused. The slop got to you.";
  }
  return "You might actually be an AI. Have you checked?";
}

function getCardClass(showResult: "correct" | "wrong" | null) {
  if (showResult === "correct") {
    return "border-slop-green/50 shadow-[0_0_30px_rgba(52,211,153,0.3)]";
  }
  if (showResult === "wrong") {
    return "border-slop-pink/50 shadow-[0_0_30px_rgba(236,72,153,0.3)]";
  }
  return "";
}

function getButtonClass(
  showResult: "correct" | "wrong" | null,
  isAIButton: boolean,
  currentQIsAI: boolean | undefined,
  selectedAnswerValue: boolean | null
) {
  if (showResult === null) {
    const hoverColor = isAIButton ? "slop-purple" : "slop-cyan";
    return `bg-white/5 border-2 border-white/20 text-white hover:bg-${hoverColor}/20 hover:border-${hoverColor}/50 active:scale-95`;
  }
  if (currentQIsAI === isAIButton) {
    return "bg-slop-green/20 border-2 border-slop-green text-slop-green";
  }
  if (selectedAnswerValue === isAIButton) {
    return "bg-slop-pink/20 border-2 border-slop-pink text-slop-pink opacity-50";
  }
  return "opacity-30";
}

export default component$(() => {
  const currentIndex = useSignal(0);
  const score = useSignal(0);
  const answered = useSignal(0);
  const showResult = useSignal<"correct" | "wrong" | null>(null);
  const quizComplete = useSignal(false);
  const questions = useSignal<QuizQuestion[]>([]);
  const selectedAnswer = useSignal<boolean | null>(null);

  useVisibleTask$(() => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    questions.value = shuffled.slice(0, 8);
  });

  const handleAnswer = $((answerIsAI: boolean) => {
    if (showResult.value !== null) {
      return;
    }

    const question = questions.value[currentIndex.value];
    const correct = answerIsAI === question.isAI;
    selectedAnswer.value = answerIsAI;

    if (correct) {
      score.value++;
      showResult.value = "correct";
      playSuccess();
      fireConfettiSmall();
    } else {
      showResult.value = "wrong";
      playError();
    }

    answered.value++;

    setTimeout(() => {
      showResult.value = null;
      selectedAnswer.value = null;

      if (currentIndex.value >= questions.value.length - 1) {
        quizComplete.value = true;
        if (score.value >= 6) {
          playBigWin();
        }
      } else {
        currentIndex.value++;
      }
    }, 1500);
  });

  const restart = $(() => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    questions.value = shuffled.slice(0, 8);
    currentIndex.value = 0;
    score.value = 0;
    answered.value = 0;
    quizComplete.value = false;
    showResult.value = null;
    selectedAnswer.value = null;
  });

  const currentQ = questions.value[currentIndex.value];
  const progress =
    questions.value.length > 0 ? ((currentIndex.value + (showResult.value ? 1 : 0)) / questions.value.length) * 100 : 0;

  if (quizComplete.value) {
    const percentage = Math.round((score.value / questions.value.length) * 100);
    const rank = getRank(percentage);

    return (
      <div class="max-w-2xl mx-auto px-4 py-12 text-center">
        <div class="slop-card">
          <div class="text-6xl mb-4">{rank.emoji}</div>
          <h2 class={`comic-title text-3xl font-bold mb-2 ${rank.color}`}>{rank.title}</h2>
          <p class="text-4xl font-bold font-mono text-gradient mb-4">
            {score.value}/{questions.value.length}
          </p>
          <p class="text-white/50 mb-8">{getResultMessage(percentage)}</p>
          <button onClick$={restart} class="slop-btn">
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div class="max-w-2xl mx-auto px-4 py-12">
      <div class="text-center mb-8">
        <h1 class="comic-title text-4xl sm:text-5xl md:text-6xl font-bold text-gradient mb-2">🧠 Is This AI?</h1>
        <p class="text-white/50 font-mono text-sm">Can you tell the difference between AI slop and human chaos?</p>
      </div>

      {/* Progress bar */}
      <div class="mb-8">
        <div class="flex justify-between text-xs font-mono text-white/40 mb-2">
          <span>
            Question {currentIndex.value + 1}/{questions.value.length}
          </span>
          <span>
            Score: {score.value}/{answered.value}
          </span>
        </div>
        <div class="w-full h-2 bg-slop-bg rounded-full overflow-hidden">
          <div
            class="h-full rounded-full bg-gradient-to-r from-slop-purple to-slop-cyan transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      {currentQ && (
        <div class={`slop-card mb-8 transition-all duration-300 ${getCardClass(showResult.value)}`}>
          <p class="text-lg sm:text-xl leading-relaxed text-white/90 italic">"{currentQ.text}"</p>
        </div>
      )}

      {/* Answer buttons */}
      <div class="grid grid-cols-2 gap-4">
        <button
          onClick$={() => handleAnswer(true)}
          disabled={showResult.value !== null}
          class={`py-6 rounded-2xl text-lg font-bold transition-all duration-200 ${getButtonClass(showResult.value, true, currentQ?.isAI, selectedAnswer.value)}`}
        >
          🤖 AI Slop
        </button>
        <button
          onClick$={() => handleAnswer(false)}
          disabled={showResult.value !== null}
          class={`py-6 rounded-2xl text-lg font-bold transition-all duration-200 ${getButtonClass(showResult.value, false, currentQ?.isAI, selectedAnswer.value)}`}
        >
          👤 Human
        </button>
      </div>

      {/* Result feedback */}
      {showResult.value && (
        <div
          class={`mt-6 text-center text-lg font-bold ${
            showResult.value === "correct" ? "text-slop-green" : "text-slop-pink"
          }`}
        >
          {showResult.value === "correct" ? "✅ Correct!" : "❌ Wrong!"}{" "}
          <span class="text-sm text-white/50">This was {currentQ?.category}</span>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Is This AI? Quiz — SLOP.ZONE",
  meta: [
    {
      name: "description",
      content: "Can you tell the difference between AI slop and human chaos?",
    },
  ],
};
