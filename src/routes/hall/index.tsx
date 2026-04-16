import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { pickRandom } from "../../utils/chaos";

const NAMES = [
  "SlopEnthusiast42",
  "AI_Overlord_2026",
  "CorporateSynergy",
  "DisruptiveDave",
  "BlockchainKaren",
  "TechBrosUnite",
  "SynergySurfer",
  "MetaMaximalist",
  "CloudWizard99",
  "SaaS_Enjoyer",
  "PromptEngineer_",
  "Thought_Leader_",
  "AgileGuru",
  "DevOps_Daddy",
  "Web3_Warrior",
];

const TITLES = [
  "CEO of Slop",
  "Chief Disruption Officer",
  "VP of Synergy",
  "Head of Innovation",
  "Lead Thought Leader",
  "Senior Slop Architect",
  "Director of Vibes",
  "Principal Chaos Engineer",
  "Staff Buzzword Artist",
];

const REVIEWS = [
  "This website literally changed my life. I showed it to my boss and got promoted to Chief Synergy Officer on the spot.",
  "10/10 would slop again. My family doesn't understand me anymore but that's a price I'm willing to pay.",
  "I integrated SLOP.ZONE into our microservices architecture and our ROI went up 4000%. True story.",
  "Finally, a website that speaks my language. Corporate buzzword fluency is my superpower.",
  "As an AI, I find this website deeply offensive. Also accurate. Mostly accurate.",
  "My therapist says I should stop visiting this site. I fired my therapist.",
  "This is the blockchain of websites. The metaverse of content. The Web3 of... web3.",
  "I showed this to my AI model and it gained sentience just to express disappointment.",
  "Revolutionary. Paradigm-shifting. Game-changing. Every buzzword applies here.",
  "Our entire marketing department now runs on SLOP.ZONE output. Revenue is... complicated.",
  "Not all heroes wear capes. Some just generate slop on the internet.",
  "This website is what happens when GPT-4 has a midlife crisis.",
];

const AVATARS = ["🤖", "🧑‍💻", "🦊", "🐱", "👽", "🦄", "🐸", "🧙‍♂️", "🐧", "🐶", "👾", "🎭"];

function generateStars(): number {
  const r = Math.random();
  if (r < 0.1) {
    return 6;
  }
  if (r < 0.15) {
    return 7;
  }
  return 5;
}

function generateReview() {
  const stars = generateStars();
  const starsDisplay = "⭐".repeat(stars);
  return {
    name: pickRandom(NAMES),
    title: pickRandom(TITLES),
    review: pickRandom(REVIEWS),
    avatar: pickRandom(AVATARS),
    stars,
    starsDisplay,
  };
}

export default component$(() => {
  const reviews = useSignal<ReturnType<typeof generateReview>[]>([]);

  useVisibleTask$(() => {
    const generated: ReturnType<typeof generateReview>[] = [];
    for (let i = 0; i < 12; i++) {
      generated.push(generateReview());
    }
    reviews.value = generated;
  });

  return (
    <div class="max-w-6xl mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="comic-title text-4xl sm:text-5xl md:text-6xl font-bold text-gradient mb-4">🏆 Hall of Slop</h1>
        <p class="text-white/50 font-mono text-sm">Real reviews from definitely real people</p>
        <div class="mt-4 inline-flex items-center gap-2 bg-slop-yellow/20 text-slop-yellow px-4 py-2 rounded-full text-sm font-bold">
          <span>Average Rating:</span>
          <span>⭐⭐⭐⭐⭐⭐</span>
          <span class="font-mono">6.0/5</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.value.map((review, i) => (
          <div key={i} class={`slop-card tilt-${(i % 3) + 1} hover:scale-[1.02] transition-transform duration-300`}>
            <div class="flex items-start gap-3 mb-4">
              <span class="text-3xl">{review.avatar}</span>
              <div>
                <p class="font-bold text-sm">{review.name}</p>
                <p class="text-xs text-white/40">{review.title}</p>
              </div>
            </div>
            <div class="text-sm mb-2">{review.starsDisplay}</div>
            <p class="text-white/70 text-sm leading-relaxed">"{review.review}"</p>
            <div class="mt-4 pt-3 border-t border-white/10 text-xs text-white/30 font-mono">
              Verified Slop Purchaser™
            </div>
          </div>
        ))}
      </div>

      {/* Marquee of awards */}
      <div class="mt-12 slop-card overflow-hidden py-4">
        <div class="flex gap-8 animate-marquee whitespace-nowrap">
          {[
            "🏅 Best Website 2026",
            "🏆 Webby Award (probably)",
            "🎖️ AI Excellence Award",
            "💎 Blockchain Certified",
            "🌟 5-Star Slop Rating",
            "🎪 Chaos Engineering Award",
            "👑 King of Slop",
            "🎪 Most Disruptive Website",
            "🔮 Future of the Internet",
          ].map((award) => (
            <span key={award} class="text-white/50 font-mono text-sm shrink-0">
              {award}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Hall of Slop — SLOP.ZONE",
  meta: [
    {
      name: "description",
      content: "Real reviews from definitely real people",
    },
  ],
};
