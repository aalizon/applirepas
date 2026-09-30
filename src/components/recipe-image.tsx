import { UtensilsCrossed } from "lucide-react";

const TINTS = ["from-orange-200 to-rose-200", "from-amber-200 to-lime-200", "from-emerald-200 to-teal-200", "from-sky-200 to-indigo-200", "from-fuchsia-200 to-orange-200"];

/** Photo d'une recette, avec une vignette colorée quand il n'y en a pas. */
export function RecipeImage({
  src,
  title,
  className = "",
  rounded = "rounded-2xl",
}: {
  src: string | null | undefined;
  title: string;
  className?: string;
  rounded?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={title} loading="lazy" className={`${rounded} object-cover ${className}`} />;
  }
  const tint = TINTS[[...title].reduce((s, c) => s + c.charCodeAt(0), 0) % TINTS.length];
  return (
    <div className={`${rounded} grid place-items-center bg-gradient-to-br ${tint} text-black/40 ${className}`} aria-hidden>
      <UtensilsCrossed className="h-1/3 w-1/3 max-h-10 max-w-10" />
    </div>
  );
}
