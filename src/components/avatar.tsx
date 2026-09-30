/** Couleurs des membres du foyer (dans l'ordre du foyer). */
export const MEMBER_COLORS = ["#d9572b", "#2c6aa0", "#2f8a4c", "#9b4dca", "#b7791f", "#c2417a", "#0f8b8d", "#5b6b7a"];

export function memberColor(index: number) {
  return MEMBER_COLORS[index % MEMBER_COLORS.length];
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function Avatar({ name, index, size = 32, dim = false }: { name: string; index: number; size?: number; dim?: boolean }) {
  return (
    <span
      className={`inline-grid flex-none place-items-center rounded-full font-extrabold text-white ${dim ? "opacity-35 grayscale" : ""}`}
      style={{ width: size, height: size, background: memberColor(index), fontSize: size * 0.38 }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
