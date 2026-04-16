import { component$, Slot } from "@builder.io/qwik";
import Confetti from "../components/confetti/confetti";
import SlopFooter from "../components/slop-footer/slop-footer";
import SlopNav from "../components/slop-nav/slop-nav";

export default component$(() => {
  return (
    <div class="flex min-h-screen flex-col bg-slop-bg text-white">
      <Confetti />
      <SlopNav />
      <main class="flex-1 pt-16">
        <Slot />
      </main>
      <SlopFooter />
    </div>
  );
});
