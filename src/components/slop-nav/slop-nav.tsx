import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

const NAV_ITEMS = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/generate", label: "Generate", emoji: "✨" },
  { href: "/clicker", label: "Clicker", emoji: "👆" },
  { href: "/hall", label: "Hall of Slop", emoji: "🏆" },
  { href: "/quiz", label: "Quiz", emoji: "🧠" },
];

export default component$(() => {
  const location = useLocation();
  const isOpen = useSignal(false);
  const glitchActive = useSignal(false);

  useVisibleTask$(() => {
    const interval = setInterval(() => {
      glitchActive.value = true;
      setTimeout(() => {
        glitchActive.value = false;
      }, 200);
    }, 5000);
    return () => clearInterval(interval);
  });

  const toggleMenu = $(() => {
    isOpen.value = !isOpen.value;
  });

  return (
    <nav class="fixed top-0 left-0 right-0 z-50 bg-slop-bg/80 backdrop-blur-xl border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <Link
            href="/"
            class={`comic-title text-2xl font-bold text-gradient select-none ${
              glitchActive.value ? "animate-shake" : ""
            }`}
          >
            SLOP<span class="text-slop-cyan">.ZONE</span>
          </Link>

          <div class="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                class={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-white/10 ${
                  location.url.pathname === item.href
                    ? "bg-slop-purple/20 text-slop-purple"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <span class="mr-1">{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </div>

          <button
            class="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            onClick$={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen.value ? (
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen.value && (
        <div class="md:hidden bg-slop-bg/95 backdrop-blur-xl border-b border-white/10">
          <div class="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick$={() => {
                  isOpen.value = false;
                }}
                class={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  location.url.pathname === item.href
                    ? "bg-slop-purple/20 text-slop-purple"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <span class="mr-2">{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
});
