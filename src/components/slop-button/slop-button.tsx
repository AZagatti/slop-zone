import { component$ } from "@builder.io/qwik";

interface SlopButtonProps {
  class?: string;
  emoji?: string;
  label: string;
  onClick$?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "danger";
}

export default component$((props: SlopButtonProps) => {
  const variant = props.variant || "primary";
  const size = props.size || "md";
  const emoji = props.emoji || "✨";

  const variantClasses: Record<string, string> = {
    primary: "bg-gradient-to-r from-slop-purple to-slop-pink hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]",
    secondary: "bg-gradient-to-r from-slop-cyan to-slop-green hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]",
    danger: "bg-gradient-to-r from-slop-orange to-slop-pink hover:shadow-[0_0_30px_rgba(251,146,60,0.5)]",
  };

  const sizeClasses: Record<string, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      onClick$={props.onClick$}
      class={`
        rounded-xl font-bold text-white transition-all duration-200
        active:scale-95 hover:-translate-y-0.5 select-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${props.class || ""}
      `}
    >
      <span class="mr-2">{emoji}</span>
      {props.label}
    </button>
  );
});
